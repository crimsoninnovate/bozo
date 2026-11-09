/* Personel hesapları ve işlem kaydı: sunucu ve panel aynı türleri ve kuralları kullanır. */

export const ISLEM_TURLERI = [
  'giris', 'menuYayin', 'menuGeriAl', 'foto', 'derleme', 'kod', 'gizle',
  'personelEkle', 'personelKapat', 'personelAc', 'sifreSifirla', 'sifreDegistir',
] as const
export type IslemTuru = (typeof ISLEM_TURLERI)[number]

export const AD_DESENI = /^[a-z0-9][a-z0-9.-]{1,29}$/
export const SIFRE_EN_AZ = 10
export const SIFRE_EN_COK = 200

/** Hesap adı küçük harf ASCII; adminin adı (büyük/küçük harf duyarsız) alınamaz. */
export function adSorunu(ad: string, adminAdi: string): 'adGecersiz' | 'adAdminin' | null {
  if (!AD_DESENI.test(ad)) return 'adGecersiz'
  return ad === adminAdi.toLowerCase() ? 'adAdminin' : null
}

export function sifreSorunu(sifre: string): 'sifreKisa' | 'sifreUzun' | null {
  if (sifre.length < SIFRE_EN_AZ) return 'sifreKisa'
  return sifre.length > SIFRE_EN_COK ? 'sifreUzun' : null
}

export type BenYaniti = { ad: string; admin: boolean; sifreDegismeli: boolean }
export type IslemSatiri = { ad: string; tur: IslemTuru; ayrinti: string; zaman: string }
export type PersonelSatiri = {
  id: number
  ad: string
  kapali: boolean
  sifreDegismeli: boolean
  olusturma: string
  sonGiris: string | null
  sonIslemler: IslemSatiri[]
}
/** `GET /yonetim/personel`: hesaplar ve adminin son işlemleri. */
export type YonetimPersonelYaniti = { personel: PersonelSatiri[]; adminIslemleri: IslemSatiri[] }
export type YonetimIslemlerYaniti = { islemler: IslemSatiri[] }
