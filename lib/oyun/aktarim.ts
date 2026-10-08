import type { Bitis, Girdi, Ozet } from './tipler.ts'

/*
 * Tarayıcı ile skor sunucusunun ortak sözleşmesi (spec §10 uç tablosu, §9 sınırlar). Tipler ve
 * sabitler burada; iki taraf da buradan okur, ikinci bir tanım yok.
 */

/** Giriş kanalı: sofradaki QR, Instagram, ana sayfadaki Gece bandı, doğrudan. */
export type Kanal = 'sofra' | 'ig' | 'site' | 'yok'
export const KANALLAR: readonly Kanal[] = ['sofra', 'ig', 'site', 'yok']

/** Jeton 15 dakika; gönderim en çok 1.200 dokunuş, gövde 64 KB; duvar saati payı 2 sn. */
export const JETON_SURESI_MS = 15 * 60_000
export const EN_COK_DOKUNUS = 1200
export const GOVDE_SINIRI = 64 * 1024
export const SURE_PAYI_MS = 2000
/** Tarayıcı anahtarı 128 bit, hex 32 karakter; sunucu yalnız özetini tutar. */
export const ANAHTAR_HEX = 32
/** Katılım ekranındaki onay cümlesinin sürümü; metin değişince artar, sunucu oyuncuda tutar. */
export const ONAY_SURUMU = 'taslak-2026-10-08'

export type JetonYaniti = { turId: string; tohum: number; sonaErme: string }
export type OyuncuIstegi = { takmaAd: string; anahtar: string; onaySurumu: string }
export type OyuncuYaniti = { takmaAd: string }
export type BitirIstegi = { girdiler: Girdi[] }
export type SiraBilgisi = { puan: number; sira: number; ustekiFark: number | null }
export type BitirYaniti = {
  puan: number
  ozet: Ozet
  bitti: Bitis
  tik: number
  hafta: SiraBilgisi
  /** Bu tur oyuncunun haftalık en iyisi mi; değilse sonuç ekranı en iyiyi de yazar. */
  buTurEnIyi: boolean
}
export type TabloSatiri = { sira: number; takmaAd: string | null; puan: number; tamKivam: number }
export type Sampiyon = { takmaAd: string | null; puan: number; donem: string }
export type TabloYaniti = {
  donem: string
  bitis: string
  hafta: TabloSatiri[]
  tumZamanlar: TabloSatiri[]
  sonSampiyon: Sampiyon | null
}
export type Odul = { kod: string; sira: number; donem: string; gecerlilik: string; kullanildi: boolean }
export type BenYaniti = { takmaAd: string; hafta: SiraBilgisi | null; odul: Odul | null }
export type HataYaniti = { hata: string }
