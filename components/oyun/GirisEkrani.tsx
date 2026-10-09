import { useEffect, useState } from 'react'
import { sozluk } from '@/content'
import type { Dil } from '@/content/types'
import type { TabloYaniti } from '@/lib/oyun/aktarim'
import { TAKMA_AD_EN_COK, takmaAdBicimiGecerliMi, takmaAdDuzelt } from '@/lib/oyun/takmaAd'
import { GirisBaglantilari, GirisTablosu } from './GirisTablosu'
import { OyunAcilisi } from './OyunAcilisi'
import type { Sunucu } from './useOyunAkisi'
import stil from './GirisEkrani.module.css'

type Props = {
  dil: Dil
  basla: (takmaAd: string | null) => void
  bekliyor: boolean
  sunucu: Sunucu
  hesapAdi: string | null
  tablo: TabloYaniti | null
}

/** Giriş (spec §11, handoff 1a): açılış, isteğe bağlı takma ad, Oyna 64 px, sıralama bloğu, bağlantılar.
 *  Jeton gelene kadar düğme kilitli. */
export function GirisEkrani({ dil, basla, bekliyor, sunucu, hesapAdi, tablo }: Props) {
  const s = sozluk(dil)
  const [ad, setAd] = useState(hesapAdi ?? '')
  const [hata, setHata] = useState(false)
  // Hesap tarayıcıdan geç okunur: alan henüz dokunulmadıysa hazır ad dolar.
  useEffect(() => setAd((onceki) => (onceki === '' && hesapAdi ? hesapAdi : onceki)), [hesapAdi])

  const oyna = () => {
    const duzgun = takmaAdDuzelt(ad)
    if (duzgun === '' || sunucu !== 'var') return basla(null)
    if (!takmaAdBicimiGecerliMi(duzgun)) return setHata(true)
    basla(duzgun)
  }

  return (
    <OyunAcilisi
      baslik={s.oyun.baslik}
      cumle={s.ana.gece.baslik}
      baglantilar={<GirisBaglantilari dil={dil} />}
      altinda={<GirisTablosu dil={dil} tablo={tablo} />}
    >
      {sunucu === 'var' && (
        <div className={stil.ad}>
          <label className={stil.adEtiket} htmlFor="giris-takma-ad">
            {s.oyun.giris.takmaAd}
          </label>
          <input
            id="giris-takma-ad"
            className={stil.adAlani}
            value={ad}
            onChange={(e) => {
              setAd(e.target.value)
              setHata(false)
            }}
            maxLength={TAKMA_AD_EN_COK}
            autoComplete="off"
            autoCapitalize="words"
            spellCheck={false}
            aria-invalid={hata ? true : undefined}
            aria-describedby={hata ? 'giris-ad-kural giris-ad-bilgi' : 'giris-ad-bilgi'}
          />
          <p id="giris-ad-bilgi" className={stil.adBilgi}>
            {s.oyun.katilim.aciklama}
          </p>
          {hata && (
            <p id="giris-ad-kural" className={stil.adHata} role="alert">
              {s.oyun.katilim.kural}
            </p>
          )}
        </div>
      )}
      <button type="button" className={stil.oyna} onClick={oyna} disabled={bekliyor}>
        {s.oyun.oyna}
      </button>
    </OyunAcilisi>
  )
}
