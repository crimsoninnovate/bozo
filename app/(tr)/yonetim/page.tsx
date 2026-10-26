import type { Metadata } from 'next'
import { MenuYonetimi } from '@/components/yonetim/MenuYonetimi'
import { tr } from '@/content'
import { yonetim } from '@/content/yonetim'
import { menuBelgesiYukle } from '@/lib/menu/belgeYukle'

// Menü paneli: kabuk yok, dizine girmez, hiçbir sayfadan bağlantı yok.
export const metadata: Metadata = {
  title: `${yonetim.menu.baslik} · ${tr.ortak.marka.ad}`,
  robots: { index: false, follow: false },
}

export default function Sayfa() {
  return <MenuYonetimi baz={menuBelgesiYukle()} />
}
