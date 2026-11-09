#!/usr/bin/env bash
# Upload of the staged build: bozo-yukle.service, root, OnSuccess= of bozo-derleme.service.
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
# so root touching those paths could be steered by a symlink. Root keeps only rsync, chown, chmod, plesk.
olarak_derleme() {
  if [ "${YUKLE_KURU:-}" = 1 ]; then "$@"; return; fi
  # shellcheck disable=SC2016
  runuser -u bozo-derleme -- env -i PATH="$PATH" DERLEME_DIZINI="$DERLEME_DIZINI" CIKTI="$CIKTI" \
    SERVICE_RESULT="${SERVICE_RESULT:-}" bash -c '. "$0"; "$@"' "$ORTAK" "$@"
}

if [ -n "${SERVICE_RESULT:-}" ]; then
  olarak_derleme bayat_durumu_kapat yukle
  exit 0
fi
[ $# -eq 0 ] || { echo "yukle: takes no arguments" >&2; exit 2; }

exec 9<"$KOK"
flock -w 600 9

# Root's own log in its private /tmp; the status writer gets it on stdin, never by path.
YUKLEME_GUNLUGU="$(mktemp "${TMPDIR:-/tmp}/bozo-yukle.XXXXXX")"
basarili=0
bitir() {
  local kod=$?
  if [ "$basarili" != 1 ]; then
    echo "yukle: failed (exit $kod)"
    olarak_derleme durum_yaz hata "" "" "$GUNLUK" - <"$YUKLEME_GUNLUGU" || true
  fi
  cat "$YUKLEME_GUNLUGU" >&3
  rm -f "$YUKLEME_GUNLUGU"
}
exec 3>&2
trap bitir EXIT
trap 'exit 143' TERM INT HUP
exec >"$YUKLEME_GUNLUGU" 2>&1

dur() { echo "yukle: $1"; exit 1; }

[ ! -L "$CIKTI" ] && [ -d "$CIKTI" ] || dur "$CIKTI is not a directory; nothing uploaded"
for dosya in "${BEKCI[@]}"; do
  [ -f "$CIKTI/$dosya" ] || dur "$dosya missing from the build; nothing uploaded"
done

if [ "${YUKLE_KURU:-}" != 1 ]; then
  # No symlinks and plain modes: the build user wrote CIKTI, root copies it.
  rsync -a --delete --no-links --chmod=D755,F644 --exclude=/menu.canli.meta.json "$CIKTI/" "$HTTPDOCS/"
  chown -R engincaglar:psacln "$HTTPDOCS"
  chown engincaglar:psaserv "$HTTPDOCS"
  chmod 750 "$HTTPDOCS"
  onarim="$(plesk repair fs cigercibozo.com -n 2>&1)" || { echo "$onarim"; dur "plesk repair fs exited with an error"; }
  echo "$onarim"
  # Fail closed: only Plesk's own summary line counts as a clean result.
  grep -q 'Error messages: 0' <<<"$onarim" || dur "plesk repair fs did not report 'Error messages: 0'"
fi

surum="$(olarak_derleme meta_surumu "$CIKTI/menu.canli.meta.json")"
echo "yukle: live, menu version ${surum:-none}"
olarak_derleme durum_yaz yayinda "$surum" "" "$GUNLUK" - <"$YUKLEME_GUNLUGU"
basarili=1
