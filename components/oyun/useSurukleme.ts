import { useEffect, useEffectEvent, type RefObject } from 'react'
import { tusEylemi } from '@/lib/oyun/klavye'
import { birakmaHedefiMi, surukle, type Isaret, type Surukleme } from '@/lib/oyun/surukle'
import type { Hedef } from '@/lib/oyun/tipler'
import { yerineDon } from './tepkiler'

type Secenek = {
  kok: RefObject<HTMLElement | null>
  /** Simülasyonun elindeki öğenin kaynağı (`eldeKaynagi`). */
  elde: () => Hedef | null
  /** Girdiyi sıraya alır; rehber reddettiyse false. */
  dokun: (hedef: Hedef, el: HTMLElement | null) => boolean
  azalt: boolean
}

export function hedefBul(x: number, y: number): HTMLElement | null {
  return document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-hedef]') ?? null
}

export const hedefi = (el: HTMLElement | null): Hedef | null => (el?.dataset.hedef as Hedef | undefined) ?? null

/**
 * Dokunuşlar, sürüklemeler ve klavye `surukle` makinesinden geçer (spec tabak §3). Sürükleme yalnız
 * görünümdür: simülasyona yine `tut` ve bir hedef gider. Kaybolan `pointerup` tahtayı kilitlemesin:
 * `lostpointercapture` ve sekme gizlenmesi iptaldir.
 */
export function useSurukleme({ kok, elde, dokun, azalt }: Secenek): void {
  const isle = useEffectEvent((isaret: Isaret, el: HTMLElement | null, durum: Surukleme): Surukleme => {
    const alan = kok.current
    const kaynak = elde()
    const sonuc = surukle(durum, isaret, { elde: kaynak })
    const kabul = sonuc.girdiler.map((hedef) => dokun(hedef, hedef === 'birak' ? null : el))
    const tasinan = alan && kaynak ? alan.querySelector<HTMLElement>(`[data-hedef="${kaynak}"] [data-tasinir]`) : null
    if (sonuc.tasima && tasinan) {
      tasinan.setAttribute('data-tasinan', '')
      tasinan.style.transform = `translate(${sonuc.tasima.dx}px, ${sonuc.tasima.dy}px)`
    } else if (sonuc.durum.tur === 'bos' && tasinan?.hasAttribute('data-tasinan')) {
      const hedefli = sonuc.girdiler.map((h, i) => h !== 'birak' && kabul[i] === true)
      birakisiBitir(alan, tasinan, hedefli, azalt)
    }
    vurgula(alan, sonuc.durum.tur === 'basili' && sonuc.tasima ? el : null, kaynak)
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
    let bekleyenHareket: PointerEvent | null = null
    const yuru = (e: PointerEvent) => {
      if (durum.tur !== 'basili' || bekleyenHareket) {
        bekleyenHareket = bekleyenHareket && e
        return
      }
      bekleyenHareket = e
      requestAnimationFrame(() => {
        const son = bekleyenHareket
        bekleyenHareket = null
        if (!son || durum.tur !== 'basili') return
        yaz({ tur: 'yuru', id: son.pointerId, x: son.clientX, y: son.clientY }, hedefBul(son.clientX, son.clientY))
      })
    }
    alan.addEventListener('pointermove', yuru)
    alan.addEventListener('pointerup', kaldir)
    alan.addEventListener('pointercancel', iptal)
    alan.addEventListener('lostpointercapture', iptal)
    document.addEventListener('visibilitychange', gizlenince)
    document.addEventListener('keydown', tus)
    return () => {
      alan.removeEventListener('pointerdown', bas)
      alan.removeEventListener('pointermove', yuru)
      alan.removeEventListener('pointerup', kaldir)
      alan.removeEventListener('pointercancel', iptal)
      alan.removeEventListener('lostpointercapture', iptal)
      document.removeEventListener('visibilitychange', gizlenince)
      document.removeEventListener('keydown', tus)
    }
  }, [kok])
}

/**
 * Bırakış sonu: hedefe girdi gitmediyse ya da rehber reddettiyse öğe yerine süzülür; kabul edildiyse dönüşüm
 * anında silinir (React öğeyi hedefte çizer) ve uçuş atlanır (`data-suruklendi`, `ucus` tüketir).
 */
function birakisiBitir(alan: HTMLElement | null, tasinan: HTMLElement, kabul: boolean[], azalt: boolean): void {
  if (!kabul.some(Boolean)) return yerineDon(tasinan, azalt)
  tasinan.style.transform = ''
  tasinan.removeAttribute('data-tasinan')
  alan?.setAttribute('data-suruklendi', String(performance.now()))
}

/** Geçerli hedef parmak üstündeyken bakır kenar (`data-ustunde`); başka her şeyden silinir. */
function vurgula(alan: HTMLElement | null, el: HTMLElement | null, elde: Hedef | null): void {
  if (!alan) return
  const hedef = hedefi(el)
  const gecerli = el && elde && hedef && birakmaHedefiMi(elde, hedef) ? el : null
  for (const eski of alan.querySelectorAll<HTMLElement>('[data-ustunde]')) {
    if (eski !== gecerli) eski.removeAttribute('data-ustunde')
  }
  gecerli?.setAttribute('data-ustunde', '')
}
