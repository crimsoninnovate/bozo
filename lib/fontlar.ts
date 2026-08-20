import { Archivo, Bevan } from 'next/font/google'

/*
 * 20 Ağustos 2026, header+hero v2: Bricolage Grotesque ve Inter çıktı.
 * Gerekçe handoff'ta: nötr grotesk rozetin ağır slab karakteriyle aynı cümlede
 * durmuyordu.
 *
 * latin-ext zorunlu: ğ Ğ ş Ş İ bu alt kümede, ı ç ö ü latin'de. Google'ın CSS
 * API'si 20 Ağustos 2026'da doğrulandı, iki font da iki alt kümeyi de sunuyor.
 */

/** Tek ağırlık: Bevan'ın 400'ü var, başkası yok. Başlıklarda 700/800 YAZILMAZ,
 *  tarayıcı sentetik kalın üretir ve slab formu bozulur. */
export const bevan = Bevan({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  display: 'swap',
  variable: '--font-bevan',
})

export const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-archivo',
})

export const fontSiniflari = `${bevan.variable} ${archivo.variable}`
