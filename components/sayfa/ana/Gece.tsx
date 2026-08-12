import { CanliSaat } from '@/components/saat/CanliSaat'
import { VardiyaCizelgesi } from '@/components/saat/VardiyaCizelgesi'
import { Bolum } from '@/components/ui/Bolum'
import { sozluk, type Dil } from '@/content'
import stil from './Gece.module.css'

type Props = { dil: Dil }

/**
 * Ana sayfanın gece bölümü. Kaynak UYGULAMA-NOTLARI 4;
 * Ana Sayfa Alternatif.dc.html:244-267 önceki hali.
 *
 * Arka plandaki hayalet saat KALKTI: "ocak" kelimesinin üstüne biniyor ve
 * sağdan kırpılıyordu. Başlık artık kendi genişliğinde, çakışacak dekoratif
 * eleman yok.
 */
export function Gece({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <Bolum id="gece" yogunluk={1.25} className={stil.bolum} eritClassName={stil.erit}>
      {/* Ufuk koru: gece hissi ışıktan gelir, tipografiden değil. */}
      <span aria-hidden="true" className={stil.ufuk} />

      <div className={stil.saatSatiri}>
        <span className={stil.vardiyaEtiketi}>{s.ana.gece.vardiyaEtiketi}</span>
        <span aria-hidden="true" className={stil.cizgi} />
        <CanliSaat boy="orta" />
        <span className={stil.etiket}>{s.ana.gece.etiket}</span>
      </div>

      <h2 className={stil.baslik}>{s.ana.gece.baslik}</h2>
      <p className={stil.metin}>{s.ana.gece.metin}</p>

      <VardiyaCizelgesi dil={dil} />
    </Bolum>
  )
}
