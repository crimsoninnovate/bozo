# Sourced by derle.sh and yukle.sh, not run on its own. Needs DERLEME_DIZINI and CIKTI.
# Bash 3.2 compatible (the tests run on macOS).

# State root (/var/lib/bozo-derleme): DEPO, CIKTI, the build log. Not writable by the web process.
KOK="$(dirname "$CIKTI")"
GUNLUK="$KOK/derleme.log"
GUNLUK_SATIRI=200

# Log files are opened with O_NOFOLLOW and must be regular; "-" is stdin (yukle.sh's root-only log).
# shellcheck disable=SC2016
DURUM_JS='
const fs = process.getBuiltinModule("node:fs")
const [asama, surumHam, not, ...yollar] = process.argv.slice(1)
if (!["derleniyor", "yayinda", "hata"].includes(asama)) throw new Error(`gecersiz asama: ${asama}`)
const satirlar = []
const satirla = (metin) => {
  const parca = metin.split("\n")
  if (parca.at(-1) === "") parca.pop()
  return parca
}
for (const yol of yollar) {
  if (yol === "-") { satirlar.push(...satirla(fs.readFileSync(0, "utf8"))); continue }
  let fd
  try {
    fd = fs.openSync(yol, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW)
  } catch (h) {
    if (h.code !== "ENOENT") satirlar.push(`(gunluk okunamadi: ${yol}: ${h.code})`)
    continue
  }
  try {
    if (!fs.fstatSync(fd).isFile()) { satirlar.push(`(gunluk duz dosya degil: ${yol})`); continue }
    satirlar.push(...satirla(fs.readFileSync(fd, "utf8")))
  } finally {
    fs.closeSync(fd)
  }
}
if (not) satirlar.push(not)
const temiz = satirlar.slice(-Number(process.env.GUNLUK_SATIRI))
  .map((s) => s.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, "").replace(/\r$/, ""))
const surum = /^[1-9][0-9]*$/.test(surumHam) ? Number(surumHam) : null
const durum = { asama, surum, zaman: new Date().toISOString(), gunluk: temiz }
process.stdout.write(`${JSON.stringify(durum)}\n`)
'

# durum_yaz ASAMA SURUM NOT [GUNLUK...]: atomic write of durum.json (temp file in the same dir, then mv).
# SURUM '' is null; NOT, when set, is the last log line. Never run as root: the dir is writable by others.
durum_yaz() {
  local gecici
  [ "$(id -u)" != 0 ] || { echo "durum_yaz: refusing to run as root" >&2; return 1; }
  gecici="$(mktemp "$DERLEME_DIZINI/.durum.XXXXXX")" || return 1
  if ! GUNLUK_SATIRI="$GUNLUK_SATIRI" node -e "$DURUM_JS" "$@" >"$gecici"; then
    rm -f "$gecici"
    echo "durum.json could not be written ($1)" >&2
    return 1
  fi
  chmod 0640 "$gecici"
  mv -f "$gecici" "$DERLEME_DIZINI/durum.json"
}

# Prints the current asama, or nothing when durum.json is missing or unreadable.
durum_asama() {
  # shellcheck disable=SC2016
  node -e '
    const fs = process.getBuiltinModule("node:fs")
    try {
      const fd = fs.openSync(process.argv[1], fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW)
      const d = JSON.parse(fs.readFileSync(fd, "utf8"))
      if (typeof d?.asama === "string") process.stdout.write(d.asama)
    } catch (h) {
      if (h.code !== "ENOENT") console.error(`durum.json okunamadi: ${h.message}`)
    }
  ' "$DERLEME_DIZINI/durum.json"
}

# Prints the menu version in FILE (menu.canli.meta.json), or nothing.
meta_surumu() {
  # shellcheck disable=SC2016
  node -e '
    const fs = process.getBuiltinModule("node:fs")
    try {
      const fd = fs.openSync(process.argv[1], fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW)
      const s = JSON.parse(fs.readFileSync(fd, "utf8")).surum
      if (Number.isInteger(s) && s > 0) process.stdout.write(String(s))
    } catch (h) {
      if (h.code !== "ENOENT") console.error(`menu meta okunamadi, surum bos: ${h.message}`)
    }
  ' "$1"
}

# ExecStopPost= mode (systemd sets SERVICE_RESULT): a unit killed past its trap (SIGKILL after
# TimeoutStartSec) must not leave `derleniyor` behind, or the panel polls forever.
bayat_durumu_kapat() {
  [ "$SERVICE_RESULT" = success ] && return 0
  [ "$(durum_asama)" = derleniyor ] || return 0
  durum_yaz hata "" "$1: unit stopped ($SERVICE_RESULT)" "$GUNLUK"
}
