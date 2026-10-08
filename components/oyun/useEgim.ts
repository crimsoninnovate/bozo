import { useEffect, type RefObject } from 'react'

const sinirla = (v: number): number => Math.max(-1, Math.min(1, v))

/**
 * İmleç konumu ya da telefonun eğimi (-1..1) `--egim-x` ve `--egim-y` olarak yazılır; sahne
 * katmanları farklı derinlikte kayar (parallax). Yalnız değişim yazılır, kare başına bir kez.
 * iOS eğim izni istemediğimiz için orada yalnız imleç/dokunmasız cihazlar etkilenir.
 */
export function useEgim(kok: RefObject<HTMLElement | null>, azalt: boolean): void {
  useEffect(() => {
    const el = kok.current
    if (!el || azalt) return
    let hedef = { x: 0, y: 0 }
    let yazilan = { x: 0, y: 0 }
    let kare = 0
    const yaz = () => {
      kare = 0
      yazilan = { x: yazilan.x + (hedef.x - yazilan.x) * 0.25, y: yazilan.y + (hedef.y - yazilan.y) * 0.25 }
      el.style.setProperty('--egim-x', yazilan.x.toFixed(3))
      el.style.setProperty('--egim-y', yazilan.y.toFixed(3))
      if (Math.abs(hedef.x - yazilan.x) + Math.abs(hedef.y - yazilan.y) > 0.01) kare = requestAnimationFrame(yaz)
    }
    const ayarla = (x: number, y: number) => {
      hedef = { x: sinirla(x), y: sinirla(y) }
      if (!kare) kare = requestAnimationFrame(yaz)
    }
    const imlec = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') ayarla((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1)
    }
    const egim = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) ayarla(e.gamma / 25, (e.beta - 55) / 25)
    }
    window.addEventListener('pointermove', imlec, { passive: true })
    window.addEventListener('deviceorientation', egim, { passive: true })
    return () => {
      window.removeEventListener('pointermove', imlec)
      window.removeEventListener('deviceorientation', egim)
      cancelAnimationFrame(kare)
    }
  }, [kok, azalt])
}
