import { useSyncExternalStore } from 'react'

const SORGU = '(prefers-reduced-motion: reduce)'

/** İşletim sisteminin hareket azaltma tercihini okur. SSR'da false döner. */
export function hareketAzaltilmisMi(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(SORGU).matches
}

function tercihiIzle(bildir: () => void): () => void {
  const sorgu = window.matchMedia(SORGU)
  sorgu.addEventListener('change', bildir)
  return () => sorgu.removeEventListener('change', bildir)
}

/**
 * Aynı tercih, canlı: oturum içinde değişince bileşen yeniden render olur ve
 * efektleri yeniden kurulur. Tek seferlik okuma bunu kaçırıyordu (ölçüldü: CSS
 * duruyor, tuval, imleç ışığı ve erit oynamaya devam ediyordu).
 */
export function useHareketAzaltilmisMi(): boolean {
  return useSyncExternalStore(tercihiIzle, hareketAzaltilmisMi, () => false)
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
