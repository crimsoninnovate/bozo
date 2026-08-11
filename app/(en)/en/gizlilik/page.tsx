import type { Metadata } from 'next'
import { GizlilikSayfasi } from '@/components/sayfa/GizlilikSayfasi'
import { Kabuk } from '@/components/sayfa/Kabuk'
import { sayfaMetadata } from '@/lib/metadata'

export const metadata: Metadata = sayfaMetadata('gizlilik', 'en')

export default function Sayfa() {
  return (
    <Kabuk dil="en" aktif="gizlilik">
      <GizlilikSayfasi dil="en" />
    </Kabuk>
  )
}
