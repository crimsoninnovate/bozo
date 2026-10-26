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
