import { useEffect, useEffectEvent, useState, type RefObject } from 'react'
import { useHareketAzaltilmisMi } from '@/lib/hareket'
import { duyurucuKur, duyuruSec } from '@/lib/oyun/duyuru'
import { ipucuHedefi } from '@/lib/oyun/gosterim'
import { kisayolHedefi } from '@/lib/oyun/klavye'
import { sesSec } from '@/lib/oyun/ses'
import type { Girdi, Hedef, Olay, Oyun, Sonuc } from '@/lib/oyun/tipler'
import { duyuruYaz, sahayiCiz } from './ciz'
import { seritleriDuzenle } from './odak'
import type { Metin } from './Seritler'
import { dokunus, olaylaraTepki } from './tepkiler'
import { useOyunDongusu } from './useOyunDongusu'
import { useSes } from './useSes'

type Secenek = {
  kok: RefObject<HTMLDivElement | null>
  tohum: number
  ipucu: boolean
  metin: Metin
  bitince: (sonuc: Sonuc, kayit: readonly Girdi[]) => void
}

/**
 * Döngüyü sahaya bağlar: her karede DOM yazımı, olaylara tepki, ses, canlı bölge
 * ve klavye kısayolları (1-4 sofra, 5-8 ocak). Saha yalnız yapıyı çizer.
 */
export function useOyunAlani({ kok, tohum, ipucu, metin, bitince }: Secenek) {
  const azalt = useHareketAzaltilmisMi()
  const ses = useSes()
  const [duyurucu] = useState(() => duyurucuKur())

  const ciz = (oyun: Oyun, ilerledi: boolean) => {
    const alan = kok.current
    if (!alan) return
    if (ilerledi) sahayiCiz(alan, oyun, ipucu ? ipucuHedefi(oyun) : null, azalt)
    duyuruYaz(alan, duyurucu.al(performance.now()), metin.duyuru)
  }
  const tepki = (olaylar: Olay[]) => {
    const alan = kok.current
    if (!alan) return
    olaylaraTepki(alan, olaylar, azalt)
    for (const ad of sesSec(olaylar)) ses.cal(ad)
    const duyuru = duyuruSec(olaylar)
    if (duyuru) duyurucu.ekle(duyuru)
  }
  const dongu = useOyunDongusu({ tohum, ciz, tepki, bitince })

  /** Dokunuş: simülasyona sıraya girer, hedefte anlık tepki başlar. */
  const dokun = (hedef: Hedef, el: HTMLElement | null) => {
    ses.uyandir()
    dongu.dokun(hedef)
    dokunus(el, azalt)
  }

  const kisayol = useEffectEvent((e: KeyboardEvent) => {
    if (e.repeat || e.altKey || e.ctrlKey || e.metaKey) return
    const hedef = kisayolHedefi(e.key)
    if (!hedef) return
    e.preventDefault()
    dokun(hedef, kok.current?.querySelector<HTMLElement>(`[data-hedef="${hedef}"]`) ?? null)
  })
  useEffect(() => {
    document.addEventListener('keydown', kisayol)
    return () => document.removeEventListener('keydown', kisayol)
  }, [])

  useEffect(() => {
    if (kok.current) seritleriDuzenle(kok.current)
  }, [kok, dongu.goruntu])

  return { ...dongu, dokun, azalt, ses }
}
