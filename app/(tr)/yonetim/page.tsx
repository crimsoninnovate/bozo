import type { Metadata } from 'next'
import { MenuYonetimi } from '@/components/yonetim/MenuYonetimi'
import { tr } from '@/content'
import { yonetim } from '@/content/yonetim'
import { menuBelgesiYukle } from '@/lib/menu/belgeYukle'
import { herkeseAcik } from '@/lib/menu/herkeseAcik'

// Menü paneli: kabuk yok, dizine girmez, hiçbir sayfadan bağlantı yok. Saklanan numara yetkili GET'ten gelir.
export const metadata: Metadata = {
  title: `${yonetim.menu.baslik} · ${tr.ortak.marka.ad}`,
  robots: { index: false, follow: false },
}

export default function Sayfa() {
  return <MenuYonetimi baz={herkeseAcik(menuBelgesiYukle())} />
}
