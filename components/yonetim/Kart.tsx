'use client'

import { useId, useState, type ReactNode } from 'react'
import { AcilirOkIkon } from '@/components/ui/Ikonlar'
import { yonetim as m } from '@/content/yonetim'
import stil from './Kart.module.css'

type Props = {
  ad: string
  /** Başlık düzeyi; ikram kartları "İkram ürünleri" alt başlığının altında durur. */
  duzey?: 'h3' | 'h4'
  /** Kapalıyken de düzenlenen alanlar (fiyatlar) ve başlığın sağındaki işaret (Bugün yok). */
  hizli?: ReactNode
  yan?: ReactNode
  /** Tükenmiş kayıt kapalıyken soluk okunur. */
  soluk?: boolean
  /** Kapalıyken görünmeyen bir alanda hata var: kart açılır ve hata düzelene kadar kapanmaz. */
  hatali: boolean
  children: ReactNode
}

/** Kapalı başlayan kayıt kartı; günlük iş (fiyat, Bugün yok) açmadan yapılır, gerisi "Ayrıntılar"da. */
export function AcilirKart({ ad, duzey: Baslik = 'h3', hizli, yan, soluk = false, hatali, children }: Props) {
  const [acik, setAcik] = useState(hatali)
  // Render sırasında: hata geldiği geçişte kart açılır, düzelince kendiliğinden kapanmaz.
  if (hatali && !acik) setAcik(true)
  const adKimlik = useId()
  const govde = useId()
  return (
    <div role="group" aria-labelledby={adKimlik} className={stil.kart} data-soluk={soluk && !acik}>
      <div className={stil.ust}>
        <Baslik id={adKimlik} className={stil.ad}>{ad}</Baslik>
        {yan}
      </div>
      {hizli && <div className={stil.hizli}>{hizli}</div>}
      <button type="button" className={stil.ac} aria-expanded={acik} aria-controls={govde}
        onClick={() => setAcik(!acik)}>
        {m.menu.ayrintilar}
        <AcilirOkIkon boy={20} />
      </button>
      <div id={govde} className={stil.govde} hidden={!acik}>{acik && children}</div>
    </div>
  )
}
