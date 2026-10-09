import type { Metadata } from 'next'
import { YonetimSayfasi } from '@/components/oyun/YonetimSayfasi'
import { tr } from '@/content'
import { yonetim } from '@/content/yonetim'

// Personel ekranı: kabuk yok, dizine girmez, hiçbir sayfadan bağlantı yok.
export const metadata: Metadata = {
  title: `${yonetim.baslik} · ${tr.ortak.marka.ad}`,
  robots: { index: false, follow: false },
}

export default function Sayfa() {
  return <YonetimSayfasi />
}
