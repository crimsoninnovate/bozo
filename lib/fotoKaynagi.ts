import { fotograflar } from '../content/fotograflar.ts'
import type { FotoId } from '../content/types.ts'
import type { MenuBelgesi } from './menu/tipler.ts'

export type FotoKaynagi = { src: string; odak: string | null }

/** Belgedeki atama sunucudan, yoksa `content/fotograflar.ts` tohumu, o da yoksa `null` (boş plaka). */
export function fotoKaynagi(
  id: FotoId,
  belge: Pick<MenuBelgesi, 'fotograflar'>,
  apiKok: string,
): FotoKaynagi | null {
  const atama = belge.fotograflar[id]
  if (atama) return { src: `${apiKok}/foto/${atama.dosya}`, odak: atama.odak }
  const tohum = fotograflar[id].dosya
  return tohum ? { src: tohum, odak: null } : null
}

/** Belgenin odağı doluysa `odak` prop'unu ezer. */
export function odakSec(belgeOdagi: string | null, odakProp: string | undefined): string | undefined {
  return belgeOdagi ?? odakProp
}
