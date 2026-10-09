import { useEffect, useEffectEvent, type RefObject } from 'react'
import { tusEylemi } from '@/lib/oyun/klavye'
import { surukle, type Isaret, type Surukleme } from '@/lib/oyun/surukle'
import type { Hedef } from '@/lib/oyun/tipler'

type Secenek = {
  kok: RefObject<HTMLElement | null>
  /** Simülasyonun elindeki öğenin kaynağı (`eldeKaynagi`). */
  elde: () => Hedef | null
  /** Girdiyi sıraya alır; rehber reddettiyse false. */
  dokun: (hedef: Hedef, el: HTMLElement | null) => boolean
}

export function hedefBul(x: number, y: number): HTMLElement | null {
  return document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-hedef]') ?? null
}

export const hedefi = (el: HTMLElement | null): Hedef | null => (el?.dataset.hedef as Hedef | undefined) ?? null

/**
 * Dokunuşlar ve klavye `surukle` makinesinden geçer (spec tabak §3). Bu görevde `pointermove` yok:
 * basış asla sürüklemeye dönmez, her jest dokun-dokun olarak iner; Görev 14 sürüklemeyi ekler.
 * Kaybolan `pointerup` tahtayı kilitlemesin: `lostpointercapture` ve sekme gizlenmesi iptaldir.
 */
export function useSurukleme({ kok, elde, dokun }: Secenek): void {
  const isle = useEffectEvent((isaret: Isaret, el: HTMLElement | null, durum: Surukleme): Surukleme => {
    const sonuc = surukle(durum, isaret, { elde: elde() })
    for (const hedef of sonuc.girdiler) dokun(hedef, hedef === 'birak' ? null : el)
    return sonuc.durum
  })

  useEffect(() => {
    const alan = kok.current
    if (!alan) return
    let durum: Surukleme = { tur: 'bos' }
    const yaz = (isaret: Isaret, el: HTMLElement | null) => {
      durum = isle(isaret, el, durum)
    }
    const bas = (e: PointerEvent) => {
      // HUD ve perde düğmeleri kendi onClick'leriyle çalışır; tutma kilidine girmez.
      if ((e.target as HTMLElement).closest('button:not([data-hedef])')) return
      if (e.button !== 0 && e.pointerType === 'mouse') return
      alan.setPointerCapture(e.pointerId)
      const el = hedefBul(e.clientX, e.clientY)
      yaz({ tur: 'bas', id: e.pointerId, hedef: hedefi(el), x: e.clientX, y: e.clientY }, el)
    }
    const kaldir = (e: PointerEvent) => {
      const el = hedefBul(e.clientX, e.clientY)
      yaz({ tur: 'kaldir', id: e.pointerId, hedef: hedefi(el), x: e.clientX, y: e.clientY }, el)
    }
    const iptal = (e: PointerEvent) => yaz({ tur: 'iptal', id: e.pointerId }, null)
    const gizlenince = () => {
      if (document.hidden && durum.tur === 'basili') yaz({ tur: 'iptal', id: durum.id }, null)
    }
    const tus = (e: KeyboardEvent) => {
      const eylem = tusEylemi(e.key)
      if (!eylem || e.repeat || e.altKey || e.ctrlKey || e.metaKey) return
      const el = document.activeElement instanceof HTMLElement ? document.activeElement.closest<HTMLElement>('[data-hedef]') : null
      if (eylem === 'dokun' && (!el || !alan.contains(el))) return
      e.preventDefault()
      const hedef = hedefi(el)
      yaz(eylem === 'birak' || !hedef ? { tur: 'birak' } : { tur: 'dokun', hedef }, el)
    }
    alan.addEventListener('pointerdown', bas)
    alan.addEventListener('pointerup', kaldir)
    alan.addEventListener('pointercancel', iptal)
    alan.addEventListener('lostpointercapture', iptal)
    document.addEventListener('visibilitychange', gizlenince)
    document.addEventListener('keydown', tus)
    return () => {
      alan.removeEventListener('pointerdown', bas)
      alan.removeEventListener('pointerup', kaldir)
      alan.removeEventListener('pointercancel', iptal)
      alan.removeEventListener('lostpointercapture', iptal)
      document.removeEventListener('visibilitychange', gizlenince)
      document.removeEventListener('keydown', tus)
    }
  }, [kok])
}
