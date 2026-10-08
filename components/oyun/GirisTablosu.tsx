import { useEffect, useState } from 'react'
import Link from 'next/link'
import { sozluk } from '@/content'
import type { Dil } from '@/content/types'
import type { TabloYaniti } from '@/lib/oyun/aktarim'
import { api } from '@/lib/oyun/api'
import { yol } from '@/lib/site'
import stil from './GirisTablosu.module.css'

/** Giriş ekranı (spec §11): haftanın ilk üçü, son şampiyon, Sıralama ve Gizlilik bağlantıları. */
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

  return (
    <div className={stil.tablo}>
      {ilkUc.length > 0 && (
        <>
          <h2 className={stil.baslik}>{s.oyun.siralama.haftaninIlkUcu}</h2>
          <ol className={stil.liste}>
            {ilkUc.map((satir) => (
              <li key={satir.sira} className={stil.satir}>
                <span className={stil.sira}>{satir.sira}</span>
                <span className={stil.ad}>{ad(satir.takmaAd)}</span>
                <span className={stil.puan}>{sayi(satir.puan)}</span>
              </li>
            ))}
          </ol>
        </>
      )}
      {tablo?.sonSampiyon && (
        <p className={stil.sampiyon}>
          {s.oyun.siralama.sonSampiyon}: {ad(tablo.sonSampiyon.takmaAd)} · {sayi(tablo.sonSampiyon.puan)}
        </p>
      )}
      <nav className={stil.baglantilar} aria-label={s.oyun.baslik}>
        <Link href={yol('siralama', dil)} className={stil.baglanti}>
          {s.oyun.siralama.baslik}
        </Link>
        <Link href={yol('gizlilik', dil)} className={stil.baglanti}>
          {s.ortak.nav.gizlilik}
        </Link>
      </nav>
    </div>
  )
}
