import type { Sozluk } from '../index.ts'
import { ortak } from './ortak.ts'
import { ana } from './ana.ts'
import { menu } from './menu.ts'
import { galeri } from './galeri.ts'
import { hikaye } from './hikaye.ts'
import { konum } from './konum.ts'
import { gizlilik } from './gizlilik.ts'
import { hata } from './hata.ts'

export const en: Sozluk = { ortak, ana, menu, galeri, hikaye, konum, gizlilik, hata }
