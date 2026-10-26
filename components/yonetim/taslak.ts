import { useEffect } from 'react'
import { yonetim as m } from '@/content/yonetim'
import { TASLAK_ANAHTARI, taslakOku, taslakYaz } from '@/lib/menu/panel'
import type { MenuBelgesi } from '@/lib/menu/tipler'

/* Kaydedilmemiş çalışma kopyasının yerel taslağı: saf kısım `lib/menu/panel.ts`, burada yalnız depo G/Ç.
   Depo hatası (kota, özel mod) paneli bozmaz, uyarı olarak yazılır. */

function depoyaDokun<T>(is: (depo: Storage) => T, ne: string): T | null {
  try {
    return is(window.localStorage)
  } catch (hata) {
    console.warn(`taslak ${ne}: yerel depo kullanılamadı`, hata)
    return null
  }
}

const sil = () => depoyaDokun((d) => d.removeItem(TASLAK_ANAHTARI), 'silinemedi')

type Yuklenen = { belge: MenuBelgesi; mesaj: string | null }

/** Yayındaki belge yüklenince bir kez çağrılır: çalışma kopyası ve durum satırı (varsa) döner. */
export function taslagiYukle(taban: number | null, yayindaki: MenuBelgesi): Yuklenen {
  const ham = depoyaDokun((d) => d.getItem(TASLAK_ANAHTARI), 'okunamadı')
  const sonuc = taslakOku(ham, taban, yayindaki)
  if (sonuc.tur === 'geri') return { belge: sonuc.belge, mesaj: m.menu.taslak.geriYuklendi }
  if (sonuc.tur === 'yok') return { belge: yayindaki, mesaj: null }
  if (sonuc.tur === 'bozuk') console.warn('taslak atıldı, okunamadı:', sonuc.neden)
  sil()
  return { belge: yayindaki, mesaj: sonuc.tur === 'eski' ? m.menu.taslak.eskiAtildi : null }
}

/**
 * Değişiklik varken çalışma kopyasını yazar, yokken siler (yayın, geri alma ve "At" da buradan geçer).
 * `hazir` olmadan dokunmaz: yükleme bitmeden boş kopya saklı taslağı silmesin. Çıkışta silinmez.
 */
export function useTaslakKaydi(hazir: boolean, taban: number | null, belge: MenuBelgesi, degisiklikVar: boolean) {
  useEffect(() => {
    if (!hazir) return
    if (!degisiklikVar) sil()
    else depoyaDokun((d) => d.setItem(TASLAK_ANAHTARI, taslakYaz(taban, belge)), 'yazılamadı')
  }, [hazir, taban, belge, degisiklikVar])
}
