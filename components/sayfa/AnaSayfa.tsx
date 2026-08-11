import type { Dil } from '@/content'
import { Acilis } from './ana/Acilis'
import { Iddia } from './ana/Iddia'
import { Ikram } from './ana/Ikram'
import { Ocaktan } from './ana/Ocaktan'

type Props = { dil: Dil }

/**
 * Ana sayfanın gövdesi. Görev 10 kalan dört bölümü (gece, bozo, konum, paket) ve
 * bölüm navigasyonunu (BeadRay) ekler.
 */
export function AnaSayfa({ dil }: Props) {
  return (
    <>
      <Acilis dil={dil} />
      <Iddia dil={dil} />
      <Ocaktan dil={dil} />
      <Ikram dil={dil} />
    </>
  )
}
