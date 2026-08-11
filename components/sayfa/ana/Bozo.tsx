import Link from 'next/link'
import { Bolum } from '@/components/ui/Bolum'
import { CamPanel } from '@/components/ui/CamPanel'
import { EtiketSatiri } from '@/components/ui/EtiketSatiri'
import { FotoYuvasi } from '@/components/ui/FotoYuvasi'
import { sozluk, type Dil } from '@/content'
import { yol } from '@/lib/site'
import stil from './Bozo.module.css'

type Props = { dil: Dil }

/** Ana sayfanın bozo bölümü. Ana Sayfa Alternatif.dc.html:269-294 */
export function Bozo({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <Bolum id="bozo" yogunluk={0.45} className={stil.bolum} eritClassName={stil.erit}>
      <CamPanel opaklik={0.72} dolgu="genis" className={stil.panel}>
        <EtiketSatiri olcek="kart">{s.ana.bozo.kicker}</EtiketSatiri>

        {/* Sözlükteki başlık tasarımın kestiği hali: sonda "dır" yok, ve
            envanterin hazır bloğundaki üçüncü cümle ana sayfada geçmiyor. */}
        <h2 className={stil.baslik}>{s.ana.bozo.baslik}</h2>
        <p className={stil.metin}>{s.ana.bozo.metin}</p>

        <Link href={yol('hikaye', dil)} className={stil.hikayeLinki}>
          <span>{s.ana.bozo.hikayeLinki}</span>
          <span aria-hidden="true" className={stil.linkCizgi} />
        </Link>
      </CamPanel>

      <FotoYuvasi id="ustanin-eli" dil={dil} bicim="portre" />
    </Bolum>
  )
}
