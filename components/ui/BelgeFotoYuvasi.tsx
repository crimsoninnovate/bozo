import type { ComponentProps } from 'react'
import { menuBelgesiYukle } from '@/lib/menu/belgeYukle'
import { FotoYuvasi } from './FotoYuvasi'

/** `FotoYuvasi`, derleme zamanı menü belgesiyle. Yalnız sunucu bileşenleri kullanır (`node:fs`). */
export function BelgeFotoYuvasi(props: Omit<ComponentProps<typeof FotoYuvasi>, 'belge'>) {
  return <FotoYuvasi {...props} belge={menuBelgesiYukle()} />
}
