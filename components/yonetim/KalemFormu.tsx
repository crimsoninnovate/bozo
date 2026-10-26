'use client'

import { fotograflar } from '@/content/fotograflar'
import { yonetim as m } from '@/content/yonetim'
import type { FotoId } from '@/content/types'
import type { MenuKalemi, OzelKalem } from '@/lib/menu/tipler'
import { Alan, CiftAlani, fiyatGirdisi, type Hatalar } from './Alanlar'
import ortak from './oturum.module.css'
import stil from './KalemFormu.module.css'

const FOTO_IDLERI = Object.keys(fotograflar) as FotoId[]
const k = m.menu.kalem

type KalemProps = {
  kalem: MenuKalemi
  sira: number
  son: boolean
  hatalar: Hatalar
  /** Bu kalemin kopyasını değiştirir. */
  duz: (fn: (kalem: MenuKalemi) => void) => void
  onTasi: (yon: -1 | 1) => void
  onSil: () => void
}

function Fiyatlar({ kalem, yol, hatalar, duz }: Pick<KalemProps, 'kalem' | 'hatalar' | 'duz'> & { yol: string }) {
  return (
    <div className={stil.fiyatlar}>
      <Alan
        sayi
        etiket={k.porsiyonFiyati}
        deger={fiyatGirdisi(kalem.fiyatlar.porsiyon)}
        onDegis={(v) => duz((x) => { x.fiyatlar.porsiyon = v === '' ? 0 : Number(v) })}
        hata={hatalar.get(`${yol}.fiyatlar.porsiyon`)}
      />
      <Alan
        sayi
        etiket={k.durumFiyati}
        deger={fiyatGirdisi(kalem.fiyatlar.durum)}
        onDegis={(v) => duz((x) => {
          if (v === '') delete x.fiyatlar.durum
          else x.fiyatlar.durum = Number(v)
        })}
        hata={hatalar.get(`${yol}.fiyatlar.durum`)}
      />
    </div>
  )
}

function FotoSecimi({ kalem, duz }: Pick<KalemProps, 'kalem' | 'duz'>) {
  return (
    <label className={ortak.alan}>
      {k.foto}
      <select
        value={kalem.fotoId ?? ''}
        onChange={(o) => duz((x) => { x.fotoId = o.target.value === '' ? null : (o.target.value as FotoId) })}
      >
        <option value="">{k.fotoYok}</option>
        {FOTO_IDLERI.map((id) => <option key={id} value={id}>{fotograflar[id].etiket}</option>)}
      </select>
    </label>
  )
}

export function KalemFormu({ kalem, sira, son, hatalar, duz, onTasi, onSil }: KalemProps) {
  const yol = `kalemler[${sira}]`
  const ciger = kalem.id === 'ciger'
  return (
    <fieldset className={stil.kalem}>
      <legend className={stil.baslik}>{kalem.ad.tr || kalem.id}</legend>
      <CiftAlani etiket={k.ad} deger={kalem.ad} yol={`${yol}.ad`} hatalar={hatalar}
        onDegis={(c) => c && duz((x) => { x.ad = c })} />
      <CiftAlani uzun bosOlur etiket={k.aciklama} deger={kalem.aciklama} yol={`${yol}.aciklama`}
        hatalar={hatalar} onDegis={(c) => duz((x) => { x.aciklama = c })} />
      <Fiyatlar kalem={kalem} yol={yol} hatalar={hatalar} duz={duz} />
      <CiftAlani bosOlur etiket={k.porsiyonNotu} deger={kalem.porsiyonNotu} yol={`${yol}.porsiyonNotu`}
        hatalar={hatalar} onDegis={(c) => duz((x) => { x.porsiyonNotu = c })} />
      <CiftAlani bosOlur etiket={k.durumNotu} deger={kalem.durumNotu} yol={`${yol}.durumNotu`}
        hatalar={hatalar} onDegis={(c) => duz((x) => { x.durumNotu = c })} />
      <FotoSecimi kalem={kalem} duz={duz} />
      {ciger ? (
        <p className={ortak.not}>{k.ciger}</p>
      ) : (
        <div className={ortak.dugmeler}>
          <button type="button" className={ortak.ikincil} disabled={sira <= 1} onClick={() => onTasi(-1)}>
            {k.yukari}
          </button>
          <button type="button" className={ortak.ikincil} disabled={son} onClick={() => onTasi(1)}>
            {k.asagi}
          </button>
          <button type="button" className={ortak.ikincil} onClick={onSil}>{k.sil}</button>
        </div>
      )}
    </fieldset>
  )
}

type OzelProps = { ozel: OzelKalem; hatalar: Hatalar; duz: (fn: (ozel: OzelKalem) => void) => void }

/** Bozo Special: tek kalem, silinmez ve taşınmaz. */
export function OzelFormu({ ozel, hatalar, duz }: OzelProps) {
  const o = m.menu.ozel
  return (
    <fieldset className={stil.kalem}>
      <legend className={stil.baslik}>{ozel.ad.tr || 'Bozo Special'}</legend>
      <CiftAlani etiket={o.ad} deger={ozel.ad} yol="ozel.ad" hatalar={hatalar}
        onDegis={(c) => c && duz((x) => { x.ad = c })} />
      <CiftAlani etiket={o.miktarNotu} deger={ozel.miktarNotu} yol="ozel.miktarNotu" hatalar={hatalar}
        onDegis={(c) => c && duz((x) => { x.miktarNotu = c })} />
      <CiftAlani uzun etiket={o.aciklama} deger={ozel.aciklama} yol="ozel.aciklama" hatalar={hatalar}
        onDegis={(c) => c && duz((x) => { x.aciklama = c })} />
      <div className={stil.fiyatlar}>
        <Alan sayi etiket={o.fiyat} deger={fiyatGirdisi(ozel.fiyat)} hata={hatalar.get('ozel.fiyat')}
          onDegis={(v) => duz((x) => { x.fiyat = v === '' ? 0 : Number(v) })} />
      </div>
    </fieldset>
  )
}
