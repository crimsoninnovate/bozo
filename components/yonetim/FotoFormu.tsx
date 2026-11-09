'use client'

import { useEffect, useId, useRef, useState, type ChangeEvent, type MouseEvent } from 'react'
import { fotograflar } from '@/content/fotograflar'
import type { FotoId } from '@/content/types'
import { yonetim as m } from '@/content/yonetim'
import { fotoKaynagi } from '@/lib/fotoKaynagi'
import { fotoAta, fotoKaldir, fotoOdakAyarla } from '@/lib/menu/duzenleme'
import type { MenuBelgesi } from '@/lib/menu/tipler'
import { doldur } from '@/lib/metin'
import { API_KOKU, ApiHatasi, type YonetimApi } from '@/lib/oyun/api'
import { HazirlamaHatasi, odakNoktasi, webpHazirla } from '@/lib/yonetim/fotoHazirla'
import { fotoOranlari, fotoYerleri } from '@/lib/yonetim/fotoYerleri'
import { ListeHatasi, type Hatalar } from './Alanlar'
import type { Duzenle } from './MenuYonetimi'
import { hataIsle } from './oturum'
import ortak from './oturum.module.css'
import stil from './FotoFormu.module.css'

/* Fotoğraflar sekmesi (spec 2026-11-09 A): yükleme dosyayı sunucuya koyar, atama taslakta durur,
   Yayınla çıkarır. Önizleme taslak belgeden okunur: yeni kare hemen görünür. */

const f = m.menu.foto

type Durum = { tur: 'bos' } | { tur: 'calisiyor' | 'tamam' | 'hata'; metin: string }

/** Sunucunun foto kodları sekmenin kendi metnine; 401 ve geri kalanı panelin ortak yoluna. */
function yuklemeHatasi(h: unknown, cik: () => void): string {
  if (h instanceof HazirlamaHatasi) return h.message
  if (h instanceof ApiHatasi && h.durum !== 401) {
    const metin = (f.hata as Record<string, string>)[h.kod]
    if (metin) return metin
  }
  return hataIsle(h, cik)
}

type Ortak = { belge: MenuBelgesi; hatalar: Hatalar; duzenle: Duzenle; api: YonetimApi; cik: () => void }

export function FotoFormu(props: Ortak) {
  const baslik = useId()
  return (
    <div role="group" aria-labelledby={baslik} className={stil.liste}>
      <h2 id={baslik} className={stil.baslik}>{f.baslik}</h2>
      <p className={ortak.not}>{f.not} {f.galeri}</p>
      {(Object.keys(fotograflar) as FotoId[]).map((id) => <FotoSatiri key={id} id={id} {...props} />)}
    </div>
  )
}

/** Yükleme beklerken başka düzenleme olabilir: atama, o anki çalışma kopyasına yapılır. */
function useSonDuzenle(duzenle: Duzenle) {
  const ref = useRef(duzenle)
  useEffect(() => { ref.current = duzenle })
  return ref
}

function useYukleme(id: FotoId, { duzenle, api, cik }: Ortak) {
  const [durum, setDurum] = useState<Durum>({ tur: 'bos' })
  const sonDuzenle = useSonDuzenle(duzenle)
  const sec = async (olay: ChangeEvent<HTMLInputElement>) => {
    const dosya = olay.currentTarget.files?.[0]
    olay.currentTarget.value = '' // aynı dosya yeniden seçilebilsin
    if (!dosya) return
    try {
      setDurum({ tur: 'calisiyor', metin: f.hazirlaniyor })
      const webp = await webpHazirla(dosya, f.hata)
      setDurum({ tur: 'calisiyor', metin: f.yukleniyor })
      const yanit = await api.fotoYukle(webp)
      sonDuzenle.current((b) => fotoAta(b, id, { dosya: yanit.dosya, odak: null }))
      setDurum({ tur: 'tamam', metin: f.yuklendi })
    } catch (h) {
      setDurum({ tur: 'hata', metin: yuklemeHatasi(h, cik) })
    }
  }
  return { durum, setDurum, sec }
}

