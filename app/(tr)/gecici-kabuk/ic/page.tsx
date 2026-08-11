// Geçici doğrulama rotası: iç sayfa UstBar varyantı (78px, aktif sekme, ilerleme yok).
// Commit öncesi silinecek.
import { AltBilgi } from '@/components/layout/AltBilgi'
import { MobilAksiyonBari } from '@/components/layout/MobilAksiyonBari'
import { UstBar } from '@/components/layout/UstBar'

export default function GeciciKabukIcSayfa() {
  return (
    <main style={{ background: '#0A0807', minHeight: '200vh' }}>
      <UstBar dil="tr" aktif="hikaye" />
      <div style={{ height: '150vh' }} />
      <AltBilgi dil="tr" />
      <MobilAksiyonBari dil="tr" />
    </main>
  )
}
