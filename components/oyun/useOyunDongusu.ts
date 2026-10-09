import { useEffect, useEffectEvent, useState } from 'react'
import { canliAdim, canliBaslat, canliDokun } from '@/lib/oyun/canli'
import { goruntuAl } from '@/lib/oyun/gosterim'
import type { Girdi, Hedef, Olay, Oyun, Sonuc } from '@/lib/oyun/tipler'
import { adimSayisi } from '@/lib/oyun/zamanlayici'

type Secenek = {
  tohum: number
  /** Her karede çağrılır; `ilerledi` false ise bu karede tik olmadı (120 Hz ekran), DOM yazımı atlanır. */
  ciz: (oyun: Oyun, ilerledi: boolean) => void
  /** Karede olan olaylar; anlık tepkiler için. */
  tepki: (olaylar: Olay[]) => void
  /** Tur bitince sonuç ve dokunuş kaydı; kayıt sunucuya gider (spec §7). */
  bitince: (sonuc: Sonuc, kayit: readonly Girdi[]) => void
  /** Rehberli adımda saat durur; sıradaki girdi varsa tam bir tik işler ki girdi etki etsin. */
  durdur: () => boolean
  /** Her karede, olaylar boş olsa da: rehber adımını ilerletir. */
  izle: (oyun: Oyun, olaylar: readonly Olay[]) => void
}

/** Sekme arka plana geçince oyun duraklar; otomatik başlama yok (spec §15). Setter sabit, abonelik bir kez. */
function useGizleninceDuraklat(setDuraklatildi: (durum: boolean) => void): void {
  useEffect(() => {
    const gizlenince = () => {
      if (document.hidden) setDuraklatildi(true)
    }
    document.addEventListener('visibilitychange', gizlenince)
    return () => document.removeEventListener('visibilitychange', gizlenince)
  }, [setDuraklatildi])
}

/**
 * Sabit adımlı oyun döngüsü (spec §10). Simülasyon tikte, çizim karede ilerler; React
 * yalnız olay olunca yeniden çizer, sürekli değerleri `ciz` doğrudan yazar.
 */
export function useOyunDongusu({ tohum, ciz, tepki, bitince, durdur, izle }: Secenek) {
  const [canli] = useState(() => canliBaslat(tohum))
  const [goruntu, setGoruntu] = useState(() => goruntuAl(canli.oyun))
  const [duraklatildi, setDuraklatildi] = useState(false)

  const duruyor = useEffectEvent(durdur)
  const izleyici = useEffectEvent(izle)

  const kareSonu = useEffectEvent((olaylar: Olay[], adim: number) => {
    izleyici(canli.oyun, olaylar)
    if (olaylar.length > 0) {
      setGoruntu(goruntuAl(canli.oyun))
      tepki(olaylar)
    }
    ciz(canli.oyun, adim > 0)
    const bitti = canli.oyun.bitti
    if (bitti) bitince({ puan: canli.oyun.puan, ozet: { ...canli.oyun.ozet }, bitti, tik: canli.oyun.tik }, canli.kayit)
  })

  useEffect(() => {
    if (duraklatildi) return
    let istek = 0
    let onceki = performance.now()
    let birikim = 0
    const kare = (simdi: number) => {
      const sonuc = adimSayisi(birikim, simdi - onceki)
      onceki = simdi
      const durdu = duruyor()
      const adim = durdu ? Math.min(canli.bekleyen.length, 1) : sonuc.adim
      birikim = durdu ? 0 : sonuc.birikim
      const olaylar: Olay[] = []
      for (let i = 0; i < adim && !canli.oyun.bitti; i++) olaylar.push(...canliAdim(canli))
      kareSonu(olaylar, adim)
      if (!canli.oyun.bitti) istek = requestAnimationFrame(kare)
    }
    istek = requestAnimationFrame(kare)
    return () => cancelAnimationFrame(istek)
  }, [canli, duraklatildi])

  useGizleninceDuraklat(setDuraklatildi)

  const dokun = (hedef: Hedef) => {
    if (!duraklatildi) canliDokun(canli, hedef)
  }

  return {
    goruntu,
    oyunu: () => canli.oyun,
    dokun,
    duraklatildi,
    duraklat: () => setDuraklatildi(true),
    devam: () => setDuraklatildi(false),
  }
}
