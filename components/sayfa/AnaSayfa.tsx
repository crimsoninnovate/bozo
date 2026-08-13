import { BeadRay } from '@/components/layout/BeadRay'
import type { Dil } from '@/content'
import { Acilis } from './ana/Acilis'
import { Bozo } from './ana/Bozo'
import { Gece } from './ana/Gece'
import { Iddia } from './ana/Iddia'
import { Ikram } from './ana/Ikram'
import { Konum } from './ana/Konum'
import { Ocaktan } from './ana/Ocaktan'

type Props = { dil: Dil }

/**
 * Bead rayının yedi boncuğu ve boyları tasarımın `data-bead` satırlarından
 * (Ana Sayfa Alternatif.dc.html:68-80): 14/9/14/14/9/14/14. Paket şeridi ve
 * footer rayda yoktur, ikisi de `data-yogunluk` taşımaz.
 */
const BOLUMLER = [
  { id: 'acilis', buyuk: true },
  { id: 'iddia', buyuk: false },
  { id: 'ocaktan', buyuk: true },
  { id: 'ikram', buyuk: true },
  { id: 'gece', buyuk: false },
  { id: 'bozo', buyuk: true },
  { id: 'konum', buyuk: true },
]

/** Ana sayfanın gövdesi: yedi bölüm, paket şeridi ve bölüm navigasyonu. */
export function AnaSayfa({ dil }: Props) {
  return (
    <>
      <Acilis dil={dil} />
      <Iddia dil={dil} />
      <Ocaktan dil={dil} />
      <Ikram dil={dil} />
      <Gece dil={dil} />
      <Bozo dil={dil} />
      <Konum dil={dil} />
      <BeadRay bolumler={BOLUMLER} />
    </>
  )
}
