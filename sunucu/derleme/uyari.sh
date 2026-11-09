#!/usr/bin/env bash
# Run by bozo-uyari.service (user bozo-derleme) whenever durum.json changes: one email per `hata`, keyed by its
# `zaman`. No arguments; UYARI_ALICI empty means alerts are off. Bash 3.2 compatible (the tests run on macOS).
set -euo pipefail
[ $# -eq 0 ] || { echo "uyari: takes no arguments" >&2; exit 2; }
: "${DERLEME_DIZINI:?}"

if [ -z "${UYARI_ALICI:-}" ]; then
  echo "uyari: UYARI_ALICI is empty, alerts are off" >&2
  exit 0
fi

# SMTP to the local Postfix, not sendmail: Plesk's DKIM milter only signs smtpd mail (smtpd_milters).
# shellcheck disable=SC2016
UYARI_JS='
const fs = process.getBuiltinModule("node:fs")
const net = process.getBuiltinModule("node:net")
const [yol, iz, alici, gonderen, port] = process.argv.slice(1)
if (![alici, gonderen].every((a) => /^[^\s<>,@]+@[A-Za-z0-9.-]+$/.test(a))) {
  console.error("uyari: UYARI_ALICI and UYARI_GONDEREN must be one plain address each")
  process.exit(2)
}
let d
try {
  const fd = fs.openSync(yol, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW)
  d = JSON.parse(fs.readFileSync(fd, "utf8"))
} catch (h) {
  console.error(`uyari: durum.json okunamadi: ${h.message}`)
  process.exit(0)
}
if (d?.asama !== "hata" || typeof d.zaman !== "string" || !/^[0-9T:.Z-]{1,40}$/.test(d.zaman)) process.exit(0)
let son = ""
try { son = fs.readFileSync(iz, "utf8").trim() } catch (h) { if (h.code !== "ENOENT") throw h }
if (son === d.zaman) process.exit(0)

const temiz = (s) => String(s)
  .replace(/\x1b\][^\x07]*\x07|\x1b\[[0-9;?]*[A-Za-z]/g, "")
  .replace(/[\x00-\x08\x0a-\x1f\x7f]/g, "")
  .slice(0, 900)
const gunluk = (Array.isArray(d.gunluk) ? d.gunluk : []).slice(-40).map(temiz)
const saat = new Date(d.zaman)
  .toLocaleString("tr-TR", { timeZone: "Asia/Famagusta", dateStyle: "long", timeStyle: "short" })
const konu = `=?UTF-8?B?${Buffer.from("Ciğerci Bozo: site güncellemesi başarısız").toString("base64")}?=`
const ileti = [
  `From: ${gonderen}`, `To: ${alici}`, `Subject: ${konu}`, `Date: ${new Date().toUTCString()}`, "MIME-Version: 1.0",
  "Content-Type: text/plain; charset=UTF-8", "Content-Transfer-Encoding: 8bit", "",
  `Panelden başlatılan site güncellemesi başarısız oldu (${saat}); son değişiklikler sitede görünmüyor.`,
  "Tekrar denemek için panelde Siteyi Güncelle düğmesine basın: https://cigercibozo.com/yonetim/",
  "",
  "Günlüğün son satırları:",
  ...gunluk,
].map((s) => (s.startsWith(".") ? `.${s}` : s)).join("\r\n")

const adimlar = [
  [null, 220], ["EHLO localhost", 250], [`MAIL FROM:<${gonderen}>`, 250], [`RCPT TO:<${alici}>`, 250],
  ["DATA", 354], [`${ileti}\r\n.`, 250], ["QUIT", 221],
]
let i = 0
let tampon = ""
const s = net.connect({ host: "127.0.0.1", port: Number(port) })
const dur = (neden) => {
  console.error(`uyari: smtp ${adimlar[i]?.[0]?.split(/[\r:]/)[0] ?? "baglanti"}: ${neden}`)
  s.destroy()
  process.exit(1)
}
s.setEncoding("utf8")
s.setTimeout(30000, () => dur("zaman asimi"))
s.on("error", (h) => dur(h.message))
s.on("close", () => { if (i < adimlar.length) dur("baglanti erken kapandi") })
s.on("data", (parca) => {
  tampon += parca
  let m
  while ((m = /^(\d{3}) [^\n]*\n/m.exec(tampon))) {
    tampon = tampon.slice(m.index + m[0].length)
    if (Number(m[1]) !== adimlar[i][1]) dur(m[0].trim())
    if (++i === adimlar.length) {
      fs.writeFileSync(`${iz}.yeni`, `${d.zaman}\n`)
      fs.renameSync(`${iz}.yeni`, iz)
      s.end()
      return
    }
    s.write(`${adimlar[i][0]}\r\n`)
  }
})
'

exec node -e "$UYARI_JS" "$DERLEME_DIZINI/durum.json" "$(dirname "$DERLEME_DIZINI")/uyari-son" \
  "$UYARI_ALICI" "${UYARI_GONDEREN:-web@cigercibozo.com}" "${UYARI_SMTP_PORT:-25}"
