import type { Metadata } from 'next'
import { HikayeSayfasi } from '@/components/sayfa/HikayeSayfasi'
import { Kabuk } from '@/components/sayfa/Kabuk'
import { sayfaMetadata } from '@/lib/metadata'

export const metadata: Metadata = sayfaMetadata('hikaye', 'en')

export default function Sayfa() {
  return (
    <Kabuk dil="en" aktif="hikaye">
      <HikayeSayfasi dil="en" />
    </Kabuk>
  )
}
