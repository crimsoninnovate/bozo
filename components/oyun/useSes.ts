import { useEffect, useRef, useState } from 'react'
import { sesAcikMi, sesYaz } from '@/lib/oyun/defter'
import type { SesAdi } from '@/lib/oyun/ses'
import { sesCalarKur, type SesCalar } from './sesCalar'

export type Ses = { acik: boolean; degistir: () => void; cal: (ad: SesAdi) => void; uyandir: () => void }

/** Ses varsayılan kapalı; tercih tarayıcıda kalır. Bağlam bir dokunuşun içinde kurulur (spec §13). */
export function useSes(): Ses {
  // İlk boyama sunucuyla aynı: tercih istemcide, depolama okununca gelir.
  const [acik, setAcik] = useState(false)
  const calar = useRef<SesCalar | null>(null)

  useEffect(() => {
    setAcik(sesAcikMi())
    return () => calar.current?.kapat()
  }, [])

  const hazirla = () => {
    calar.current ??= sesCalarKur()
    calar.current?.uyandir()
  }
  const degistir = () => {
    const yeni = !acik
    setAcik(yeni)
    sesYaz(yeni)
    if (yeni) hazirla()
  }
  /** Dokunuş ve tuş işleyicilerinden: önceki ziyaretten açık kalan ses de bir jestle açılır. */
  const uyandir = () => {
    if (acik) hazirla()
  }
  const cal = (ad: SesAdi) => {
    if (!acik) return
    calar.current ??= sesCalarKur()
    calar.current?.cal(ad)
  }
  return { acik, degistir, cal, uyandir }
}
