import type { Metadata } from 'next'
import { GizlilikSayfasi } from '@/components/sayfa/GizlilikSayfasi'
import { Kabuk } from '@/components/sayfa/Kabuk'
import { sayfaMetadata } from '@/lib/metadata'

export const metadata: Metadata = sayfaMetadata('gizlilik', 'tr')

export default function Sayfa() {
  return (
    <Kabuk dil="tr" aktif="gizlilik">
      <GizlilikSayfasi dil="tr" />
    </Kabuk>
  )
}
