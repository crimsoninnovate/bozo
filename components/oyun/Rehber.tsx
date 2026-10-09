import { useLayoutEffect, useState, type RefObject } from 'react'
import type { Sozluk } from '@/content'
import type { RehberAdimi } from '@/lib/oyun/rehber'
import type { Elde } from '@/lib/oyun/tipler'
import { ElIsareti } from './Semboller'
import stil from './Rehber.module.css'

type Metin = Sozluk['oyun']['rehber']
type Adim = Exclude<RehberAdimi, 'bitti' | 'bekle' | 'ikinci'>
type Props = { alan: RefObject<HTMLElement | null>; adim: Adim; el: Elde; metin: Metin; tamam: () => void; atla: () => void }

/** Dokunma modunda her adımın tek açık hedefi; iki dokunuşlu adımlarda ikincisi el dolunca. */
function hedefSecici(adim: Adim, el: Elde): string {
  switch (adim) {
    case 'fis':
      return '[data-hedef="m0"]'
    case 'raf':
      return '[data-hedef="ciger"]'
    case 'pisiyor':
    case 'hazir':
      return '[data-hedef="o0"]'
    case 'tabak':
      return '[data-hedef="t0"]'
    case 'misafir':
      return el?.tur === 'tabak' ? '[data-hedef="m0"]' : '[data-hedef="t0"]'
    case 'para':
      return '[data-hedef="p0"]'
    case 'eslikci':
      return el?.tur === 'eslikci' ? '[data-hedef="t0"]' : '[data-hedef="domates"]'
  }
}

type Kutu = { sol: number; ust: number; en: number; boy: number }
const PAY = 6

function olc(alan: HTMLElement, secici: string | null): Kutu | null {
  const el = secici ? alan.querySelector<HTMLElement>(secici) : null
  if (!el) return null
  const a = alan.getBoundingClientRect()
  const h = el.getBoundingClientRect()
  return { sol: h.left - a.left - PAY, ust: h.top - a.top - PAY, en: h.width + 2 * PAY, boy: h.height + 2 * PAY }
}

const merkez = (k: Kutu) => ({ x: k.sol + k.en / 2, y: k.ust + k.boy / 2 })

/**
 * Oyun alanının üstünde karartma, tek açık hedef, nabız atan el, tek cümlelik balon, Atla (spec tabak §7).
 * Katman tıklamayı yutmaz: yanlış girdiyi `rehberIzni` süzer. Yalnız Tamam ve Atla düğmesi tıklanır.
 */
export function Rehber({ alan, adim, el, metin, tamam, atla }: Props) {
  const [kaynak, setKaynak] = useState<Kutu | null>(null)
  const secici = hedefSecici(adim, el)

  useLayoutEffect(() => {
    const kok = alan.current
    if (!kok) return
    const guncelle = () => setKaynak(olc(kok, secici))
    guncelle()
    const izleyici = new ResizeObserver(guncelle)
    izleyici.observe(kok)
    return () => izleyici.disconnect()
  }, [alan, secici])

  if (!kaynak) return null
  const altta = kaynak.ust + kaynak.boy / 2 < (alan.current?.clientHeight ?? 0) / 2
  const balon = altta ? { top: kaynak.ust + kaynak.boy + 48 } : { bottom: `calc(100% - ${kaynak.ust}px + 48px)` }
  const a = merkez(kaynak)
  return (
    <div className={stil.rehber} data-rehber={adim} data-hedef-secici={secici}>
      <span className={stil.delik} style={{ left: kaynak.sol, top: kaynak.ust, width: kaynak.en, height: kaynak.boy }} />
      <span className={stil.el} data-nabiz style={{ left: a.x, top: a.y }}>
        <ElIsareti boy={36} />
      </span>
      <p className={stil.balon} style={balon} role="status">
        {metin[adim]}
        {adim === 'fis' && (
          <button type="button" className={stil.tamam} onClick={tamam}>{metin.tamam}</button>
        )}
      </p>
      <button type="button" className={stil.atla} onClick={atla}>{metin.atla}</button>
    </div>
  )
}
