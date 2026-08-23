import { CamPanel } from '@/components/ui/CamPanel'
import { sozluk, type Dil } from '@/content'
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
 * `soruMetni` bağlantısızdır: iletişim alanlarının hepsi bugün `null`
 * (content/isletme.ts), bu yüzden verilebilecek her hedef yer tutucuya düşerdi.
 * `isletme.eposta` geldiğinde bu satır `mailto:` alır, başka hiçbir şey değişmez.
 */
export function GizlilikSayfasi({ dil }: Props) {
  const s = sozluk(dil)
  const bolumler = [
    { baslik: s.gizlilik.cerezBaslik, metin: s.gizlilik.cerezMetni },
    { baslik: s.gizlilik.veriBaslik, metin: s.gizlilik.veriMetni },
    { baslik: s.gizlilik.olcumBaslik, metin: s.gizlilik.olcumMetni },
    { baslik: s.gizlilik.aktarimBaslik, metin: s.gizlilik.aktarimMetni },
    { baslik: s.gizlilik.saklamaBaslik, metin: s.gizlilik.saklamaMetni },
    { baslik: s.gizlilik.haklarBaslik, metin: s.gizlilik.haklarMetni },
    { baslik: s.gizlilik.sorumluBaslik, metin: s.gizlilik.sorumluMetni },
    { baslik: s.gizlilik.soruBaslik, metin: s.gizlilik.soruMetni },
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
              <p className={stil.bolumMetin}>{bolum.metin}</p>
            </section>
          ))}
        </CamPanel>

        <p className={stil.guncelleme}>{s.gizlilik.guncellemeMetni}</p>
      </div>
    </article>
  )
}
