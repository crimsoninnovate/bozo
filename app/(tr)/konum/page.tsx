import type { Metadata } from 'next'
import { Kabuk } from '@/components/sayfa/Kabuk'
import { KonumSayfasi } from '@/components/sayfa/KonumSayfasi'
import { sayfaMetadata } from '@/lib/metadata'

export const metadata: Metadata = sayfaMetadata('konum', 'tr')

export default function Sayfa() {
  return (
    <Kabuk dil="tr" aktif="konum">
      <KonumSayfasi dil="tr" />
    </Kabuk>
  )
}
