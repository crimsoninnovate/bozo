import type { Saatler } from './menu/tipler.ts'

type Ekler = { de: string; den: string; e: string }
export type SaatEki = keyof Ekler

/** Sayının söylenen son kelimesine göre ekler: sıfır, bir ... dokuz. */
const BIRLER: readonly Ekler[] = [
  { de: 'da', den: 'dan', e: 'a' },
  { de: 'de', den: 'den', e: 'e' },
  { de: 'de', den: 'den', e: 'ye' },
  { de: 'te', den: 'ten', e: 'e' },
  { de: 'te', den: 'ten', e: 'e' },
  { de: 'te', den: 'ten', e: 'e' },
  { de: 'da', den: 'dan', e: 'ya' },
  { de: 'de', den: 'den', e: 'ye' },
  { de: 'de', den: 'den', e: 'e' },
  { de: 'da', den: 'dan', e: 'a' },
]
const ON: Ekler = { de: 'da', den: 'dan', e: 'a' }
const YIRMI: Ekler = { de: 'de', den: 'den', e: 'ye' }

/** Saati iki haneli `HH:00` metnine çevirir. */
export function saatYaz(saat: number): string {
  return `${String(saat).padStart(2, '0')}:00`
}

/** Saate Türkçe hâl eki getirir: `10:00'da`, `05:00'e`. `saat` 0-23 tam sayıdır. */
export function saatEki(saat: number, ek: SaatEki): string {
  const ekler = saat === 10 ? ON : saat === 20 ? YIRMI : BIRLER[saat % 10]
  if (!Number.isInteger(saat) || saat < 0 || saat > 23 || !ekler) {
    throw new Error(`Geçersiz saat: ${saat}`)
  }
  return `${saatYaz(saat)}'${ekler[ek]}`
}

const YER_TUTUCU = /\{(acilis|kapanis)(?:-(de|den|e))?\}/g

/** `{acilis}`, `{kapanis-den}` gibi yer tutucuları verilen saatlerle doldurur; bilinmeyenlere dokunmaz. */
export function saatleriDoldur(metin: string, saatler: Saatler): string {
  return metin.replace(YER_TUTUCU, (_, hangisi: keyof Saatler, ek: SaatEki | undefined) =>
    ek ? saatEki(saatler[hangisi], ek) : saatYaz(saatler[hangisi]),
  )
}
