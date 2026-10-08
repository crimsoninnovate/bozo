import type { Metadata } from 'next'
import { OyunSayfasi } from '@/components/oyun/OyunSayfasi'
import { tr } from '@/content'

// Prototip (plan 1): dizine girmez; sitemap'te, menüde ve çekmecede yok.
export const metadata: Metadata = {
  title: `${tr.oyun.baslik} · ${tr.ortak.marka.ad}`,
  robots: { index: false, follow: false },
}

export default function Sayfa() {
  return <OyunSayfasi dil="tr" />
}
