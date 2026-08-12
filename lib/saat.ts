export const ZAMAN_DILIMI = 'Europe/Nicosia'
export const ACILIS_SAATI = 10
export const KAPANIS_SAATI = 5
export const GECE_BASLANGICI = 1

export type Durum = {
  acik: boolean
  gece: boolean
  saat: number
  dakika: number
  gunIndeksi: number
}

const GUN_ADLARI = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

const bicimlendirici = new Intl.DateTimeFormat('en-US', {
  timeZone: ZAMAN_DILIMI,
  hour: '2-digit',
  minute: '2-digit',
  weekday: 'short',
  hour12: false,
})

/** Verilen anın Girne yerel saat, dakika ve gün indeksini döner. */
export function girneParcalari(simdi: Date): {
  saat: number
  dakika: number
  gunIndeksi: number
} {
  const parcalar = bicimlendirici.formatToParts(simdi)
  const al = (tur: Intl.DateTimeFormatPartTypes): string => {
    const parca = parcalar.find((p) => p.type === tur)
    if (!parca) throw new Error(`Saat bileşeni okunamadı: ${tur}`)
    return parca.value
  }
  // hour12:false bazı ortamlarda gece yarısını "24" verir
  const saat = Number(al('hour')) % 24
  const gunIndeksi = GUN_ADLARI.indexOf(al('weekday') as (typeof GUN_ADLARI)[number])
  if (gunIndeksi < 0) throw new Error(`Gün adı çözülemedi: ${al('weekday')}`)
  return { saat, dakika: Number(al('minute')), gunIndeksi }
}

/** Gün aşan çalışma saatine göre açık, gece ve saat bilgisini hesaplar. */
export function durumHesapla(simdi: Date): Durum {
  const { saat, dakika, gunIndeksi } = girneParcalari(simdi)
  return {
    acik: saat >= ACILIS_SAATI || saat < KAPANIS_SAATI,
    gece: saat >= GECE_BASLANGICI && saat < KAPANIS_SAATI,
    saat,
    dakika,
    gunIndeksi,
  }
}

/** Vardiya penceresinin uzunluğu: 10:00'dan ertesi sabah 05:00'e, on dokuz saat. */
const PENCERE_SAATI = 24 - ACILIS_SAATI + KAPANIS_SAATI

/**
 * Verilen anın vardiya penceresindeki kesirli saat karşılığı. Gece yarısını aşan
 * pencere tek eksende ölçülebilsin diye 05:00 öncesi saatler ertesi güne taşınır:
 * 02:00 burada 26'dır, yani açılıştan on altı saat sonra.
 */
function pencereSaati(simdi: Date): number {
  const { saat, dakika } = girneParcalari(simdi)
  const kesirli = saat + dakika / 60
  return kesirli < ACILIS_SAATI ? kesirli + 24 : kesirli
}

/**
 * Vardiyanın ne kadarının geçtiği, yüzde. Hero'nun gün merdiveni ve Gece
 * bölümünün zaman çizelgesi bunu okur. Kapalı aralıkta (05:00 - 10:00) pencere
 * bitmiştir ve 100'e kırpılır: gösterge tepede durur, geri sarmaz.
 */
export function vardiyaYuzdesi(simdi: Date): number {
  const gecen = pencereSaati(simdi) - ACILIS_SAATI
  return Math.min(100, Math.max(0, (gecen / PENCERE_SAATI) * 100))
}

/** Kapanışa kalan süre. Kapalıyken null: geri sayılacak bir şey yok. */
export function kapanisaKalan(simdi: Date): { saat: number; dakika: number } | null {
  const kalanKesirli = ACILIS_SAATI + PENCERE_SAATI - pencereSaati(simdi)
  if (kalanKesirli <= 0) return null
  const toplamDakika = Math.round(kalanKesirli * 60)
  return { saat: Math.floor(toplamDakika / 60), dakika: toplamDakika % 60 }
}

/**
 * Saat tablosundaki "Bugün" satırının hangi güne düşeceğini verir.
 * 05:00 öncesi vardiya bir önceki güne aittir.
 */
export function gosterimGunIndeksi(simdi: Date): number {
  const { saat, gunIndeksi } = girneParcalari(simdi)
  if (saat >= KAPANIS_SAATI) return gunIndeksi
  return (gunIndeksi + 6) % 7
}

/** Saat ve dakikayı iki haneli metne çevirir. */
export function saatMetni(d: Durum): { saat: string; dakika: string } {
  return {
    saat: String(d.saat).padStart(2, '0'),
    dakika: String(d.dakika).padStart(2, '0'),
  }
}
