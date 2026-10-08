import { useEffect } from 'react'

/**
 * Tur sürerken kabuk geri çekilir: `body[data-odak]` üst barı, alt bilgiyi ve mobil eylem
 * barını gizler. Raf düğmeleri eylem barının altında kalıyordu; nav'a kaçan dokunuş turu bitirir.
 */
export function useOdakModu(acik: boolean): void {
  useEffect(() => {
    if (!acik) return
    document.body.dataset.odak = ''
    window.scrollTo(0, 0)
    return () => {
      delete document.body.dataset.odak
    }
  }, [acik])
}
