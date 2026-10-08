'use client'

import { useState } from 'react'
import { sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { enIyiOku, enIyiYaz, ilkTurBitti, ilkTurMu } from '@/lib/oyun/defter'
import type { Sonuc } from '@/lib/oyun/tipler'
import { Saha } from './Saha'
import { SonucEkrani } from './SonucEkrani'
import stil from './OyunSayfasi.module.css'

type Ekran =
  | { ad: 'giris' }
  | { ad: 'oyun'; tohum: number; ipucu: boolean }
  | { ad: 'sonuc'; sonuc: Sonuc; onceki: number | null; yeni: boolean }

/** Prototipte tohum tarayıcıda üretilir; sıralamalı turda sunucudan gelecek (spec §7). */
function yeniTohum(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] ?? 1
}

export function OyunSayfasi({ dil }: { dil: Dil }) {
  const s = sozluk(dil)
  const [ekran, setEkran] = useState<Ekran>({ ad: 'giris' })
  const basla = () => setEkran({ ad: 'oyun', tohum: yeniTohum(), ipucu: ilkTurMu() })
  const bitir = (sonuc: Sonuc) => {
    const onceki = enIyiOku()
    const yeni = enIyiYaz(sonuc.puan)
    ilkTurBitti()
    setEkran({ ad: 'sonuc', sonuc, onceki, yeni })
  }

  return (
    <main className={stil.sayfa}>
      {ekran.ad !== 'giris' && <h1 className={stil.gizliBaslik}>{s.oyun.baslik}</h1>}
      {ekran.ad === 'giris' && (
        <section className={stil.giris}>
          <h1 className={stil.baslik}>{s.oyun.baslik}</h1>
          <p className={stil.cumle}>{s.ana.gece.baslik}</p>
          <button type="button" className={stil.oyna} onClick={basla}>
            {s.oyun.oyna}
          </button>
        </section>
      )}
      {ekran.ad === 'oyun' && (
        <Saha key={ekran.tohum} dil={dil} tohum={ekran.tohum} ipucu={ekran.ipucu} bitince={bitir} />
      )}
      {ekran.ad === 'sonuc' && (
        <SonucEkrani dil={dil} sonuc={ekran.sonuc} onceki={ekran.onceki} yeni={ekran.yeni} tekrar={basla} />
      )}
    </main>
  )
}
