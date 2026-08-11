import type { Metadata } from 'next'
import { Kabuk } from '@/components/sayfa/Kabuk'
import { KonumSayfasi } from '@/components/sayfa/KonumSayfasi'
import { sayfaMetadata } from '@/lib/metadata'

export const metadata: Metadata = sayfaMetadata('konum', 'en')

export default function Sayfa() {
  return (
    <Kabuk dil="en" aktif="konum">
      <KonumSayfasi dil="en" />
    </Kabuk>
  )
}
