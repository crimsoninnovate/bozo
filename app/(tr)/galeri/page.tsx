import type { Metadata } from 'next'
import { GaleriSayfasi } from '@/components/sayfa/GaleriSayfasi'
import { Kabuk } from '@/components/sayfa/Kabuk'
import { sayfaMetadata } from '@/lib/metadata'

export const metadata: Metadata = sayfaMetadata('galeri', 'tr')

export default function Sayfa() {
  return (
    <Kabuk dil="tr" aktif="galeri">
      <GaleriSayfasi dil="tr" />
    </Kabuk>
  )
}
