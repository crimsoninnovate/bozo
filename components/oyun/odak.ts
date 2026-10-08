import type { KeyboardEvent, FocusEvent } from 'react'
import { komsuIndeks, okAdimi } from '@/lib/oyun/klavye'

/*
 * Şerit içi klavye gezinmesi (spec §15): her `[data-serit]` tek Tab durağıdır,
 * ok tuşları şerit içinde dolaşır. Gezici tabindex: odaktaki düğme 0, diğerleri -1.
 */

const DUGME = 'button:not([disabled])'

function dugmeler(serit: HTMLElement): HTMLElement[] {
  return [...serit.querySelectorAll<HTMLElement>(DUGME)]
}

function durakYap(serit: HTMLElement, durak: HTMLElement | null): void {
  const liste = dugmeler(serit)
  const secilen = durak && liste.includes(durak) ? durak : liste[0]
  for (const d of liste) d.tabIndex = d === secilen ? 0 : -1
}

/** Her şeritte tek durak: odak içerideyse o, değilse ilk düğme. Yapı değişince çağrılır. */
export function seritleriDuzenle(alan: HTMLElement): void {
  const odak = document.activeElement instanceof HTMLElement ? document.activeElement : null
  for (const serit of alan.querySelectorAll<HTMLElement>('[data-serit]')) durakYap(serit, odak)
}

export function seritOdagi(e: FocusEvent<HTMLElement>): void {
  if (e.target instanceof HTMLElement) durakYap(e.currentTarget, e.target)
}

export function seritTusu(e: KeyboardEvent<HTMLElement>): void {
  const adim = okAdimi(e.key)
  if (adim === null) return
  const liste = dugmeler(e.currentTarget)
  const sonraki = liste[komsuIndeks(liste.indexOf(e.target as HTMLElement), adim, liste.length)]
  if (!sonraki) return
  e.preventDefault()
  durakYap(e.currentTarget, sonraki)
  sonraki.focus()
}
