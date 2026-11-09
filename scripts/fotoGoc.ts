/*
 * Tek seferlik: public/foto/tane-yakin-cekim.webp dosyasını skor sunucusuna yükler ve `dosya` adını basar.
 * Çalıştırma: BOZO_YONETIM_ANAHTAR=... node scripts/fotoGoc.ts
 * Basılan adı panelde `tane-yakin-cekim` ve `tane-yakin-cekim-yatay` yuvalarına atamak elle yapılır.
 */
import { readFile } from 'node:fs/promises'

const KOK = new URL('../', import.meta.url)
const API = process.env.NEXT_PUBLIC_OYUN_API || 'https://api.cigercibozo.com'
const ANAHTAR = process.env.BOZO_YONETIM_ANAHTAR
const ZAMAN_ASIMI_MS = 30_000

if (!ANAHTAR) {
  console.error('fotoGoc: BOZO_YONETIM_ANAHTAR tanımlı değil (POST /yonetim/oturum ile alınan Bearer anahtarı).')
  process.exit(1)
}

function dur(mesaj: string, hata?: unknown): never {
  console.error(`fotoGoc: ${mesaj}`, ...(hata === undefined ? [] : [hata]))
  process.exit(1)
}

const dosya = new URL('public/foto/tane-yakin-cekim.webp', KOK)
const govde = await readFile(dosya).catch((h: unknown) => dur(`dosya okunamadı: ${dosya.pathname}`, h))

const yanit = await fetch(`${API}/yonetim/foto`, {
  method: 'POST',
  headers: { 'Content-Type': 'image/webp', Authorization: `Bearer ${ANAHTAR}` },
  body: govde,
  signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
}).catch((h: unknown) => dur(`istek gönderilemedi (ağ ya da ${ZAMAN_ASIMI_MS / 1000} sn zaman aşımı): ${API}`, h))
const metin = await yanit.text()
if (!yanit.ok) {
  dur(`yükleme başarısız (${yanit.status}) ${API}/yonetim/foto: ${metin.slice(0, 200)}`)
}

let ad: unknown
try {
  ad = (JSON.parse(metin) as { dosya?: unknown }).dosya
} catch (h) {
  dur(`yanıt JSON değil: ${metin.slice(0, 200)}`, h)
}
if (typeof ad !== 'string' || !ad) dur(`yanıtta dosya adı yok: ${metin.slice(0, 200)}`)
console.log(`dosya: ${ad}`)
console.log('Panelde "tane-yakin-cekim" ve "tane-yakin-cekim-yatay" yuvalarına bu kareyi ata, yayınla.')
