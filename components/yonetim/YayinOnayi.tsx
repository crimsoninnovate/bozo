'use client'

import { useEffect, useRef } from 'react'
import { yonetim as m } from '@/content/yonetim'
import type { Sorun } from '@/lib/menu/dogrulama'
import type { Degisiklik } from '@/lib/menu/fark'
import { telefonAciliyor } from '@/lib/menu/panel'
import type { MenuBelgesi } from '@/lib/menu/tipler'
import { doldur } from '@/lib/metin'
import { AltBar } from './YayinBari'
import ortak from './oturum.module.css'
import stil from './YayinOnayi.module.css'

const o = m.menu.onay

type Props = {
  baslik: string
  fark: Degisiklik[]
  not?: string
  uyarilar: Sorun[]
  belge: MenuBelgesi
  /** Yayınlanacak duyuru açık ama şu an görünmeyecek (`duyuruGorunmeyecek`). */
  duyuruGorunmez: boolean
  onayEtiketi: string
  mesgul: boolean
  onayla: () => void
  vazgec: () => void
}

/** "kalemler[2].ad.tr" gibi bir yolu kaydın adına çevirir; çözemezse yolu olduğu gibi verir. */
function yolAdi(belge: MenuBelgesi, yol: string): string {
  const eslesme = /^(kalemler|icecekler)\[(\d+)\]/.exec(yol)
  const ad = eslesme
    ? belge[eslesme[1] as 'kalemler' | 'icecekler'][Number(eslesme[2])]?.ad.tr
    : yol.startsWith('ozel') ? belge.ozel.ad.tr : undefined
  return ad ?? yol
}

export function YayinOnayi(
  { baslik, fark, not, uyarilar, belge, duyuruGorunmez, onayEtiketi, mesgul, onayla, vazgec }: Props,
) {
  const baslikRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => baslikRef.current?.focus(), [])
  return (
    <section className={stil.onay} aria-labelledby="onay-baslik">
      <h2 id="onay-baslik" ref={baslikRef} tabIndex={-1} className={stil.baslik}>{baslik}</h2>
      {not && <p className={ortak.not}>{not}</p>}
      {duyuruGorunmez && <p className={stil.sicrama}><strong className={stil.uyari}>{o.duyuruGorunmez}</strong></p>}
      <h3 className={stil.altBaslik}>{o.fark}</h3>
      {fark.length === 0 && <p className={ortak.not}>{o.farksiz}</p>}
      <ul className={stil.liste}>
        {fark.map((d) => (
          <li key={d.yol} className={d.buyukSicrama || telefonAciliyor(d) ? stil.sicrama : stil.satir}>
            {doldur(o.satir, { etiket: d.etiket, once: d.once, sonra: d.sonra })}
            {d.buyukSicrama && <strong className={stil.uyari}>{o.sicrama}</strong>}
            {telefonAciliyor(d) && <strong className={stil.uyari}>{m.menu.iletisim.telefonVurgu}</strong>}
          </li>
        ))}
      </ul>
      {uyarilar.length > 0 && (
        <>
          <h3 className={stil.altBaslik}>{o.uyarilar}</h3>
          <ul className={stil.liste}>
            {uyarilar.map((u) => (
              <li key={`${u.yol}.${u.kod}`} className={stil.satir}>{yolAdi(belge, u.yol)}: {u.metin}</li>
            ))}
          </ul>
        </>
      )}
      {/* Fark uzun olsa da iki düğme kaydırmadan erişilir: Yayınla'nın sabit yerinde. */}
      <AltBar>
        <button type="button" className={`${ortak.ikincil} ${stil.vazgec}`} disabled={mesgul} onClick={vazgec}>
          {o.vazgec}
        </button>
        <button type="button" className={`${ortak.ana} ${stil.onayla}`} disabled={mesgul} onClick={onayla}>
          {onayEtiketi}
        </button>
      </AltBar>
    </section>
  )
}
