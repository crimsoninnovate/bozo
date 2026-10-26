import type { MenuBelgesi } from './tipler.ts'

const BOLUMLER = ['duyuru', 'ikramlar', 'iletisim'] as const

/**
 * Eski (1. sürüm) belgede olmayan bölümleri `tam`dan alır; başka hiçbir şeye dokunmaz.
 * Girdi nesne değilse olduğu gibi döner, doğrulayıcı reddeder.
 */
export function menuBelgesiTamamla(girdi: unknown, tam: MenuBelgesi): unknown {
  if (typeof girdi !== 'object' || girdi === null || Array.isArray(girdi)) return girdi
  const sonuc: Record<string, unknown> = { ...girdi }
  for (const bolum of BOLUMLER) {
    if (sonuc[bolum] === undefined) sonuc[bolum] = structuredClone(tam[bolum])
  }
  return sonuc
}
