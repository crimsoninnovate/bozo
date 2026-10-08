'use client'

import { useEffect, useRef, useState } from 'react'
import { sozluk, type Sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { AYRAN_TIK, SOGUMA_TIK, TUR_TIK } from '@/lib/oyun/ayar'
import { ipucuHedefi, oyunSaati, sisGorunumu, type Goruntu } from '@/lib/oyun/gosterim'
import { komboCarpani } from '@/lib/oyun/puan'
import type { Hedef, Olay, Oyun, Sonuc, Urun } from '@/lib/oyun/tipler'
import { useOyunDongusu } from './useOyunDongusu'
import stil from './Saha.module.css'

type Props = { dil: Dil; tohum: number; ipucu: boolean; bitince: (sonuc: Sonuc) => void }
type Metin = Sozluk['oyun']
type SeritProps = { goruntu: Goruntu; ad: (u: Urun) => string; dokun: (hedef: Hedef) => void; metin: Metin }

const YUVALAR = [0, 1, 2, 3] as const

function metinYaz(el: HTMLElement, metin: string): void {
  if (el.textContent !== metin) el.textContent = metin
}

function oranYaz(el: HTMLElement, oran: number): void {
  el.style.setProperty('--oran', String(oran))
}

/** Bir çizim öğesinin her karede değişen değeri; `data-ciz` adına göre. */
function ogeyiCiz(el: HTMLElement, oyun: Oyun): void {
  const no = Number(el.dataset.no)
  const sofra = oyun.sofralar[no]
  const sis = oyun.ocak[no]
  const kalem = oyun.tezgah[no]
  switch (el.dataset.ciz) {
    case 'saat':
      return metinYaz(el, oyunSaati(oyun.tik))
    case 'gece':
      return oranYaz(el, oyun.tik / TUR_TIK)
    case 'puan':
      return metinYaz(el, String(oyun.puan))
    case 'kombo':
      return metinYaz(el, `×${komboCarpani(oyun.kombo)}`)
    case 'sabir':
      return oranYaz(el, sofra ? sofra.sabir / sofra.toplamSabir : 0)
    case 'ocak':
      el.dataset.gorunum = sis ? sisGorunumu(sis) : 'bos'
      return oranYaz(el, sis ? sis.gecen / (sis.pisme + sis.pencere) : 0)
    case 'soguma':
      return oranYaz(el, kalem ? 1 - kalem.bekleme / SOGUMA_TIK : 0)
    case 'ayran':
      return oranYaz(el, oyun.ayran === null ? 0 : 1 - oyun.ayran / AYRAN_TIK)
  }
}

/** Animasyonu baştan oynatmak için sınıfı söküp takar. */
function parla(el: HTMLElement | null, sinif: string | undefined): void {
  if (!el || !sinif) return
  el.classList.remove(sinif)
  void el.offsetWidth
  el.classList.add(sinif)
}

function olayaTepki(alan: HTMLElement, olay: Olay): void {
  const hedef = (h: string) => alan.querySelector<HTMLElement>(`[data-hedef="${h}"]`)
  if (olay.tur === 'sisAlindi') parla(hedef(`o${olay.yuva}`), stil[olay.kalite])
  if (olay.tur === 'sisYandi') parla(hedef(`o${olay.yuva}`), stil.yandi)
  if (olay.tur === 'sofraKalkti' && !olay.odedi) parla(hedef(`s${olay.sofra}`), stil.kalkti)
  if (olay.tur === 'fisTamam') {
    const son = alan.querySelector<HTMLElement>('[data-son]')
    if (son) metinYaz(son, `+${olay.odeme}`)
    parla(hedef(`s${olay.sofra}`), stil.odedi)
  }
}

export function Saha({ dil, tohum, ipucu, bitince }: Props) {
  const s = sozluk(dil)
  const ad = (u: Urun): string => (u === 'ayran' ? s.menu.icecekler.urunler.ayran : s.menu.ocakbasi.urunler[u].ad)
  const kok = useRef<HTMLDivElement>(null)
  const [vurgu, setVurgu] = useState<Urun | null>(null)

  const ciz = (oyun: Oyun) => {
    const alan = kok.current
    if (!alan) return
    for (const el of alan.querySelectorAll<HTMLElement>('[data-ciz]')) ogeyiCiz(el, oyun)
    const hedef = ipucu ? ipucuHedefi(oyun) : null
    for (const el of alan.querySelectorAll<HTMLElement>('[data-hedef]')) {
      el.toggleAttribute('data-ipucu', el.dataset.hedef === hedef)
    }
  }
  const tepki = (olaylar: Olay[]) => {
    const alan = kok.current
    if (alan) for (const olay of olaylar) olayaTepki(alan, olay)
  }
  const { goruntu, dokun, duraklatildi, duraklat, devam } = useOyunDongusu({ tohum, ciz, tepki, bitince })

  useEffect(() => {
    if (!vurgu) return
    const zaman = setTimeout(() => setVurgu(null), 700)
    return () => clearTimeout(zaman)
  }, [vurgu])

  const serit = { goruntu, ad, dokun, metin: s.oyun }
  return (
    <div ref={kok} className={stil.saha}>
      <Hud metin={s.oyun} duraklat={duraklat} />
      <Sofralar {...serit} vurgu={vurgu} />
      <Ocak {...serit} />
      <Tezgah {...serit} vurgula={setVurgu} />
      <section className={stil.raf}>
        {goruntu.raf.map((urun) => (
          <button key={urun} type="button" className={stil.rafUrun} data-hedef={urun} onClick={() => dokun(urun)}>
            {ad(urun)}
          </button>
        ))}
      </section>
      {duraklatildi && (
        <div className={stil.perde}>
          <button type="button" className={stil.devam} onClick={devam} autoFocus>
            {s.oyun.devam}
          </button>
        </div>
      )}
    </div>
  )
}

function Hud({ metin, duraklat }: { metin: Metin; duraklat: () => void }) {
  return (
    <header className={stil.hud}>
      <span className={stil.saat} data-ciz="saat">
        21:00
      </span>
      <span className={stil.geceRayi} data-ciz="gece" aria-hidden="true" />
      <span className={stil.puan} aria-label={metin.puan} data-ciz="puan">
        0
      </span>
      <span className={stil.kombo} aria-label={metin.kombo} data-ciz="kombo">
        ×1
      </span>
      <span className={stil.son} data-son aria-hidden="true" />
      <button type="button" className={stil.duraklat} onClick={duraklat}>
        {metin.duraklat}
      </button>
    </header>
  )
}

function Sofralar({ goruntu, ad, dokun, metin, vurgu }: SeritProps & { vurgu: Urun | null }) {
  return (
    <section className={stil.sofralar} aria-label={metin.sofra}>
      {YUVALAR.map((no) => {
        if (no >= goruntu.acikSofra) return <div key={no} className={stil.kapali} />
        const sofra = goruntu.sofralar[no]
        return (
          <button
            key={no}
            type="button"
            className={stil.sofra}
            data-hedef={`s${no}`}
            data-kurulu={sofra?.kurulu ? '' : undefined}
            data-vurgu={sofra && vurgu && sofra.kalan.includes(vurgu) ? '' : undefined}
            aria-label={sofra ? `${metin.sofra} ${no + 1}: ${sofra.kalan.map(ad).join(', ')}` : metin.bosSofra}
            onClick={() => dokun(`s${no}` as Hedef)}
          >
            <span className={stil.fis}>
              {sofra?.kalan.map((u, i) => (
                <span key={i}>{ad(u)}</span>
              ))}
            </span>
            {sofra && <span className={stil.sabir} data-ciz="sabir" data-no={no} aria-hidden="true" />}
          </button>
        )
      })}
      {goruntu.kapida > 0 && (
        <span className={stil.kapida}>
          {metin.kapida} {goruntu.kapida}
        </span>
      )}
    </section>
  )
}

function Ocak({ goruntu, ad, dokun, metin }: SeritProps) {
  return (
    <section className={stil.ocak} aria-label={metin.ocak}>
      {YUVALAR.map((no) => {
        if (no >= goruntu.acikOcak) return <div key={no} className={stil.kapali} />
        const sis = goruntu.ocak[no]
        const ray = sis ? ({ '--centik': sis.centik, '--pencere': sis.pencere } as React.CSSProperties) : undefined
        return (
          <button
            key={no}
            type="button"
            className={stil.yuva}
            data-hedef={`o${no}`}
            data-ciz="ocak"
            data-no={no}
            aria-label={`${metin.ocak} ${no + 1}${sis ? `: ${ad(sis.urun)}` : ''}`}
            style={ray}
            onClick={() => dokun(`o${no}` as Hedef)}
          >
            <span className={stil.yuvaAdi}>{sis ? ad(sis.urun) : ''}</span>
            <span className={stil.ray} aria-hidden="true">
              <span className={stil.rayDolum} />
              {sis && <span className={stil.centik} data-cevirme={sis.cevirme} />}
              {sis && <span className={stil.pencere} />}
            </span>
          </button>
        )
      })}
    </section>
  )
}

function Tezgah({ goruntu, ad, dokun, metin, vurgula }: SeritProps & { vurgula: (u: Urun) => void }) {
  return (
    <section className={stil.tezgah} aria-label={metin.tezgah}>
      {YUVALAR.map((no) => {
        const kalem = goruntu.tezgah[no]
        if (!kalem) return <div key={no} className={stil.tezgahBos} />
        return (
          <button
            key={no}
            type="button"
            className={stil.tezgahKalem}
            data-kalite={kalem.kalite ?? 'ayran'}
            aria-label={`${metin.tezgah}: ${ad(kalem.urun)}`}
            onClick={() => vurgula(kalem.urun)}
          >
            {ad(kalem.urun)}
            {kalem.kalite && <span className={stil.soguma} data-ciz="soguma" data-no={no} aria-hidden="true" />}
          </button>
        )
      })}
      <button
        type="button"
        className={stil.ayran}
        data-hedef="ayran"
        data-ciz="ayran"
        data-durum={goruntu.ayran}
        onClick={() => dokun('ayran')}
      >
        {ad('ayran')}
      </button>
    </section>
  )
}
