import type { Dil } from '@/content'
import type { SayfaAnahtari } from '@/lib/site'
import { AltBilgiTam } from './AltBilgiTam'

type Props = { dil: Dil; aktif: SayfaAnahtari }

/**
 * Tek footer. Tasarımda üç varyant vardı (tam, sayfalar, şerit) ve
 * `lib/kabuk.ts` hangisinin nereye gittiğini tutuyordu; sahibi 13 Ağustos
 * 2026'da ana sayfanın dört kolonlu footer'ının her sayfada olmasını istedi.
 * Diğer iki varyant ve seçici silindi. `aktif` yalnız telif şeridinin
 * kendine-link basmaması için akıyor, bkz. TelifSeridi.
 */
export function AltBilgi({ dil, aktif }: Props) {
  return <AltBilgiTam dil={dil} aktif={aktif} />
}
