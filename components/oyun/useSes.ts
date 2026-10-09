import { useEffect, useRef, useState } from 'react'
import { sesAcikMi, sesYaz } from '@/lib/oyun/defter'
import type { SesAdi } from '@/lib/oyun/ses'
import { sesCalarKur, type SesCalar } from './sesCalar'

export type Ses = {
  acik: boolean
  degistir: () => void
  cal: (ad: SesAdi, perde?: number) => void
  /** Kor cızırtısı; aynı seviye tekrar gönderilmez, her karede çağrılabilir. */
  ortam: (seviye: number) => void
  uyandir: () => void
}

/** Ses varsayılan kapalı; tercih tarayıcıda kalır. Bağlam bir dokunuşun içinde kurulur (spec §13). */
export function useSes(): Ses {
  // İlk boyama sunucuyla aynı: tercih istemcide, depolama okununca gelir.
  const [acik, setAcik] = useState(false)
  const calar = useRef<SesCalar | null>(null)
  const sonOrtam = useRef(0)

  useEffect(() => {
    setAcik(sesAcikMi())
    return () => calar.current?.kapat()
  }, [])

  const hazirla = () => {
    if (!calar.current) {
      calar.current = sesCalarKur()
      // Bağlamdan önce gelen seviye kaybolmasın: sonraki kare yeniden yollar.
      sonOrtam.current = -1
    }
    calar.current?.uyandir()
  }
  const degistir = () => {
    const yeni = !acik
    setAcik(yeni)
    sesYaz(yeni)
    if (yeni) hazirla()
    else calar.current?.ortam(0)
    sonOrtam.current = -1
  }
  /** Dokunuş ve tuş işleyicilerinden: önceki ziyaretten açık kalan ses de bir jestle açılır. */
  const uyandir = () => {
    if (acik) hazirla()
  }
  const cal = (ad: SesAdi, perde?: number) => {
    if (!acik) return
    hazirla()
    calar.current?.cal(ad, perde)
  }
  const ortam = (seviye: number) => {
    if (seviye === sonOrtam.current) return
    sonOrtam.current = seviye
    if (acik) calar.current?.ortam(seviye)
  }
  return { acik, degistir, cal, ortam, uyandir }
}
