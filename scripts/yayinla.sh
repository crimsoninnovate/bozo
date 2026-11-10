#!/usr/bin/env bash
# One-command site deploy: the exact steps of README.md > Publishing > Deploy, in that order.
# Stops at the first failure. Holds no secrets: access is the `plesk-206` alias in ~/.ssh/config.
set -euo pipefail

cd "$(dirname "$0")/.."

SUNUCU=plesk-206
DIZIN=/var/www/vhosts/cigercibozo.com/httpdocs
LOG="$(mktemp)"
trap 'rm -f "$LOG"' EXIT

adim() { printf '\n==> %s\n' "$1"; }
dur() { printf 'yayinla: %s\n' "$1" >&2; exit 1; }

adim "Checking that $SUNUCU is reachable"
ssh -o BatchMode=yes -o ConnectTimeout=10 "$SUNUCU" true ||
  dur "cannot reach $SUNUCU over ssh (network, VPN or key). Nothing was built or uploaded."

adim "Building (npm run build)"
npm run build 2>&1 | tee "$LOG"
# A failed menu fetch would bake the seed or an old menu.canli.json and roll the panel's contact details back.
if grep -q 'CANLI MENU ALINAMADI' "$LOG"; then
  dur "the live menu could not be fetched, so the build carries an old menu.
Nothing was uploaded. Fix the API (BOZO_MENU_API) and run again."
fi

adim "Uploading out/ to $SUNUCU"
rsync -az --delete out/ "$SUNUCU:$DIZIN/"

adim "Setting owners (chown twice, chmod 750) in one ssh call"
ssh "$SUNUCU" "D=$DIZIN;
  chown -R engincaglar:psacln \"\$D\" && chown engincaglar:psaserv \"\$D\" && chmod 750 \"\$D\""

adim "Verifying: plesk repair fs"
REPAIR="$(ssh "$SUNUCU" 'plesk repair fs cigercibozo.com -n' 2>&1)" || {
  printf '%s\n' "$REPAIR"
  dur "plesk repair fs exited with an error (output above)."
}
printf '%s\n' "$REPAIR"
# Fail closed: only Plesk's own summary line counts as a clean result.
grep -q 'Error messages: 0' <<<"$REPAIR" ||
  dur "plesk repair fs did not report 'Error messages: 0'; could not confirm a clean result (output above)."

adim "Verifying: no x-robots-tag header (the site is indexed)"
# Bare assignment: set -e aborts if curl fails, so an unreachable site cannot read as "0 headers".
# Retries: Cloudflare answers a stray 522 now and then (three on 10 Nov 2026, none in the origin logs).
BASLIKLAR="$(curl -fsSI --retry 3 --retry-all-errors --retry-delay 2 https://cigercibozo.com/)"
ROBOTS="$(grep -ci x-robots-tag <<<"$BASLIKLAR" || true)"
[ "$ROBOTS" = 0 ] || dur "the site sends an x-robots-tag header ($ROBOTS). It must stay indexable."

adim "Verifying: security headers from public/.htaccess"
# They sit inside <IfModule mod_headers.c>, so a server change would drop them silently.
for baslik in strict-transport-security x-content-type-options x-frame-options; do
  grep -qi "^$baslik:" <<<"$BASLIKLAR" || dur "the site no longer sends $baslik; check mod_headers and public/.htaccess."
done

adim "Verifying: checksum dry run, no file lines expected"
# rsync runs on its own so a failure aborts the script instead of reading as "no differences".
DRY="$(rsync -az --delete --checksum --no-owner --no-group --no-perms --dry-run --itemize-changes \
  out/ "$SUNUCU:$DIZIN/")"
DIFF="$(grep -E '^(\*deleting|[<>ch.][fLDS])' <<<"$DRY" || true)"
if [ -n "$DIFF" ]; then
  printf '%s\n' "$DIFF"
  dur "the server differs from out/ (files above). The deploy is not complete."
fi

printf '\nyayinla: done. Server matches out/.\n'
