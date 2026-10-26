'use client'

import { yonetim as m } from '@/content/yonetim'
import {
  ikramGrubuEkle, ikramGrubuSil, ikramGrubuTasi, ikramOgesiEkle, ikramOgesiSil, ikramOgesiTasi,
  ikramUrunuEkle, ikramUrunuSil, ikramUrunuTasi,
} from '@/lib/menu/duzenleme'
import { ikramSayisi, sayiYaz } from '@/lib/menu/sayilar'
import type { IkramGrubu, IkramUrunu, MenuBelgesi } from '@/lib/menu/tipler'
import { doldur } from '@/lib/metin'
import { CiftAlani, FotoSecimi, ListeHatasi, YeniKayit, type Hatalar } from './Alanlar'
import type { Duzenle } from './MenuYonetimi'
import ortak from './oturum.module.css'
import stil from './IkramFormu.module.css'

const k = m.menu.ikram

type Ortak = { hatalar: Hatalar; duzenle: Duzenle }

type UrunProps = Ortak & { urun: IkramUrunu; sira: number; son: boolean }

function UrunKarti({ urun, sira, son, hatalar, duzenle }: UrunProps) {
  const yol = `ikramlar.urunler[${sira}]`
  const duz = (fn: (u: IkramUrunu) => void) =>
    duzenle((b) => { const u = b.ikramlar.urunler.find((x) => x.id === urun.id); if (u) fn(u) })
  return (
    <fieldset className={stil.kart}>
      <legend className={stil.baslik}>{urun.ad.tr || urun.id}</legend>
      <CiftAlani etiket={k.ad} deger={urun.ad} yol={`${yol}.ad`} hatalar={hatalar}
        onDegis={(c) => c && duz((x) => { x.ad = c })} />
      <CiftAlani uzun etiket={k.aciklama} deger={urun.aciklama} yol={`${yol}.aciklama`} hatalar={hatalar}
        onDegis={(c) => c && duz((x) => { x.aciklama = c })} />
      <FotoSecimi etiket={k.foto} yok={k.fotoYok} deger={urun.fotoId}
        onDegis={(v) => duz((x) => { x.fotoId = v })} />
      <div className={ortak.dugmeler}>
        <TasiDugmeleri ad={urun.ad.tr || urun.id} ilk={sira === 0} son={son}
          tasi={(yon) => duzenle((b) => ikramUrunuTasi(b, urun.id, yon))} />
        <button type="button" className={ortak.ikincil}
          onClick={() => duzenle((b) => ikramUrunuSil(b, urun.id))}>{k.urunSil}</button>
      </div>
    </fieldset>
  )
}

type TasiProps = { ad: string; ilk: boolean; son: boolean; tasi: (yon: -1 | 1) => void }

/** Yukarı/aşağı düğmeleri; erişilebilir ad hangi kaydı taşıdığını söyler. */
function TasiDugmeleri({ ad, ilk, son, tasi }: TasiProps) {
  const etiket = (yon: string) => doldur(k.tasiAdli, { yon, ad })
  return (
    <>
      <button type="button" className={ortak.ikincil} disabled={ilk} aria-label={etiket(k.yukari)}
        onClick={() => tasi(-1)}>{k.yukari}</button>
      <button type="button" className={ortak.ikincil} disabled={son} aria-label={etiket(k.asagi)}
        onClick={() => tasi(1)}>{k.asagi}</button>
    </>
  )
}

type GrupProps = Ortak & { grup: IkramGrubu; sira: number; son: boolean; tek: boolean }

