import type { Saatler } from './menu/tipler.ts'
import { saatYaz } from './saatMetni.ts'

const ETIKET_SAYISI = 7

/**
 * Gece bölümü zaman çizelgesinin yedi tik etiketi: açılıştan kapanıştan bir saat önceye,
 * tam saate yuvarlanmış eşit adımlar. Varsayılan saatlerde 10:00, 13:00 ... 04:00.
 */
export function cizelgeSaatleri(saatler: Saatler): string[] {
  const son = 24 - saatler.acilis + saatler.kapanis - 1
  return Array.from({ length: ETIKET_SAYISI }, (_, i) => {
    const saat = saatler.acilis + Math.round((i * son) / (ETIKET_SAYISI - 1))
    return saatYaz(saat % 24)
  })
}
