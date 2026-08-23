import { CamPanel } from '@/components/ui/CamPanel'
import { sozluk, type Dil } from '@/content'
import { isletme } from '@/content/isletme'
import stil from './GizlilikSayfasi.module.css'

type Props = { dil: Dil }

/**
 * Gizlilik sayfasının gövdesi. Kabuğu (üst bar, alt bilgi) `Kabuk`'tan alır.
 * Tasarım paketinde bu sayfanın çizimi yoktur; ölçüler sitenin kendi iç sayfa
 * kalıbından alınır, bkz. GizlilikSayfasi.module.css.
 *
 * Metnin tamamı sözlükten gelir. 24 Ağustos 2026'da Google Analytics eklenince
 * sayfa yeniden yazıldı: eski üç iddiadan ikisi (çerez yok, ölçüm aracı yok)
 * yanlış hale gelmişti. Aynı turda KKTC için dört bölüm eklendi (yurt dışına
 * aktarım, saklama, haklar, veri sorumlusu). METİN HUKUKÇU ONAYINDAN GEÇMEDİ.
 *
 * `soruMetni` 24 Ağustos 2026'da `mailto:` aldı: `isletme.eposta` o gün geldi.
 * Adres metne yazılmaz, `isletme.eposta`dan basılır; değişirse tek yerde değişir.
 */
export function GizlilikSayfasi({ dil }: Props) {
  const s = sozluk(dil)
  // Sıra Tüzük Madde 4(2)'nin listesini izler: kimlik, amaç, yöntem, dayanak,
  // alıcılar, aktarım, saklama, haklar, geri alma, başvuru.
  const bolumler = [
    { baslik: s.gizlilik.sorumluBaslik, metin: s.gizlilik.sorumluMetni },
    { baslik: s.gizlilik.amacBaslik, metin: s.gizlilik.amacMetni },
    { baslik: s.gizlilik.yontemBaslik, metin: s.gizlilik.yontemMetni },
    { baslik: s.gizlilik.dayanakBaslik, metin: s.gizlilik.dayanakMetni },
    { baslik: s.gizlilik.aliciBaslik, metin: s.gizlilik.aliciMetni },
    { baslik: s.gizlilik.aktarimBaslik, metin: s.gizlilik.aktarimMetni },
    { baslik: s.gizlilik.saklamaBaslik, metin: s.gizlilik.saklamaMetni },
    { baslik: s.gizlilik.haklarBaslik, metin: s.gizlilik.haklarMetni },
    { baslik: s.gizlilik.geriAlmaBaslik, metin: s.gizlilik.geriAlmaMetni },
    { baslik: s.gizlilik.soruBaslik, metin: s.gizlilik.soruMetni, eposta: true },
  ]

  return (
    <article className={stil.sayfa}>
      <div className={stil.icerik}>
        <header className={stil.tepe}>
          <h1 className={stil.baslik}>{s.gizlilik.baslik}</h1>
          <p className={stil.spot}>{s.gizlilik.girisMetni}</p>
        </header>

        <CamPanel opaklik={0.74} dolgu="dar" bulanik={false} className={stil.panel}>
          {bolumler.map((bolum) => (
            <section key={bolum.baslik} className={stil.bolum}>
              <h2 className={stil.bolumBaslik}>{bolum.baslik}</h2>
              <p className={stil.bolumMetin}>
                {bolum.metin}
                {/* Tek bağlantı: veri talebinin gideceği adres. Kaynağı
                    `isletme.eposta`, metne ikinci kez yazılmaz. */}
                {bolum.eposta && isletme.eposta && (
                  <>
                    {' '}
                    <a className={stil.eposta} href={`mailto:${isletme.eposta}`}>
                      {isletme.eposta}
                    </a>
                  </>
                )}
              </p>
            </section>
          ))}
        </CamPanel>

        <p className={stil.guncelleme}>{s.gizlilik.guncellemeMetni}</p>
      </div>
    </article>
  )
}
