/** Kayan pencereli hız sınırı, yalnız bellekte (spec §8: uygulama IP yazmaz). */
export type HizSiniri = {
  /** İzin varsa sayar ve true döner; limit dolduysa false. */
  izinVar(anahtar: string, simdi: number): boolean
  /** Penceresi boşalan anahtarları atar; bellek büyümesin diye ara ara çağrılır. */
  temizle(simdi: number): void
}

export function hizSiniriKur(limit: number, pencereMs: number): HizSiniri {
  const kayit = new Map<string, number[]>()
  const kirp = (zamanlar: number[], simdi: number): number[] => zamanlar.filter((t) => t > simdi - pencereMs)
  return {
    izinVar(anahtar, simdi) {
      const zamanlar = kirp(kayit.get(anahtar) ?? [], simdi)
      if (zamanlar.length >= limit) {
        kayit.set(anahtar, zamanlar)
        return false
      }
      zamanlar.push(simdi)
      kayit.set(anahtar, zamanlar)
      return true
    },
    temizle(simdi) {
      for (const [anahtar, zamanlar] of kayit) {
        const kalan = kirp(zamanlar, simdi)
        if (kalan.length === 0) kayit.delete(anahtar)
        else kayit.set(anahtar, kalan)
      }
    },
  }
}
