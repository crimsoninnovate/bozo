import type { Metadata } from 'next'
import { Kabuk } from '@/components/sayfa/Kabuk'
import { MenuSayfasi } from '@/components/sayfa/MenuSayfasi'
import { sayfaMetadata } from '@/lib/metadata'

export const metadata: Metadata = sayfaMetadata('menu', 'tr')

export default function Sayfa() {
  return (
    <Kabuk dil="tr" aktif="menu">
      <MenuSayfasi dil="tr" />
    </Kabuk>
  )
}
