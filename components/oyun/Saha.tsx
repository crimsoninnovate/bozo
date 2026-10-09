import { useRef } from 'react'
import { sozluk, type Sozluk } from '@/content'
import type { Dil } from '@/content/types'
import type { Girdi, Kalem, Sonuc } from '@/lib/oyun/tipler'
import { Hud } from './Hud'
import { SahneDefs } from './SahneDefs'
import { Misafirler } from './SeritMisafir'
import { Ocak } from './SeritOcak'
import { Raf } from './SeritRaf'
import { Tabaklar } from './SeritTabak'
import { useEgim } from './useEgim'
import { useOyunAlani } from './useOyunAlani'
import stil from './Saha.module.css'

type Props = {
  dil: Dil
  tohum: number
  rehberli: boolean
  bitince: (sonuc: Sonuc, kayit: readonly Girdi[]) => void
  cik: () => void
}

type PerdeProps = { metin: Sozluk['oyun']; devam: () => void; cik: () => void }

/** Duraklatma perdesi (handoff 280-288). Çıkış girişe döner; tur boyunca gizli kabuk orada geri gelir. */
function Perde({ metin, devam, cik }: PerdeProps) {
  return (
    <div className={stil.perde}>
      <span className={stil.perdeBaslik}>{metin.duraklat}</span>
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

/** Zemin katmanları (handoff 42-46): gece, nokta deseni, kor radyali, vinyet, tanecik. */
function Zemin() {
  return (
    <>
      <span className={stil.gece} data-gece aria-hidden="true" />
      <span className={stil.desen} aria-hidden="true" />
      <span className={stil.zeminKoru} aria-hidden="true" />
      <span className={stil.vinyet} aria-hidden="true" />
      <svg className={stil.tanecik} aria-hidden="true">
        <rect width="100%" height="100%" filter="url(#fGrain)" />
      </svg>
    </>
  )
}

/** Oyun alanı. Yalnız istemci `OyunSayfasi`'ndan çağrılır, kendi sınırı yoktur. `rehberli` Görev 11'de bağlanır. */
export function Saha({ dil, tohum, bitince, cik }: Props) {
  const s = sozluk(dil)
  const ad = (k: Kalem): string => kalemAdi(s, k)
  const kok = useRef<HTMLDivElement>(null)
  const { goruntu, duraklatildi, duraklat, devam, azalt, ses } = useOyunAlani({ kok, tohum, metin: s.oyun, ad, bitince })
  useEgim(kok, azalt)
  const serit = { goruntu, ad, metin: s.oyun }
  return (
    <div ref={kok} className={stil.saha}>
      <SahneDefs />
      <Zemin />
      <Hud metin={s.oyun} duraklat={duraklat} ses={ses} />
      <Misafirler {...serit} />
      <Ocak {...serit} />
      <Tabaklar {...serit} />
      <Raf {...serit} />
      {duraklatildi && <Perde metin={s.oyun} devam={devam} cik={cik} />}
    </div>
  )
}

/** Kalem adı menüden: şişler ocakbaşı ürünleri, eşlikçiler ikram öğeleri (sumaklı soğan `sumakli`). */
function kalemAdi(s: Sozluk, k: Kalem): string {
  if (k === 'domates') return s.menu.ikramlar.ogeler.domates
  if (k === 'sogan') return s.menu.ikramlar.ogeler.sumakli
  return s.menu.ocakbasi.urunler[k].ad
}
