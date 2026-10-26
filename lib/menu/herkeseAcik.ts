import type { MenuBelgesi } from './tipler.ts'

/**
 * Belgenin herkese açık hali: telefon kapalıyken numara boşaltılır (sahibi 19 Ekim 2026'da kaldırdı).
 * Saklanan numarayı yalnız yetkili `GET /yonetim/menu` taşır. 1. sürüm belgede `iletisim` olmayabilir.
 */
export function herkeseAcik(b: MenuBelgesi): MenuBelgesi {
  const { iletisim } = b as Partial<MenuBelgesi>
  if (!iletisim || iletisim.telefonAcik) return b
  return { ...b, iletisim: { ...iletisim, telefon: '' } }
}

/** Statik çıktının belgesi: tükendi bayrağı aynı güne ait, build'e gömülmez; menü sayfası onu canlı okur. */
export function tukendisiz(b: MenuBelgesi): MenuBelgesi {
  return {
    ...b,
    kalemler: b.kalemler.map((k) => ({ ...k, tukendi: false })),
    icecekler: b.icecekler.map((i) => ({ ...i, tukendi: false })),
  }
}
