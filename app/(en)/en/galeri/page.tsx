import type { Metadata } from 'next'
import { GaleriSayfasi } from '@/components/sayfa/GaleriSayfasi'
import { Kabuk } from '@/components/sayfa/Kabuk'
import { sayfaMetadata } from '@/lib/metadata'

export const metadata: Metadata = sayfaMetadata('galeri', 'en')

export default function Sayfa() {
  return (
    <Kabuk dil="en" aktif="galeri">
      <GaleriSayfasi dil="en" />
    </Kabuk>
  )
}