function FotoSatiri(props: Ortak & { id: FotoId }) {
  const { id, belge, hatalar, duzenle } = props
  const { durum, setDurum, sec } = useYukleme(id, props)
  const [odakAcik, setOdakAcik] = useState(false)
  const baslik = useId()
  const odakAlani = useId()
  const atama = belge.fotograflar[id]
  const kaynak = fotoKaynagi(id, belge, API_KOKU)
  const calisiyor = durum.tur === 'calisiyor'
  const yol = `fotograflar.${id}`
  const kaldir = () => { duzenle((b) => fotoKaldir(b, id)); setDurum({ tur: 'bos' }); setOdakAcik(false) }
  return (
    <div role="group" aria-labelledby={baslik} className={stil.kart}>
      <div className={stil.ust}>
        <div className={stil.kucuk}>
          {kaynak && <img src={kaynak.src} alt="" style={{ objectPosition: kaynak.odak ?? undefined }} />}
        </div>
        <div className={stil.bilgi}>
          <h3 id={baslik} className={stil.ad}>{fotograflar[id].etiket}</h3>
          <p className={ortak.not}>{doldur(f.yer, { yer: fotoYerleri[id] })}</p>
          <p className={ortak.not}>{atama ? f.yuklu : kaynak ? f.tohum : f.bos}</p>
        </div>
      </div>
      <div className={ortak.dugmeler}>
        <label className={`${ortak.ikincil} ${stil.yukle}`} data-mesgul={calisiyor}>
          {kaynak ? f.degistir : f.yukle}
          <input type="file" accept="image/*" className={stil.gizli} disabled={calisiyor}
            aria-describedby={baslik} onChange={sec} />
        </label>
        {atama && (
          <button type="button" className={ortak.ikincil} disabled={calisiyor} aria-describedby={baslik}
            onClick={kaldir}>{f.kaldir}</button>
        )}
        {atama && (
          <button type="button" className={ortak.ikincil} aria-expanded={odakAcik} aria-controls={odakAlani}
            aria-describedby={baslik} onClick={() => setOdakAcik(!odakAcik)}>{f.odakAc}</button>
        )}
      </div>
      {durum.tur !== 'bos' && (
        <p className={durum.tur === 'hata' ? ortak.hata : ortak.not} role={durum.tur === 'hata' ? 'alert' : 'status'}>
          {durum.metin}
        </p>
      )}
      <ListeHatasi metin={hatalar.get(`${yol}.odak`) ?? hatalar.get(`${yol}.dosya`) ?? hatalar.get(yol)} />
      {atama && kaynak && odakAcik && (
        <OdakSecici kimlik={odakAlani} id={id} src={kaynak.src} odak={atama.odak}
          onSec={(odak) => duzenle((b) => fotoOdakAyarla(b, id, odak))} />
      )}
    </div>
  )
}

type OdakProps = { kimlik: string; id: FotoId; src: string; odak: string | null; onSec: (odak: string | null) => void }

/** Tam kareye dokunulan nokta `object-position` olur; altında yuvanın ilk yerleşim oranında kırpım. */
function OdakSecici({ kimlik, id, src, odak, onSec }: OdakProps) {
  const not = useId()
  const dokun = (olay: MouseEvent<HTMLButtonElement>) => {
    if (olay.detail === 0) return // klavyeyle basış konum taşımaz
    const r = olay.currentTarget.getBoundingClientRect()
    onSec(odakNoktasi(olay.clientX - r.left, olay.clientY - r.top, r.width, r.height))
  }
  const [x, y] = (odak ?? '50% 50%').split(' ')
  return (
    <div id={kimlik} className={stil.odak}>
      <p id={not} className={ortak.not}>{f.odakNot}</p>
      <button type="button" className={stil.secici} aria-label={f.odakSecici} aria-describedby={not} onClick={dokun}>
        <img src={src} alt="" />
        {odak && <span aria-hidden="true" className={stil.isaret} style={{ left: x, top: y }} />}
      </button>
      <p className={ortak.not}>{odak ? doldur(f.odak, { odak }) : f.odakYok}</p>
      {odak && (
        <div className={ortak.dugmeler}>
          <button type="button" className={ortak.ikincil} onClick={() => onSec(null)}>{f.odakOrtala}</button>
        </div>
      )}
      <p className={ortak.not}>{f.onizleme}</p>
      <div className={stil.kirpim} style={{ aspectRatio: fotoOranlari[id] }}>
        <img src={src} alt="" style={{ objectPosition: odak ?? undefined }} />
      </div>
    </div>
  )
}