function GrupKarti({ grup, sira, son, tek, hatalar, duzenle }: GrupProps) {
  const yol = `ikramlar.gruplar[${sira}]`
  const duz = (fn: (g: IkramGrubu) => void) =>
    duzenle((b) => { const g = b.ikramlar.gruplar.find((x) => x.id === grup.id); if (g) fn(g) })
  return (
    <fieldset className={stil.kart}>
      <legend className={stil.baslik}>{grup.ad.tr || grup.id}</legend>
      <CiftAlani etiket={k.grupAd} deger={grup.ad} yol={`${yol}.ad`} hatalar={hatalar}
        onDegis={(c) => c && duz((x) => { x.ad = c })} />
      <CiftAlani bosOlur etiket={k.grupNot} deger={grup.not} yol={`${yol}.not`} hatalar={hatalar}
        onDegis={(c) => duz((x) => { x.not = c })} />
      <ul className={stil.ogeler} aria-label={k.ogeler}>
        {grup.ogeler.map((oge, n) => (
          <li key={oge.id} className={stil.oge}>
            <CiftAlani etiket={k.ogeAd} deger={oge.ad} yol={`${yol}.ogeler[${n}].ad`} hatalar={hatalar}
              onDegis={(c) => c && duz((x) => { const o = x.ogeler[n]; if (o) o.ad = c })} />
            <div className={ortak.dugmeler}>
              <TasiDugmeleri ad={oge.ad.tr || oge.id} ilk={n === 0} son={n === grup.ogeler.length - 1}
                tasi={(yon) => duzenle((b) => ikramOgesiTasi(b, grup.id, oge.id, yon))} />
              <button type="button" className={ortak.ikincil}
                onClick={() => duzenle((b) => ikramOgesiSil(b, grup.id, oge.id))}>{k.ogeSil}</button>
            </div>
          </li>
        ))}
      </ul>
      <ListeHatasi metin={hatalar.get(`${yol}.ogeler`)} />
      <YeniKayit etiket={k.yeniOge} dugme={k.ogeEkle}
        onEkle={(ad) => duzenle((b) => ikramOgesiEkle(b, grup.id, ad))} />
      <div className={ortak.dugmeler}>
        <TasiDugmeleri ad={grup.ad.tr || grup.id} ilk={sira === 0} son={son}
          tasi={(yon) => duzenle((b) => ikramGrubuTasi(b, grup.id, yon))} />
        <button type="button" className={ortak.ikincil} disabled={tek}
          onClick={() => duzenle((b) => ikramGrubuSil(b, grup.id))}>{k.grupSil}</button>
        {tek && <p className={ortak.not}>{k.sonGrup}</p>}
      </div>
    </fieldset>
  )
}

type Props = Ortak & { belge: MenuBelgesi }

export function IkramFormu({ belge, hatalar, duzenle }: Props) {
  const { altMetin, urunler, gruplar } = belge.ikramlar
  return (
    <div className={stil.sayfa}>
      <h2 className={stil.ana}>{doldur(k.baslik, { sayi: sayiYaz(ikramSayisi(belge), 'tr') })}</h2>
      <p className={ortak.not}>{k.not}</p>
      <CiftAlani etiket={k.altMetin} deger={altMetin} yol="ikramlar.altMetin" hatalar={hatalar}
        onDegis={(c) => c && duzenle((b) => { b.ikramlar.altMetin = c })} />
      <section className={stil.liste} aria-label={k.urunler}>
        <h3 className={stil.altBaslik}>{k.urunler}</h3>
        {urunler.map((urun, n) => (
          <UrunKarti key={urun.id} urun={urun} sira={n} son={n === urunler.length - 1}
            hatalar={hatalar} duzenle={duzenle} />
        ))}
        <ListeHatasi metin={hatalar.get('ikramlar.urunler')} />
        <YeniKayit etiket={k.yeniUrun} dugme={k.urunEkle} onEkle={(ad) => duzenle((b) => ikramUrunuEkle(b, ad))} />
      </section>
      <section className={stil.liste} aria-label={k.gruplar}>
        <h3 className={stil.altBaslik}>{k.gruplar}</h3>
        {gruplar.map((grup, n) => (
          <GrupKarti key={grup.id} grup={grup} sira={n} son={n === gruplar.length - 1} tek={gruplar.length <= 1}
            hatalar={hatalar} duzenle={duzenle} />
        ))}
        <ListeHatasi metin={hatalar.get('ikramlar.gruplar')} />
        <YeniKayit etiket={k.yeniGrup} dugme={k.grupEkle} onEkle={(ad) => duzenle((b) => ikramGrubuEkle(b, ad))} />
      </section>
    </div>
  )
}
