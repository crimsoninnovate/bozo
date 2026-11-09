#!/usr/bin/env bash
# Site build for the panel's "Siteyi güncelle" (spec 2026-11-09 C): bozo-derleme.service, user bozo-derleme.
# No arguments; DERLEME_DIZINI, DEPO and CIKTI come from the unit. Uploading is bozo-yukle.service (OnSuccess=).
set -euo pipefail

: "${DERLEME_DIZINI:?}" "${DEPO:?}" "${CIKTI:?}"
# shellcheck source=ortak.sh
. "$(dirname "$0")/ortak.sh"

if [ -n "${SERVICE_RESULT:-}" ]; then
  bayat_durumu_kapat derle
  exit 0
fi
[ $# -eq 0 ] || { echo "derle: takes no arguments" >&2; exit 2; }

# One build at a time, and never while yukle.sh is reading CIKTI: both lock the state root.
exec 9<"$KOK"
flock -w 900 9

basarili=0
bitir() {
  local kod=$?
  [ "$basarili" = 1 ] && return 0
  echo "derle: failed (exit $kod)"
  durum_yaz hata "" "" "$GUNLUK" || true
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
if [ ! -d node_modules ] || ! git diff --quiet "$once" "$sonra" -- package-lock.json; then
  npm ci --no-audit --no-fund
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
