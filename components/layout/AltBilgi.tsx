import type { Dil } from '@/content'
import { altBilgiVaryanti } from '@/lib/kabuk'
import type { RotaAnahtari } from '@/lib/site'
import { AltBilgiSayfalar } from './AltBilgiSayfalar'
import { AltBilgiSerit } from './AltBilgiSerit'
import { AltBilgiTam } from './AltBilgiTam'

type Props = { dil: Dil; aktif: RotaAnahtari }

/**
 * Tasarımda tek bir footer yok, üç tane var. Hangisinin nereye gittiği
 * `lib/kabuk.ts` > `altBilgiVaryanti` içinde, kaynak satırlarıyla birlikte.
 */
export function AltBilgi({ dil, aktif }: Props) {
  switch (altBilgiVaryanti(aktif)) {
    case 'serit':
      return <AltBilgiSerit dil={dil} />
    case 'sayfalar':
      return <AltBilgiSayfalar dil={dil} aktif={aktif} />
    case 'tam':
      return <AltBilgiTam dil={dil} />
  }
}
