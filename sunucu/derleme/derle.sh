#!/usr/bin/env bash
# Site build for the panel's "Siteyi güncelle" (spec 2026-11-09 C): user bozo-derleme, in kap.sh's container.
# No arguments; DERLEME_DIZINI, DEPO and CIKTI come from kap.sh. Uploading is bozo-yukle.service (ExecStartPost=).
set -euo pipefail
# depo/, cikti/ and the log stay closed to bozo-panel, which may traverse the state root (0710).
umask 0027

: "${DERLEME_DIZINI:?}" "${DEPO:?}" "${CIKTI:?}"
# shellcheck source=ortak.sh
. "$(dirname "$0")/ortak.sh"

# Exists only while this run holds the lock and has not reached its end (PrivateTmp).
SAHIPLIK="${TMPDIR:-/tmp}/bozo-derle.sahip"
if [ -n "${SERVICE_RESULT:-}" ]; then
  if [ -e "$SAHIPLIK" ]; then bayat_durumu_kapat derle; rm -f "$SAHIPLIK"
  # docker run 125-127: the container never ran this script. Drop the request, or the path unit retries silently.
  elif [[ "${EXIT_STATUS:-}" =~ ^12[5-7]$ ]] && exec 9<"$KOK" && flock -n 9; then
    rm -f "$DERLEME_DIZINI/istek"
    durum_yaz hata "" "derle: build did not start (docker exit $EXIT_STATUS)"
  fi
  exit 0
fi
[ $# -eq 0 ] || { echo "derle: takes no arguments" >&2; exit 2; }

# One build at a time, and never while yukle.sh is reading CIKTI: both lock the state root.
rm -f "$SAHIPLIK"
exec 9<"$KOK"
flock -w 900 9
: >"$SAHIPLIK"

basarili=0
bitir() {
  local kod=$?
  if [ "$basarili" != 1 ]; then
    echo "derle: failed (exit $kod)"
    durum_yaz hata "" "" "$GUNLUK" || true
  fi
  rm -f "$SAHIPLIK"
}
trap bitir EXIT
trap 'exit 143' TERM INT HUP
exec >"$GUNLUK" 2>&1

# Taken first, so a request made during the build triggers the next run. Never read: the web process wrote it.
rm -f "$DERLEME_DIZINI/istek"
echo "derle: started $(date -u +%Y-%m-%dT%H:%M:%SZ)"
durum_yaz derleniyor "" "" "$GUNLUK"

cd "$DEPO"
once="$(git rev-parse HEAD)"
git pull --ff-only
sonra="$(git rev-parse HEAD)"
echo "derle: $once -> $sonra"
# The lockfile digest is recorded only after npm ci succeeds, so a failed install is retried next run.
ozet="$(node -e 'const { createHash } = process.getBuiltinModule("node:crypto")
  const fs = process.getBuiltinModule("node:fs")
  process.stdout.write(createHash("sha256").update(fs.readFileSync("package-lock.json")).digest("hex"))')"
if [ "$(cat node_modules/.bozo-kilit 2>/dev/null || true)" != "$ozet" ]; then
  npm ci --no-audit --no-fund
  mkdir -p node_modules && printf '%s\n' "$ozet" >node_modules/.bozo-kilit
fi
npm run build
# Same rule as scripts/yayinla.sh: an old menu would roll the panel's contact details back.
if grep -q 'CANLI MENU ALINAMADI' "$GUNLUK"; then
  echo "derle: the live menu could not be fetched; nothing staged"
  exit 1
fi

# Staged beside CIKTI, then swapped in, so CIKTI is always one complete build.
rm -rf "$CIKTI.yeni"
cp -R out "$CIKTI.yeni"
if [ -f content/menu.canli.meta.json ]; then cp content/menu.canli.meta.json "$CIKTI.yeni/"; fi
rm -rf "$CIKTI"
mv "$CIKTI.yeni" "$CIKTI"

basarili=1
# durum stays `derleniyor` until yukle.sh writes `yayinda` or `hata`.
echo "derle: build staged in $CIKTI, upload next"
