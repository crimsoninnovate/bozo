#!/usr/bin/env bash
# ExecStart of bozo-derleme.service, root only for the docker CLI: derle.sh runs in the bozo-derleme
# image as bozo-derleme, without capabilities. Fixed paths, no arguments.
set -euo pipefail
[ $# -eq 0 ] || { echo "kap: takes no arguments" >&2; exit 2; }
KOK=/var/lib/bozo-derleme
# --init forwards systemd's SIGTERM to derle.sh, whose trap writes `hata`.
exec docker run --rm --init --name bozo-derleme-kap \
  --user bozo-derleme --cap-drop ALL --security-opt no-new-privileges \
  --cpus 4 --memory 6g --pids-limit 4096 \
  -e DERLEME_DIZINI="$KOK/panel" -e DEPO="$KOK/depo" -e CIKTI="$KOK/cikti" -e TMPDIR="$KOK/tmp" \
  -e HOME="$KOK" -e NEXT_TELEMETRY_DISABLED=1 -e NO_COLOR=1 -e FORCE_COLOR=0 \
  -v "$KOK:$KOK" -v /opt/bozo-derleme:/opt/bozo-derleme:ro \
  bozo-derleme:1 nice -n 10 /opt/bozo-derleme/derle.sh
