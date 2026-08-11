import { CanliSaat } from '@/components/saat/CanliSaat'
import { VardiyaSeridi } from '@/components/saat/VardiyaSeridi'
import { Bolum } from '@/components/ui/Bolum'
import { sozluk, type Dil } from '@/content'
import stil from './Gece.module.css'

type Props = { dil: Dil }

/** Ana sayfanın gece bölümü. Ana Sayfa Alternatif.dc.html:244-267 */
export function Gece({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <Bolum id="gece" yogunluk={1.25} className={stil.bolum} eritClassName={stil.erit}>
      {/* Arka plandaki dev saat; konumunu ve rengini CanliSaat'in kendi
          `hayalet` sınıfı taşır, erit katmanına göre yerleşir (Ana:246). */}
      <CanliSaat boy="hayalet" />

      <div className={stil.saatSatiri}>
        <CanliSaat boy="orta" />
        <span aria-hidden="true" className={stil.cizgi} />
        <span className={stil.etiket}>{s.ana.gece.etiket}</span>
      </div>

      <h2 className={stil.baslik}>{s.ana.gece.baslik}</h2>
      <p className={stil.metin}>{s.ana.gece.metin}</p>

      {/* Şeridin `margin-top:6px`'i ve yedinci öğesi (bitiş notu) bileşenin
          içinde; sarmalayıcı gerekmez (VardiyaSeridi.module.css:1-7). */}
      <VardiyaSeridi dil={dil} />
    </Bolum>
  )
}
