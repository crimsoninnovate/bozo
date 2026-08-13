import type { Dil } from '@/content'
import { AltBilgiTam } from './AltBilgiTam'

type Props = { dil: Dil }

/**
 * Tek footer. Tasarımda üç varyant vardı (tam, sayfalar, şerit) ve
 * `lib/kabuk.ts` hangisinin nereye gittiğini tutuyordu; sahibi 13 Ağustos
 * 2026'da ana sayfanın dört kolonlu footer'ının her sayfada olmasını istedi.
 * Diğer iki varyant ve seçici silindi.
 */
export function AltBilgi({ dil }: Props) {
  return <AltBilgiTam dil={dil} />
}
