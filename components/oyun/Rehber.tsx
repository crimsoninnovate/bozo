import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import type { Sozluk } from '@/content'
import type { RehberAdimi } from '@/lib/oyun/rehber'
import { ElIsareti } from './Semboller'
import stil from './Rehber.module.css'

type Metin = Sozluk['oyun']['rehber']
type Adim = Exclude<RehberAdimi, 'bitti' | 'bekle' | 'ikinci'>
type Props = { alan: RefObject<HTMLElement | null>; adim: Adim; metin: Metin; azalt: boolean; tamam: () => void; atla: () => void }
type Cift = readonly [kaynak: string, hedef: string | null]

/** Her adımın açık kaynağı ve varsa bırakma hedefi; ikisi birden açıktır, el kaynaktan hedefe yürür. */
function hedefSecici(adim: Adim): Cift {
  switch (adim) {
    case 'fis':
      return ['[data-hedef="m0"]', null]
    case 'raf':
      return ['[data-hedef="ciger"]', null]
    case 'pisiyor':
      return ['[data-hedef="o0"]', null]
    case 'hazir':
    case 'tabak':
      return ['[data-hedef="o0"]', '[data-hedef="t0"]']
    case 'misafir':
      return ['[data-hedef="t0"]', '[data-hedef="m0"]']
    case 'para':
      return ['[data-hedef="p0"]', null]
    case 'eslikci':
      return ['[data-hedef="domates"]', '[data-hedef="t0"]']
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

/** El kaynaktan hedefe 1,2 sn'de yol çizer (sonsuz); azaltılmışta kaynakta durur, bakır kesikli çizgi iner. */
function useElYolu(el: RefObject<HTMLElement | null>, kaynak: Kutu | null, hedef: Kutu | null, azalt: boolean): void {
  useEffect(() => {
    const dugum = el.current
    if (!dugum || !kaynak || !hedef || azalt) return
    const a = merkez(kaynak)
    const b = merkez(hedef)
    const son = `translate(${b.x - a.x}px, ${b.y - a.y}px)`
    const anim = dugum.animate(
      [
        { transform: 'translate(0, 0)', opacity: 0, offset: 0 },
        { transform: 'translate(0, 0)', opacity: 1, offset: 0.15 },
        { transform: son, opacity: 1, offset: 0.85 },
        { transform: son, opacity: 0, offset: 1 },
      ],
      { duration: 1200, iterations: Infinity, easing: 'ease-in-out' },
    )
    return () => anim.cancel()
  }, [el, kaynak, hedef, azalt])
}

/**
 * Oyun alanının üstünde karartma, açık kaynak ve hedef, kaynaktan hedefe yürüyen el, tek cümlelik balon, Atla
 * (spec tabak §7). Katman tıklamayı yutmaz: yanlış girdiyi `rehberIzni` süzer. Yalnız Tamam ve Atla tıklanır.
 */
export function Rehber({ alan, adim, metin, azalt, tamam, atla }: Props) {
  const [kutular, setKutular] = useState<{ kaynak: Kutu | null; hedef: Kutu | null }>({ kaynak: null, hedef: null })
  const elRef = useRef<HTMLSpanElement>(null)
  const [kaynakSecici, hedefSecicisi] = hedefSecici(adim)
  const { kaynak, hedef } = kutular
  useElYolu(elRef, kaynak, hedef, azalt)

  useLayoutEffect(() => {
    const kok = alan.current
    if (!kok) return
    const guncelle = () => setKutular({ kaynak: olc(kok, kaynakSecici), hedef: olc(kok, hedefSecicisi) })
    guncelle()
    const izleyici = new ResizeObserver(guncelle)
    izleyici.observe(kok)
    return () => izleyici.disconnect()
  }, [alan, kaynakSecici, hedefSecicisi])

  if (!kaynak) return null
  const altta = kaynak.ust + kaynak.boy / 2 < (alan.current?.clientHeight ?? 0) / 2
  const balon = altta ? { top: kaynak.ust + kaynak.boy + 48 } : { bottom: `calc(100% - ${kaynak.ust}px + 48px)` }
  const a = merkez(kaynak)
  return (
    <div className={stil.rehber} data-rehber={adim} data-rehber-hedef={hedefSecicisi ?? undefined}>
      <span className={stil.delik} style={{ left: kaynak.sol, top: kaynak.ust, width: kaynak.en, height: kaynak.boy }} />
      {hedef && (
        <span className={stil.hedef} style={{ left: hedef.sol, top: hedef.ust, width: hedef.en, height: hedef.boy }} />
      )}
      {hedef && azalt && (
        <svg className={stil.yol} aria-hidden="true">
          <line x1={a.x} y1={a.y} x2={merkez(hedef).x} y2={merkez(hedef).y} />
        </svg>
      )}
      <span ref={elRef} className={stil.el} data-nabiz={hedef ? undefined : ''} style={{ left: a.x, top: a.y }}>
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
