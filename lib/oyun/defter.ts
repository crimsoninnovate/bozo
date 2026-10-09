/**
 * Oyunun tarayıcıda tuttukları: kişisel en iyi, rehberin görüldüğü, ses tercihi (spec §3, §11,
 * §13) ve sıralama hesabı: 128 bitlik anahtar ile takma ad (spec §8, §10).
 */
const EN_IYI = 'bozo-oyun-en-iyi'
const REHBER = 'bozo-oyun-rehber-goruldu'
const SES = 'bozo-oyun-ses'
const ANAHTAR = 'bozo-oyun-anahtar'
const TAKMA_AD = 'bozo-oyun-takma-ad'

export function enIyiOku(): number | null {
  try {
    const deger = Number(window.localStorage.getItem(EN_IYI))
    return Number.isInteger(deger) && deger > 0 ? deger : null
  } catch {
    // Depolama kapalıysa (gizli sekme) en iyi tutulmaz; oyun yine oynanır.
    return null
  }
}

/** Puan öncekini geçiyorsa yazar; yeni en iyiyse true. */
export function enIyiYaz(puan: number): boolean {
  if (puan <= 0) return false
  const onceki = enIyiOku()
  if (onceki !== null && puan <= onceki) return false
  try {
    window.localStorage.setItem(EN_IYI, String(puan))
  } catch {
    // Yazılamazsa yalnız bu oturumda yeni en iyi olarak gösterilir.
  }
  return true
}

/** Rehber yalnız bu tarayıcıdaki ilk turda çıkar; depolama okunamazsa görülmemiş sayılır. */
export function rehberGorulduMu(): boolean {
  try {
    return window.localStorage.getItem(REHBER) === '1'
  } catch {
    return false
  }
}

export function rehberGoruldu(): void {
  try {
    window.localStorage.setItem(REHBER, '1')
  } catch {
    // Yazılamazsa rehber bir sonraki turda da çıkar; zararsız.
  }
}

/** Ses varsayılan kapalı; açılırsa tercih tarayıcıda kalır (spec §13). */
export function sesAcikMi(): boolean {
  try {
    return window.localStorage.getItem(SES) === '1'
  } catch {
    return false
  }
}

export function sesYaz(acik: boolean): void {
  try {
    window.localStorage.setItem(SES, acik ? '1' : '0')
  } catch {
    // Yazılamazsa tercih yalnız bu turda geçerli; bir sonraki açılışta ses yine kapalı.
  }
}

export type Hesap = { anahtar: string; takmaAd: string }

/** Tarayıcı anahtarı: 16 rastgele bayt, hex. Sunucu yalnız özetini tutar. */
export function anahtarUret(): string {
  const baytlar = new Uint8Array(16)
  crypto.getRandomValues(baytlar)
  return Array.from(baytlar, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function hesapOku(): Hesap | null {
  try {
    const anahtar = window.localStorage.getItem(ANAHTAR)
    const takmaAd = window.localStorage.getItem(TAKMA_AD)
    return anahtar && /^[0-9a-f]{32}$/.test(anahtar) && takmaAd ? { anahtar, takmaAd } : null
  } catch {
    return null
  }
}

/** Yazılamazsa (depolama kapalı) hesap yalnız bu oturumda yaşar; katılım ekranı bunu söyler. */
export function hesapYaz(hesap: Hesap): boolean {
  try {
    window.localStorage.setItem(ANAHTAR, hesap.anahtar)
    window.localStorage.setItem(TAKMA_AD, hesap.takmaAd)
    return true
  } catch {
    return false
  }
}

export function hesapSil(): void {
  try {
    window.localStorage.removeItem(ANAHTAR)
    window.localStorage.removeItem(TAKMA_AD)
  } catch {
    // Zaten okunamıyordu; silecek bir şey yok.
  }
}
