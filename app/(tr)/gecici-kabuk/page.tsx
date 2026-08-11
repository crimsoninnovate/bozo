// Geçici doğrulama rotası: Task 6 kabuk bileşenlerini gerçek tarayıcıda görmek için.
// Commit öncesi silinecek.
import { AltBilgi } from '@/components/layout/AltBilgi'
import { BeadRay } from '@/components/layout/BeadRay'
import { MobilAksiyonBari } from '@/components/layout/MobilAksiyonBari'
import { UstBar } from '@/components/layout/UstBar'
import { Bolum } from '@/components/ui/Bolum'

const BOLUMLER = [
  { id: 'acilis', buyuk: true, yogunluk: 1 },
  { id: 'iddia', buyuk: false, yogunluk: 0.6 },
  { id: 'ocaktan', buyuk: true, yogunluk: 0.9 },
  { id: 'ikram', buyuk: true, yogunluk: 0.8 },
  { id: 'gece', buyuk: false, yogunluk: 1 },
  { id: 'bozo', buyuk: true, yogunluk: 0.7 },
  { id: 'konum', buyuk: true, yogunluk: 0.9 },
]

export default function GeciciKabukAnaSayfa() {
  return (
    <main style={{ background: '#0A0807', minHeight: '100vh' }}>
      <UstBar dil="tr" aktif="ana" ilerleme />
      <BeadRay bolumler={BOLUMLER.map(({ id, buyuk }) => ({ id, buyuk }))} />

      {BOLUMLER.map((b) => (
        <Bolum key={b.id} id={b.id} yogunluk={b.yogunluk}>
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F2E9DC',
              fontSize: 32,
              fontFamily: 'sans-serif',
            }}
          >
            {b.id}
          </div>
        </Bolum>
      ))}

      <AltBilgi dil="tr" />
      <MobilAksiyonBari dil="tr" />
    </main>
  )
}
