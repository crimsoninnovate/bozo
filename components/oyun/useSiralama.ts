import { useEffect, useState } from 'react'
import type { BenYaniti, TabloYaniti } from '@/lib/oyun/aktarim'
import { api, ApiHatasi } from '@/lib/oyun/api'
import { hesapOku, hesapSil, type Hesap } from '@/lib/oyun/defter'

export type Yukleme<T> = { durum: 'yukleniyor' } | { durum: 'hata' } | { durum: 'tamam'; veri: T }
export type Silme = 'yok' | 'soruyor' | 'siliniyor' | 'silindi' | 'hata'

/** Sıralama sayfasının verisi: herkese açık tablo, varsa oyuncunun kendi satırı ve ödülü, hesap silme. */
export function useSiralama() {
  const [tablo, setTablo] = useState<Yukleme<TabloYaniti>>({ durum: 'yukleniyor' })
  const [hesap, setHesap] = useState<Hesap | null>(null)
  const [ben, setBen] = useState<BenYaniti | null>(null)
  const [silme, setSilme] = useState<Silme>('yok')

  useEffect(() => {
    api.tabloAl().then(
      (veri) => setTablo({ durum: 'tamam', veri }),
      () => setTablo({ durum: 'hata' }),
    )
  }, [])

  useEffect(() => {
    const kayitli = hesapOku()
    setHesap(kayitli)
    if (!kayitli) return
    // Sunucu hesabı silmişse (90 gün) tarayıcıdaki anahtar da gider.
    api.benAl(kayitli.anahtar).then(setBen, (hata: unknown) => {
      if (hata instanceof ApiHatasi && hata.durum === 401) {
        hesapSil()
        setHesap(null)
      }
    })
  }, [])

  const sil = async () => {
    if (!hesap) return
    setSilme('siliniyor')
    try {
      await api.hesabiSil(hesap.anahtar)
    } catch {
      return setSilme('hata')
    }
    hesapSil()
    setHesap(null)
    setBen(null)
    setSilme('silindi')
  }

  return { tablo, hesap, ben, silme, sor: () => setSilme('soruyor'), vazgec: () => setSilme('yok'), sil }
}
