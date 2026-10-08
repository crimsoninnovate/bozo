import { useEffect, useState } from 'react'
import Link from 'next/link'
import { sozluk } from '@/content'
import type { Dil } from '@/content/types'
import type { TabloYaniti } from '@/lib/oyun/aktarim'
import { api } from '@/lib/oyun/api'
import { yol } from '@/lib/site'
import stil from './GirisTablosu.module.css'

/** Giriş ekranı (spec §11, handoff 1a): haftanın ilk üçü ve son şampiyon; sunucu yoksa blok yok. */
export function GirisTablosu({ dil }: { dil: Dil }) {
  const s = sozluk(dil)
  const [tablo, setTablo] = useState<TabloYaniti | null>(null)
  useEffect(() => {
    let iptal = false
    // Sunucuya ulaşılamazsa tablo yok; giriş yine açılır, oyun çevrimdışı oynanır.
    api.tabloAl().then((t) => !iptal && setTablo(t), () => {})
    return () => {
      iptal = true
    }
  }, [])
  const sayi = (n: number) => n.toLocaleString(dil === 'en' ? 'en-GB' : 'tr-TR')
  const ad = (takmaAd: string | null) => takmaAd ?? s.oyun.siralama.gizliAd
  const ilkUc = tablo?.hafta.slice(0, 3) ?? []
  if (ilkUc.length === 0 && !tablo?.sonSampiyon) return null

  return (
    <div className={stil.tablo}>
      <div className={stil.baslikSatiri}>
        <h2 className={stil.baslik}>{s.oyun.siralama.baslik}</h2>
        <span className={stil.donem}>{s.oyun.siralama.buHafta}</span>
      </div>
      {ilkUc.length > 0 && (
        <ol className={stil.liste}>
          {ilkUc.map((satir) => (
            <li key={satir.sira} className={stil.satir}>
              <span className={stil.sira}>{satir.sira}</span>
              <span className={stil.ad}>{ad(satir.takmaAd)}</span>
              <span className={stil.puan}>{sayi(satir.puan)}</span>
            </li>
          ))}
        </ol>
      )}
      {tablo?.sonSampiyon && (
        <p className={stil.sampiyon}>
          <span className={stil.sampiyonEtiket}>{s.oyun.siralama.sonSampiyon}</span>
          <span>{ad(tablo.sonSampiyon.takmaAd)}</span>
          <span className={stil.sampiyonPuan}>{sayi(tablo.sonSampiyon.puan)}</span>
        </p>
      )}
    </div>
  )
}

/** Sıralama ve Gizlilik bağlantıları; Kurallar sayfası plan 4'te, bağlantısı yok. */
export function GirisBaglantilari({ dil }: { dil: Dil }) {
  const s = sozluk(dil)
  return (
    <nav className={stil.baglantilar} aria-label={s.oyun.baslik}>
      <Link href={yol('siralama', dil)} className={stil.baglanti}>
        {s.oyun.siralama.baslik}
      </Link>
      <Link href={yol('gizlilik', dil)} className={stil.baglanti}>
        {s.ortak.nav.gizlilik}
      </Link>
    </nav>
  )
}
