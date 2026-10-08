import { createServer } from 'node:http'
import { bellekDepoKur } from './bellekDepo.ts'
import type { Depo } from './depo.ts'
import { listeKur } from './ip.ts'
import { mariaDepoKur } from './mariaDepo.ts'
import { uygulamaKur, type Ayar } from './uygulama.ts'

/*
 * Giriş noktası. Gizli değerler ortam değişkenlerinden (spec §10):
 *   PORT              dinlenen port, varsayılan 8402
 *   KOKEN             CORS'a izinli kökenler, virgülle; varsayılan https://cigercibozo.com
 *   GIZLI_TUZ         ödül kodu HMAC tuzu, zorunlu
 *   DB_URL            mariadb://kullanici:sifre@sunucu:3306/veritabani; yoksa bellek deposu (yalnız yerel)
 *   YONETIM_KULLANICI, YONETIM_SIFRE   /yonetim temel kimliği; biri yoksa yönetim uçları 503 döner
 *   GUVENILIR_VEKIL   önündeki yerel vekilin adresleri, virgülle; varsayılan 127.0.0.1,::1
 *   KAMPANYA_BITIS    ISO tarih; şampiyon kayıtları bundan 90 gün sonra silinir (spec §8)
 */
const ZAMANLAYICI_MS = 60_000

const liste = (deger: string): string[] => deger.split(',').map((k) => k.trim()).filter(Boolean)

function ortamOku(): { port: number; ayar: Ayar; dbUrl: string | null } {
  const env = process.env
  const tuz = env.GIZLI_TUZ
  if (!tuz) throw new Error('GIZLI_TUZ tanımlı değil')
  const kampanya = env.KAMPANYA_BITIS ? Date.parse(env.KAMPANYA_BITIS) : Number.NaN
  const yonetim =
    env.YONETIM_KULLANICI && env.YONETIM_SIFRE ? { kullanici: env.YONETIM_KULLANICI, sifre: env.YONETIM_SIFRE } : null
  return {
    port: Number(env.PORT ?? 8402),
    dbUrl: env.DB_URL ?? null,
    ayar: {
      kokenler: liste(env.KOKEN ?? 'https://cigercibozo.com'),
      tuz,
      yonetim,
      guvenilirVekil: listeKur(liste(env.GUVENILIR_VEKIL ?? '127.0.0.1,::1')),
      kampanyaBitis: Number.isNaN(kampanya) ? null : kampanya,
    },
  }
}

function depoKur(dbUrl: string | null): Depo {
  if (dbUrl) return mariaDepoKur(dbUrl)
  console.warn('DB_URL yok: bellek deposu, süreç bitince her şey silinir')
  return bellekDepoKur()
}

const { port, ayar, dbUrl } = ortamOku()
const depo = depoKur(dbUrl)
const uygulama = uygulamaKur(depo, ayar)
const sunucu = createServer((req, res) => {
  uygulama.isle(req, res).catch((hata: unknown) => {
    console.error('yanıt yazılamadı', hata)
    if (!res.headersSent) res.writeHead(500).end()
  })
})

const zamanlayici = setInterval(() => {
  const simdi = Date.now()
  uygulama.temizle(simdi)
  uygulama.isler.calistir(simdi).then(
    (kapananlar) => kapananlar.forEach((d) => console.info('dönem kapandı', d)),
    (hata: unknown) => console.error('zamanlanmış iş başarısız', hata),
  )
}, ZAMANLAYICI_MS)

sunucu.listen(port, () => console.info(`skor sunucusu ${port} portunda, depo: ${dbUrl ? 'mariadb' : 'bellek'}`))

for (const sinyal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(sinyal, () => {
    clearInterval(zamanlayici)
    sunucu.close(() => depo.kapat().finally(() => process.exit(0)))
  })
}
