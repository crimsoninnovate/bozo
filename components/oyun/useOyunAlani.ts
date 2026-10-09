import { useEffect, useState, type RefObject } from 'react'
import { useHareketAzaltilmisMi } from '@/lib/hareket'
import { duyurucuKur, duyuruSec } from '@/lib/oyun/duyuru'
import { sesSec } from '@/lib/oyun/ses'
import { eldeKaynagi } from '@/lib/oyun/surukle'
import type { Girdi, Hedef, Kalem, Olay, Oyun, Sonuc } from '@/lib/oyun/tipler'
import { duyuruYaz, sahayiCiz } from './ciz'
import { seritleriDuzenle } from './odak'
import type { Metin } from './Serit'
import { dokunus, olaylaraTepki } from './tepkiler'
import { useOyunDongusu } from './useOyunDongusu'
import { useSes } from './useSes'
import { useSurukleme } from './useSurukleme'

type Secenek = {
  kok: RefObject<HTMLDivElement | null>
  tohum: number
  metin: Metin
  ad: (k: Kalem) => string
  bitince: (sonuc: Sonuc, kayit: readonly Girdi[]) => void
}

/** Döngüyü sahaya bağlar: her karede DOM yazımı, olaylara tepki, ses, canlı bölge ve jestler. Saha yalnız yapıyı çizer. */
export function useOyunAlani({ kok, tohum, metin, ad, bitince }: Secenek) {
  const azalt = useHareketAzaltilmisMi()
  const ses = useSes()
  const [duyurucu] = useState(() => duyurucuKur())

  const ciz = (oyun: Oyun, ilerledi: boolean) => {
    const alan = kok.current
    if (!alan) return
    if (ilerledi) sahayiCiz(alan, oyun, azalt, metin)
    duyuruYaz(alan, duyurucu.al(performance.now()), metin, ad)
  }
  const tepki = (olaylar: Olay[]) => {
    const alan = kok.current
    if (!alan) return
    olaylaraTepki(alan, olaylar, azalt)
    for (const sesAdi of sesSec(olaylar)) ses.cal(sesAdi)
    const duyuru = duyuruSec(olaylar)
    if (duyuru) duyurucu.ekle(duyuru)
  }
  const dongu = useOyunDongusu({ tohum, ciz, tepki, bitince, durdur: () => false, izle: () => undefined })

  /** Girdi: simülasyona sıraya girer, hedefte anlık dolgu. Rehber (Görev 11) burada süzer. */
  const dokun = (hedef: Hedef, el: HTMLElement | null): boolean => {
    ses.uyandir()
    dongu.dokun(hedef)
    dokunus(el, azalt)
    return true
  }
  useSurukleme({ kok, elde: () => eldeKaynagi(dongu.oyunu().el), dokun })

  useEffect(() => {
    if (kok.current) seritleriDuzenle(kok.current)
  }, [kok, dongu.goruntu])

  return { ...dongu, azalt, ses }
}
