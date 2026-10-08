import type { Metadata } from 'next'
import { SiralamaSayfasi } from '@/components/oyun/SiralamaSayfasi'
import { Kabuk } from '@/components/sayfa/Kabuk'
import { tr } from '@/content'

// Prototip: dizine girmez; sitemap'te, menüde ve çekmecede yok (spec §19 karar 8).
export const metadata: Metadata = {
  title: `${tr.oyun.siralama.baslik} · ${tr.oyun.baslik} · ${tr.ortak.marka.ad}`,
  robots: { index: false, follow: false },
}

export default function Sayfa() {
  return (
    <Kabuk dil="tr" aktif="siralama">
      <SiralamaSayfasi dil="tr" />
    </Kabuk>
  )
}
