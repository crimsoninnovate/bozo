'use client'

import { useId } from 'react'
import { yonetim as m } from '@/content/yonetim'
import { SEO_ONEKI, varsayilanMetinler } from '@/lib/menu/metinler'
import { acilisSpotu } from '@/lib/menu/sayilar'
import type { MenuBelgesi } from '@/lib/menu/tipler'
import { saatleriDoldur } from '@/lib/saatMetni'
import { SITE_URL, yol as rotaYolu, type RotaAnahtari } from '@/lib/site'
import type { Hatalar } from './Alanlar'
import type { Duzenle } from './MenuYonetimi'
import { MetinAlani } from './MetinFormu'
import ortak from './oturum.module.css'
import stil from './SeoFormu.module.css'

/* SEO ve AEO sekmesi: sayfa başlık ve açıklamaları (`ortak.sayfaMeta`), sonuç önizlemesiyle. */

const s = m.menu.seo
/** Google'ın sonuçta keserek gösterdiği yaklaşık uzunluklar; sınır değil, sayaç. */
const ONERILEN = { baslik: 60, aciklama: 160 } as const
const SAYFALAR = Object.keys(s.sayfalar) as RotaAnahtari[]

type Props = { belge: MenuBelgesi; hatalar: Hatalar; duzenle: Duzenle }

/** Derlemedeki gibi: önce saatler, sonra menü sayıları dolar. */
function doldurulmus(belge: MenuBelgesi, dil: 'tr' | 'en', yol: string): string {
  const metin = belge.metinler[dil][yol] ?? varsayilanMetinler(dil).get(yol) ?? ''
  return acilisSpotu(saatleriDoldur(metin, belge.saatler), belge, dil)
}

export function SeoFormu({ belge, hatalar, duzenle }: Props) {
  const baslik = useId()
  return (
    <div role="group" aria-labelledby={baslik} className={stil.seo}>
      <h2 id={baslik} className={stil.baslik}>{s.baslik}</h2>
      <p className={ortak.not}>{s.not}</p>
      {SAYFALAR.map((sayfa) => (
        <SayfaSeo key={sayfa} sayfa={sayfa} belge={belge} hatalar={hatalar} duzenle={duzenle} />
      ))}
      <section className={stil.kontrol} aria-labelledby={`${baslik}-k`}>
        <h3 id={`${baslik}-k`} className={stil.altBaslik}>{s.kontrol}</h3>
        <ul className={stil.dosyalar}>
          {s.dosyalar.map((d) => (
            <li key={d.yol}>
              <a href={`${SITE_URL}${d.yol}`} target="_blank" rel="noopener noreferrer">{d.ad}</a>
              {`: ${d.aciklama}`}
            </li>
          ))}
        </ul>
        <p className={ortak.not}>{s.otomatik}</p>
      </section>
    </div>
  )
}

function SayfaSeo({ sayfa, belge, hatalar, duzenle }: Props & { sayfa: RotaAnahtari }) {
  const baslikKimlik = useId()
  const yollar = { baslik: `${SEO_ONEKI}${sayfa}.baslik`, aciklama: `${SEO_ONEKI}${sayfa}.aciklama` }
  return (
    <section className={stil.sayfa} aria-labelledby={baslikKimlik}>
      <h3 id={baslikKimlik} className={stil.altBaslik}>{s.sayfalar[sayfa]}</h3>
      {(['baslik', 'aciklama'] as const).map((alan) => (
        <MetinAlani key={alan} yol={yollar[alan]} etiket={s.alanlar[alan]} enFazla={ONERILEN[alan]}
          belge={belge} hatalar={hatalar} duzenle={duzenle} />
      ))}
      <div className={stil.onizlemeler}>
        {(['tr', 'en'] as const).map((dil) => (
          <figure key={dil} className={stil.onizleme}>
            <figcaption className={ortak.not}>{`${s.onizleme} (${m.menu.dilKisa[dil]})`}</figcaption>
            <p className={stil.adres}>{`${SITE_URL.replace('https://', '')}${rotaYolu(sayfa, dil)}`}</p>
            <p className={stil.sonucBaslik}>{doldurulmus(belge, dil, yollar.baslik)}</p>
            <p className={stil.sonucMetin}>{doldurulmus(belge, dil, yollar.aciklama)}</p>
          </figure>
        ))}
      </div>
    </section>
  )
}
