import { Bolum } from '@/components/ui/Bolum'
import { Buton } from '@/components/ui/Buton'
import { EtiketSatiri } from '@/components/ui/EtiketSatiri'
import { FotoYuvasi } from '@/components/ui/FotoYuvasi'
import { sozluk, type Dil } from '@/content'
import { yol } from '@/lib/site'
import stil from './Bozo.module.css'

type Props = { dil: Dil }

/**
 * Ana sayfanın bozo bölümü. Kaynak UYGULAMA-NOTLARI 5;
 * Ana Sayfa Alternatif.dc.html:269-294 önceki hali.
 *
 * İddia ile birebir aynı düzendeydi (sol kart, sağ plaka) ve sayfadaki dört
 * özdeş kart şablonundan biriydi. Artık ortalanmış bir an: sayfanın en iyi
 * cümlesi tam genişlik alıntı olarak duruyor, plaka altına geniş bir banda
 * indi. Hikaye bağlantısı da 13px metinden butona çıktı.
 */
export function Bozo({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <Bolum id="bozo" yogunluk={0.45} className={stil.bolum} eritClassName={stil.erit}>
      <EtiketSatiri olcek="kart" className={stil.kicker}>
        {s.ana.bozo.kicker}
      </EtiketSatiri>

      {/* Sözlükteki başlık tasarımın kestiği hali: sonda "dır" yok, ve
          envanterin hazır bloğundaki üçüncü cümle ana sayfada geçmiyor. */}
      <h2 className={stil.alinti}>{s.ana.bozo.baslik}</h2>
      <p className={stil.metin}>{s.ana.bozo.metin}</p>

      <Buton tur="ikincil" boy="md" href={yol('hikaye', dil)}>
        {s.ana.bozo.hikayeLinki}
      </Buton>

      <div className={stil.plakaKabi}>
        <FotoYuvasi id="ustanin-eli" dil={dil} bicim="genis" />
      </div>
    </Bolum>
  )
}
