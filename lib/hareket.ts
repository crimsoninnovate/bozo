/** İşletim sisteminin hareket azaltma tercihini okur. SSR'da false döner. */
export function hareketAzaltilmisMi(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Verilen işi kare başına en fazla bir kez çalıştırır.
 * Dönen fonksiyon çağrıldığında bir sonraki kareye kaydeder.
 */
export function rafKisitla(fn: () => void): () => void {
  let bekliyor = false
  return () => {
    if (bekliyor) return
    bekliyor = true
    requestAnimationFrame(() => {
      bekliyor = false
      fn()
    })
  }
}
