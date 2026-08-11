import { AnimasyonluSayac } from '@/components/ui/AnimasyonluSayac'
import { Bolum } from '@/components/ui/Bolum'
import { CamPanel } from '@/components/ui/CamPanel'
import { FotoYuvasi } from '@/components/ui/FotoYuvasi'
import { TaneDizilimi } from '@/components/ui/TaneDizilimi'
import { sozluk, type Dil } from '@/content'
import stil from './Iddia.module.css'

type Props = { dil: Dil }

type HucreProps = { deger: React.ReactNode; etiket: string }

function SayacHucresi({ deger, etiket }: HucreProps) {
  return (
    <div className={stil.hucre}>
      <span className={stil.sayi}>{deger}</span>
      <span className={stil.etiket}>{etiket}</span>
    </div>
  )
}

/** Ana sayfanın iddia bölümü. Ana Sayfa Alternatif.dc.html:128-167 */
export function Iddia({ dil }: Props) {
  const s = sozluk(dil)
  const { sayac1, sayac2, sayac3 } = s.ana.iddia

  return (
    <Bolum id="iddia" yogunluk={0.55} className={stil.bolum} eritClassName={stil.erit}>
      <CamPanel opaklik={0.72} dolgu="genis" className={stil.panel}>
        <h2 className={stil.baslik}>{s.ana.iddia.baslik}</h2>
        <p className={stil.metin}>{s.ana.iddia.metin}</p>
        <div className={stil.sayaclar}>
          <SayacHucresi deger={<AnimasyonluSayac hedef={Number(sayac1.deger)} />} etiket={sayac1.etiket} />
          {/* "4+2" bir sayı değil, bir oran; tasarımda da data-sayac taşımaz (Ana:139). */}
          <SayacHucresi deger={sayac2.deger} etiket={sayac2.etiket} />
          <SayacHucresi deger={<AnimasyonluSayac hedef={Number(sayac3.deger)} />} etiket={sayac3.etiket} />
        </div>
      </CamPanel>

      <FotoYuvasi id="tane-yakin-cekim" dil={dil} bicim="portre">
        <span aria-hidden="true" className={stil.ortaRay}>
          <TaneDizilimi adet={6} buyuk={22} kucuk={13} bosluk={11} ton="anahat" />
        </span>
      </FotoYuvasi>
    </Bolum>
  )
}
