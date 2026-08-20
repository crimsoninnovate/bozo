import { CanliSaat } from '@/components/saat/CanliSaat'
import { DurumCipi } from '@/components/saat/DurumCipi'
import { GunMerdiveni } from '@/components/saat/GunMerdiveni'
import { IlerlemeRayi } from '@/components/saat/IlerlemeRayi'
import { KapanisNotu } from '@/components/saat/KapanisNotu'
import { sozluk, type Dil } from '@/content'
import stil from './OcakKarti.module.css'

/**
 * Hero'nun sağ kolonu: canlı ocak kartı (SPEC.md §5). Beş blok, hepsi tek
 * durum kaynağından (`useGirneSaati`) besleniyor. Kart yeni, içindekilerin
 * dördü eskiden hero'da zaten vardı; tek yeni parça ilerleme rayı.
 */
export function OcakKarti({ dil }: { dil: Dil }) {
  const s = sozluk(dil)
  return (
    <div className={stil.kart}>
      <div className={stil.baslikSatiri}>
        <span className={stil.etiket}>{s.ana.hero.saatEtiketi}</span>
        <DurumCipi dil={dil} boy="kucuk" kisaKapali />
      </div>

      <CanliSaat boy="dev" />
      <KapanisNotu dil={dil} />
      <IlerlemeRayi dil={dil} />
      <GunMerdiveni dil={dil} />
    </div>
  )
}
