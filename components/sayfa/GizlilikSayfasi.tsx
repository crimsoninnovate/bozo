import { CamPanel } from '@/components/ui/CamPanel'
import { sozluk, type Dil } from '@/content'
import stil from './GizlilikSayfasi.module.css'

type Props = { dil: Dil }

/**
 * Gizlilik sayfasının gövdesi. Kabuğu (üst bar, alt bilgi) `Kabuk`'tan alır.
 * Tasarım paketinde bu sayfanın çizimi yoktur; ölçüler sitenin kendi iç sayfa
 * kalıbından alınır, bkz. GizlilikSayfasi.module.css.
 *
 * Metnin tamamı sözlükten gelir ve Task 3'te onaylanmıştır. Dört bölümün üç
 * iddiası (çerez yok, form yok, ölçüm aracı yok) kodda doğrulandı; sonuç
 * docs/surec/rapor/task-14-report.md içinde.
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
      </div>
    </article>
  )
}
