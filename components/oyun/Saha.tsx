import { useEffect, useRef, useState } from 'react'
import { sozluk, type Sozluk } from '@/content'
import type { Dil } from '@/content/types'
import type { Girdi, Sonuc, Urun } from '@/lib/oyun/tipler'
import { Hud, Ocak, Raf, Sofralar, Tezgah } from './Seritler'
import { dokunus } from './tepkiler'
import { useOyunAlani } from './useOyunAlani'
import stil from './Saha.module.css'

type Props = {
  dil: Dil
  tohum: number
  ipucu: boolean
  bitince: (sonuc: Sonuc, kayit: readonly Girdi[]) => void
  cik: () => void
}

type PerdeProps = { metin: Sozluk['oyun']; devam: () => void; cik: () => void }

/** Duraklatma perdesi. Çıkış girişe döner; tur boyunca gizli kabuk orada geri gelir. */
function Perde({ metin, devam, cik }: PerdeProps) {
  return (
    <div className={stil.perde}>
      <div className={stil.perdeDugmeleri}>
        <button type="button" className={stil.devam} onClick={devam} autoFocus>
          {metin.devam}
        </button>
        <button type="button" className={stil.cik} onClick={cik}>
          {metin.cik}
        </button>
      </div>
    </div>
  )
}

/** Oyun alanı. Yalnız istemci `OyunSayfasi`'ndan çağrılır, kendi sınırı yoktur. */
export function Saha({ dil, tohum, ipucu, bitince, cik }: Props) {
  const s = sozluk(dil)
  const ad = (u: Urun): string => (u === 'ayran' ? s.menu.icecekler.urunler.ayran : s.menu.ocakbasi.urunler[u].ad)
  const kok = useRef<HTMLDivElement>(null)
  const [vurgu, setVurgu] = useState<Urun | null>(null)
  const { goruntu, dokun, duraklatildi, duraklat, devam, azalt, ses } = useOyunAlani({
    kok,
    tohum,
    ipucu,
    metin: s.oyun,
    bitince,
  })

  useEffect(() => {
    if (!vurgu) return
    const zaman = setTimeout(() => setVurgu(null), 700)
    return () => clearTimeout(zaman)
  }, [vurgu])

  const vurgula = (urun: Urun, el: HTMLElement) => {
    setVurgu(urun)
    dokunus(el, azalt)
  }
  const serit = { goruntu, ad, dokun, metin: s.oyun }
  return (
    <div ref={kok} className={stil.saha}>
      <span className={stil.gece} data-gece aria-hidden="true" />
      <Hud metin={s.oyun} duraklat={duraklat} ses={ses} />
      <Sofralar {...serit} vurgu={vurgu} />
      <Ocak {...serit} />
      <Tezgah {...serit} vurgula={vurgula} />
      <Raf {...serit} />
      <p className={stil.gizli} aria-live="polite" data-duyuru />
      {duraklatildi && <Perde metin={s.oyun} devam={devam} cik={cik} />}
    </div>
  )
}
