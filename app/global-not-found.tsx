import type { Metadata } from 'next'
import { HataSayfasi } from '@/components/sayfa/HataSayfasi'
import { sozluk } from '@/content'
import { fontSiniflari } from '@/lib/fontlar'
import './globals.css'

/*
 * Eşleşmeyen her URL'nin sayfası.
 *
 * `experimental.globalNotFound` (next.config.ts) ile çalışır ve kök layout'u
 * ATLAR. Bu yüzden `<html>`, `<body>`, `globals.css` ve font sınıflarını kendisi
 * taşımak zorundadır; sıradan bir `app/not-found.tsx` çoklu kök layout kurulumunda
 * `out/404.html` dosyasını `<html>` ve `<body>` olmadan, dolayısıyla stilsiz
 * üretirdi. Kaynak (eğitim verisi değil, diskteki sürüm):
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md
 *
 * Fontlar `lib/fontlar.ts`'te tek yerde tanımlıdır ve iki kök layout ile burası
 * aynı örneği paylaşır; sınıflar elle tekrar yazılmaz.
 *
 * DİL: statik export tek bir `out/404.html` üretir ve dosya sunucusu istek yolunu
 * sayfaya geçirmez, yani SUNUCU hangi dilin 404'ü olduğunu bilemez ve daima TR
 * basar. `<html lang="tr">` ve aşağıdaki `metadata` bu ilk boyamanın değerleridir,
 * son sözü değil: `HataSayfasi` bağlandıktan sonra `location.pathname`'e bakıp
 * `/en/` altında metni, `lang`'i ve başlığı İngilizceye çevirir.
 *
 * Kök layout'ların Restaurant JSON-LD'si burada bilinçli olarak yok: bulunamayan
 * bir sayfa işletmeyi tarif etmez.
 */

const s = sozluk('tr')

// Başlık sözlükten bileştirilir, yeni metin yazılmaz: ayırıcı, ortak.sayfaMeta'nın
// kendi kalıbıdır ("Menü · Ciğerci Bozo").
export const metadata: Metadata = {
  title: `${s.hata.kicker} · ${s.ortak.marka.ad}`,
  description: s.hata.metin,
}

export default function GlobalNotFound() {
  return (
    <html lang="tr" className={fontSiniflari}>
      <body>
        <HataSayfasi />
      </body>
    </html>
  )
}
