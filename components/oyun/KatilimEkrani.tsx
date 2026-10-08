import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { sozluk, type Sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { TAKMA_AD_EN_COK, takmaAdBicimiGecerliMi, takmaAdDuzelt } from '@/lib/oyun/takmaAd'
import { yol } from '@/lib/site'
import type { Kayit } from './useOyunAkisi'
import stil from './KatilimEkrani.module.css'

type Props = { dil: Dil; kaydet: (takmaAd: string) => Promise<Kayit>; vazgec: () => void }
type Durum = 'bos' | 'gonderiliyor' | 'red' | 'hata'
type AlanProps = { s: Sozluk; ad: string; hata: string | null; degis: (ad: string) => void }

/** Takma ad alanı: kural her zaman, hata varsa `role="alert"`; ikisi de alana bağlı. Odak açılışta burada. */
function TakmaAdAlani({ s, ad, hata, degis }: AlanProps) {
  const alanRef = useRef<HTMLInputElement>(null)
  useEffect(() => alanRef.current?.focus(), [])
  return (
    <>
      <label className={stil.etiket} htmlFor="takma-ad">
        {s.oyun.katilim.takmaAd}
      </label>
      <input
        ref={alanRef}
        id="takma-ad"
        className={stil.alan}
        value={ad}
        onChange={(e) => degis(e.target.value)}
        maxLength={TAKMA_AD_EN_COK}
        autoComplete="off"
        autoCapitalize="words"
        spellCheck={false}
        aria-invalid={hata ? true : undefined}
        aria-describedby={hata ? 'takma-ad-kural takma-ad-hata' : 'takma-ad-kural'}
      />
      <p id="takma-ad-kural" className={stil.kural}>
        {s.oyun.katilim.kural}
      </p>
      {hata && (
        <p id="takma-ad-hata" className={stil.hata} role="alert">
          {hata}
        </p>
      )}
    </>
  )
}

/**
 * Katılım ekranı (spec §8), tek amaçlı: takma ad, onay cümlesi, Gizlilik, "Kaydet ve Katıl".
 * Düğme Md. 11(2)(A) açık onayıdır. Biçim tarayıcıda, yasaklı liste sunucuda denetlenir.
 */
export function KatilimEkrani({ dil, kaydet, vazgec }: Props) {
  const s = sozluk(dil)
  const [ad, setAd] = useState('')
  const [durum, setDurum] = useState<Durum>('bos')

  const gonder = async (olay: FormEvent) => {
    olay.preventDefault()
    const duzgun = takmaAdDuzelt(ad)
    if (!takmaAdBicimiGecerliMi(duzgun)) return setDurum('red')
    setDurum('gonderiliyor')
    const sonuc = await kaydet(duzgun)
    if (sonuc !== 'tamam') setDurum(sonuc)
  }
  const degis = (yeni: string) => {
    setAd(yeni)
    setDurum('bos')
  }
  const hata = durum === 'red' ? s.oyun.katilim.red : durum === 'hata' ? s.oyun.katilim.hata : null

  return (
    <form className={stil.katilim} onSubmit={gonder} noValidate>
      <h2 className={stil.baslik}>{s.oyun.katilim.baslik}</h2>
      <TakmaAdAlani s={s} ad={ad} hata={hata} degis={degis} />
      <p className={stil.aciklama}>{s.oyun.katilim.aciklama}</p>
      <p className={stil.uyari}>{s.oyun.katilim.uyari}</p>
      <Link href={yol('gizlilik', dil)} className={stil.baglanti} target="_blank" rel="noopener">
        {s.ortak.nav.gizlilik}
      </Link>
      <div className={stil.dugmeler}>
        <button type="submit" className={stil.kaydet} disabled={durum === 'gonderiliyor'}>
          {s.oyun.katilim.kaydet}
        </button>
        <button type="button" className={stil.vazgec} onClick={vazgec}>
          {s.oyun.katilim.vazgec}
        </button>
      </div>
    </form>
  )
}
