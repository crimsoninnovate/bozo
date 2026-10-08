import type { Dil } from '../../content/types.ts'
import { ZAMAN_DILIMI } from '../saat.ts'

/* Sıralama ekranının tarihleri: sunucunun ISO anı, Girne saatiyle okunur. */

const YEREL: Record<Dil, string> = { tr: 'tr-TR', en: 'en-GB' }

/** Dönemin sıfırlanma anı: "12 Ekim Pazartesi 05:00". */
export function sifirlanmaMetni(iso: string, dil: Dil): string {
  return new Intl.DateTimeFormat(YEREL[dil], {
    timeZone: ZAMAN_DILIMI,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

/** Ödül kodunun son günü: "26 Ekim 2026". */
export function tarihMetni(iso: string, dil: Dil): string {
  const bicim = { timeZone: ZAMAN_DILIMI, day: 'numeric', month: 'long', year: 'numeric' } as const
  return new Intl.DateTimeFormat(YEREL[dil], bicim).format(new Date(iso))
}
