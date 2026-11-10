#!/usr/bin/env bash
# Upload of the staged build: bozo-yukle.service, root, started by bozo-derleme.service's ExecStartPost=.
# Takes no input: no arguments, fixed paths. Steps and owners are scripts/yayinla.sh's server half.
# YUKLE_KURU=1 (tests only) runs the guard and the status write, and only then reads paths from the env.
set -euo pipefail

if [ "${YUKLE_KURU:-}" = 1 ]; then
  : "${DERLEME_DIZINI:?}" "${CIKTI:?}"
else
  DERLEME_DIZINI=/var/lib/bozo-derleme/panel
  CIKTI=/var/lib/bozo-derleme/cikti
fi
HTTPDOCS=/var/www/vhosts/cigercibozo.com/httpdocs
# The 9 November 2026 incident: a deploy shipped with these deleted.
BEKCI=(index.html favicon.svg sosyal-kart.jpg marka/rozet.svg foto/tane-yakin-cekim.webp)
ORTAK="$(cd "$(dirname "$0")" && pwd)/ortak.sh"
# shellcheck source=ortak.sh
. "$ORTAK"

# Every read and write under DERLEME_DIZINI and CIKTI runs as bozo-derleme: other users can write there,
# so root touching those paths could be steered by a symlink or a hard link. Root reads CIKTI only as a
# tar stream bozo-derleme produced, into its own private stage.
olarak_derleme() {
  if [ "${YUKLE_KURU:-}" = 1 ]; then "$@"; return; fi
  # shellcheck disable=SC2016
  runuser -u bozo-derleme -- env -i PATH="$PATH" DERLEME_DIZINI="$DERLEME_DIZINI" CIKTI="$CIKTI" \
    SERVICE_RESULT="${SERVICE_RESULT:-}" bash -c '. "$0"; "$@"' "$ORTAK" "$@"
}

# Exists only while this run holds the lock and has not written its final status (PrivateTmp, root only).
SAHIPLIK="${TMPDIR:-/tmp}/bozo-yukle.sahip"
if [ -n "${SERVICE_RESULT:-}" ]; then
  # A run that never got the lock must not touch the status of a build it does not own.
  if [ -e "$SAHIPLIK" ]; then olarak_derleme bayat_durumu_kapat yukle; rm -f "$SAHIPLIK"; fi
  exit 0
fi
[ $# -eq 0 ] || { echo "yukle: takes no arguments" >&2; exit 2; }

rm -f "$SAHIPLIK"
exec 9<"$KOK"
flock -w 600 9
: >"$SAHIPLIK"

# Root's own log in its private /tmp; the status writer gets it on stdin, never by path.
YUKLEME_GUNLUGU="$(mktemp "${TMPDIR:-/tmp}/bozo-yukle.XXXXXX")"
SAHNE="$(mktemp -d "${TMPDIR:-/tmp}/bozo-sahne.XXXXXX")"
basarili=0
bitir() {
  local kod=$?
  if [ "$basarili" != 1 ]; then
    echo "yukle: failed (exit $kod)"
    olarak_derleme durum_yaz hata "" "" "$GUNLUK" - <"$YUKLEME_GUNLUGU" || true
  fi
  rm -f "$SAHIPLIK"
  cat "$YUKLEME_GUNLUGU" >&3
  rm -f "$YUKLEME_GUNLUGU"
  rm -rf "$SAHNE"
}
exec 3>&2
trap bitir EXIT
trap 'exit 143' TERM INT HUP
exec >"$YUKLEME_GUNLUGU" 2>&1

dur() { echo "yukle: $1"; exit 1; }

# Prints the first member that is not a regular file or directory under a relative path without `..`.
arsivi_denetle() {
  local turler adlar kotu
  turler="$(tar -tvf "$1")" && adlar="$(tar -tf "$1")" || return 1
  # One line per member in both listings, or a name holds a newline.
  if [ "$(printf '%s\n' "$turler" | wc -l)" != "$(printf '%s\n' "$adlar" | wc -l)" ]; then
    echo "listings disagree (newline in a name)"; return 0
  fi
  kotu="$(printf '%s\n' "$turler" | grep -v '^[-d]' || true)"
  [ -n "$kotu" ] || kotu="$(printf '%s\n' "$adlar" | grep -E '^/|(^|/)\.\.(/|$)' || true)"
  printf '%s' "${kotu%%$'\n'*}"
}

# bozo-derleme reads CIKTI (so a hard link to a file it cannot read fails here); root only checks and unpacks.
# Root's cat writes the file, so no fd of the build user's survives into the listing (pipefail catches tar).
olarak_derleme tar -C "$CIKTI" -cf - . | cat >"$SAHNE/cikti.tar" || dur "could not archive $CIKTI; nothing uploaded"
kotu="$(arsivi_denetle "$SAHNE/cikti.tar")" || dur "could not list the build archive; nothing uploaded"
[ -z "$kotu" ] || dur "the build holds a link, special file or unsafe path; nothing extracted: $kotu"
AGAC="$SAHNE/agac"
mkdir -m 0700 "$AGAC"
CIKAR=(--no-same-owner --no-same-permissions)
# The `./` member must not reset agac's mode; bsdtar (macOS tests) has no such flag.
case "$(tar --version)" in *GNU*) CIKAR+=(--no-overwrite-dir) ;; esac
tar -C "$AGAC" "${CIKAR[@]}" -xf "$SAHNE/cikti.tar"
rm -f "$AGAC/menu.canli.meta.json"
# Second net after the listing: only regular files with one link, and directories.
garip="$(find "$AGAC" \( ! -type f ! -type d \) -o \( -type f -links +1 \))"
[ -z "$garip" ] || dur "the build holds links or special files; nothing uploaded: ${garip%%$'\n'*}"
for dosya in "${BEKCI[@]}"; do
  [ -f "$AGAC/$dosya" ] || dur "$dosya missing from the build; nothing uploaded"
done

if [ "${YUKLE_KURU:-}" != 1 ]; then
  # httpdocs and its parent belong to engincaglar, the score server's user, so root never writes there:
  # modes are set in root's private stage and engincaglar copies. --no-group keeps httpdocs' psaserv.
  find "$AGAC" -type d -exec chmod 755 {} +
  find "$AGAC" -type f -exec chmod 644 {} +
  chmod 750 "$AGAC"
  chown -R engincaglar:psacln "$AGAC"
  chmod 711 "$SAHNE"
  runuser -u engincaglar -- rsync -a --no-owner --no-group --delete --no-links "$AGAC/" "$HTTPDOCS/"
  onarim="$(plesk repair fs cigercibozo.com -n 2>&1)" || { echo "$onarim"; dur "plesk repair fs exited with an error"; }
  echo "$onarim"
  # Fail closed: only Plesk's own summary line counts as a clean result.
  grep -q 'Error messages: 0' <<<"$onarim" || dur "plesk repair fs did not report 'Error messages: 0'"
fi

surum="$(olarak_derleme meta_surumu "$CIKTI/menu.canli.meta.json")"
echo "yukle: live, menu version ${surum:-none}"
olarak_derleme durum_yaz yayinda "$surum" "" "$GUNLUK" - <"$YUKLEME_GUNLUGU"
basarili=1
rm -f "$SAHIPLIK"
