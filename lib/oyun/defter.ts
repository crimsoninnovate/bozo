/** Oyunun tarayıcıda tuttuğu iki şey: kişisel en iyi ve ilk turun bittiği (spec §3, §11). */
const EN_IYI = 'bozo-oyun-en-iyi'
const ILK_TUR = 'bozo-oyun-ilk-tur-bitti'

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

/** İpuçları yalnız tarayıcıdaki ilk turda çıkar. */
export function ilkTurMu(): boolean {
  try {
    return window.localStorage.getItem(ILK_TUR) !== '1'
  } catch {
    return true
  }
}

export function ilkTurBitti(): void {
  try {
    window.localStorage.setItem(ILK_TUR, '1')
  } catch {
    // Yazılamazsa ipuçları bir sonraki turda da çıkar; zararsız.
  }
}
