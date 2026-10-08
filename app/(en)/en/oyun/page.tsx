import type { Metadata } from 'next'
import { OyunSayfasi } from '@/components/oyun/OyunSayfasi'
import { Kabuk } from '@/components/sayfa/Kabuk'
import { en } from '@/content'

// Prototip: dizine girmez; sitemap'te, menüde ve çekmecede yok (spec §19 karar 8).
export const metadata: Metadata = {
  title: `${en.oyun.baslik} · ${en.ortak.marka.ad}`,
  robots: { index: false, follow: false },
}

export default function Sayfa() {
  return (
    <Kabuk dil="en" aktif="oyun">
      <OyunSayfasi dil="en" />
    </Kabuk>
  )
}
