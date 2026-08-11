import type { Metadata } from 'next'
import { AnaSayfa } from '@/components/sayfa/AnaSayfa'
import { Kabuk } from '@/components/sayfa/Kabuk'
import { sayfaMetadata } from '@/lib/metadata'

export const metadata: Metadata = sayfaMetadata('ana', 'en')

export default function Sayfa() {
  return (
    <Kabuk dil="en" aktif="ana">
      <AnaSayfa dil="en" />
    </Kabuk>
  )
}
