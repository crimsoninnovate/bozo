import { tr } from './tr/index.ts'
import { en } from './en/index.ts'
import type { Dil } from './types.ts'

export type Sozluk = typeof tr

export function sozluk(dil: Dil): Sozluk {
  return dil === 'en' ? en : tr
}

export { tr, en }
export type { Dil }
