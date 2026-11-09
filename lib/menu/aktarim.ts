import type { MenuBelgesi } from './tipler.ts'

/* Menü uçlarının ortak sözleşmesi: skor sunucusu ve tarayıcı istemcisi aynı tipleri okur. */

export type MenuYaniti = { surum: number; belge: MenuBelgesi }
export type SurumOzeti = { id: number; olusturma: string; kaynak: 'panel' | 'geriAl' }
export type YonetimMenuYaniti = { gecerli: MenuYaniti | null; surumler: SurumOzeti[] }
export type MenuYayinYaniti = { surum: number }
/** `POST /yonetim/foto`: içerik adı (`<16 hex>.webp`) ve okunan piksel boyutu. */
export type FotoYukleYaniti = { dosya: string; en: number; boy: number }
