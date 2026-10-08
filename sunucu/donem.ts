import { girneParcalari, KAPANIS_SAATI, ZAMAN_DILIMI } from '../lib/saat.ts'

/*
 * Haftalık dönem (spec §7): Pazartesi 05:00 Girne'de sıfırlanır. Saat dilimi işi sitenin
 * `lib/saat.ts`'inden; burada yalnız hafta aritmetiği var.
 */
const DAKIKA = 60_000
const HAFTA_DAKIKASI = 7 * 24 * 60
export const HAFTA_MS = HAFTA_DAKIKASI * DAKIKA

/** Pazartesi 05:00'ten bu yana geçen yerel dakika. */
function haftaDakikasi(an: Date): number {
  const { saat, dakika, gunIndeksi } = girneParcalari(an)
  const gun = (gunIndeksi + 6) % 7
  return (((gun * 24 + saat - KAPANIS_SAATI) * 60 + dakika) % HAFTA_DAKIKASI + HAFTA_DAKIKASI) % HAFTA_DAKIKASI
}

/** İçinde bulunulan dönemin başı, UTC anı. Arada yaz saati geçişi varsa bir saatlik kayma ikinci adımda düzelir. */
export function donemBaslangici(simdi: Date): Date {
  const dakikaBasi = simdi.getTime() - (simdi.getTime() % DAKIKA)
  const kaba = dakikaBasi - haftaDakikasi(new Date(dakikaBasi)) * DAKIKA
  const parcalar = girneParcalari(new Date(kaba))
  const sapma = (parcalar.saat - KAPANIS_SAATI) * 60 + parcalar.dakika
  return new Date(kaba - sapma * DAKIKA)
}

/** Bir sonraki Pazartesi 05:00; yaz saati haftası 7 gün ± 1 saattir. */
export function donemBitisi(simdi: Date): Date {
  return donemBaslangici(new Date(donemBaslangici(simdi).getTime() + HAFTA_MS + 120 * DAKIKA))
}

const TARIH = new Intl.DateTimeFormat('en-CA', {
  timeZone: ZAMAN_DILIMI,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** Girne'deki takvim günü, `YYYY-MM-DD`. Dönem anahtarı ve günlük sayaç bunu kullanır. */
export function girneGunu(an: Date): string {
  const al = (tur: Intl.DateTimeFormatPartTypes) => TARIH.formatToParts(an).find((p) => p.type === tur)?.value ?? ''
  return `${al('year')}-${al('month')}-${al('day')}`
}

/** Dönemin anahtarı: başladığı Pazartesi'nin Girne tarihi. */
export function donemAnahtari(simdi: Date): string {
  return girneGunu(donemBaslangici(simdi))
}
