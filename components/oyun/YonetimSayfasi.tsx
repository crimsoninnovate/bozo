'use client'

import { useEffect, useState, type SubmitEvent } from 'react'
import { yonetim as m } from '@/content/yonetim'
import type { YonetimTaramaYaniti } from '@/lib/masa'
import { doldur } from '@/lib/metin'
import type { YonetimSiralamaYaniti } from '@/lib/oyun/aktarim'
import type { YonetimApi } from '@/lib/oyun/api'
import { tarihMetni } from '@/lib/oyun/tarih'
import { oncekiDonem, turuDogrula } from '@/lib/oyun/yonetim'
import { Giris, hataIsle, useOturum } from '@/components/yonetim/oturum'
import stil from './YonetimSayfasi.module.css'

/* Personel ekranı (spec §7, §9): ödül kodu onayı, haftanın ilk 20'si, ad gizleme, turun yeniden oynatılması,
   masa plakası okumaları. */

const sayi = (n: number) => n.toLocaleString('tr-TR')

type Panel = { api: YonetimApi; cik: () => void }

function KodFormu({ api, cik }: Panel) {
  const [sonuc, setSonuc] = useState<{ metin: string; hata: boolean } | null>(null)
  const gonder = async (olay: SubmitEvent<HTMLFormElement>) => {
    olay.preventDefault()
    const kod = String(new FormData(olay.currentTarget).get('kod')).trim()
    try {
      const k = await api.kod(kod)
      setSonuc({ metin: doldur(m.kod.tamam, { sira: k.sira, ad: k.takmaAd, puan: sayi(k.puan), donem: k.donem }), hata: false })
    } catch (h) {
      setSonuc({ metin: hataIsle(h, cik), hata: true })
    }
  }
  return (
    <section className={stil.bolum} aria-labelledby="kod-baslik">
      <h2 id="kod-baslik" className={stil.altBaslik}>{m.kod.baslik}</h2>
      <form className={stil.form} onSubmit={gonder}>
        <label className={stil.alan}>
          {m.kod.etiket}
          <input name="kod" inputMode="numeric" pattern="\d{6}" maxLength={6} autoComplete="off" required />
        </label>
        <button type="submit" className={stil.ana}>{m.kod.dugme}</button>
        <p className={stil.not}>{m.kod.not}</p>
        {sonuc && <p className={sonuc.hata ? stil.hata : stil.tamam} role="alert">{sonuc.metin}</p>}
      </form>
    </section>
  )
}

function Kazananlar({ veri }: { veri: YonetimSiralamaYaniti }) {
  return (
    <>
      <h3 className={stil.altBaslik}>{m.kazananlar.baslik}</h3>
      {veri.kazananlar.length === 0 ? (
        <p className={stil.not}>{m.kazananlar.bos}</p>
      ) : (
        <ol className={stil.liste}>
          {veri.kazananlar.map((k) => (
            <li key={k.sira} className={stil.satir}>
              <span className={stil.sira}>{k.sira}</span>
              <span>{k.takmaAd}</span>
              <span className={stil.puan}>{sayi(k.puan)}</span>
              <span className={stil.not}>
                {k.kullanildi ? m.kazananlar.teslim : doldur(m.kazananlar.bekliyor, { tarih: k.gecerlilik ? tarihMetni(k.gecerlilik, 'tr') : '' })}
              </span>
            </li>
          ))}
        </ol>
      )}
    </>
  )
}

function Hafta({ api, cik }: Panel) {
  const [donem, setDonem] = useState<string | undefined>(undefined)
  const [veri, setVeri] = useState<YonetimSiralamaYaniti | null>(null)
  const [notlar, setNotlar] = useState<Record<number, string>>({})
  const [hata, setHata] = useState<string | null>(null)
  const [surum, setSurum] = useState(0)

  useEffect(() => {
    api.siralama(donem).then(
      (v) => {
        setVeri(v)
        setHata(null)
      },
      (h: unknown) => setHata(hataIsle(h, cik)),
    )
  }, [api, cik, donem, surum])

  const yap = async (is: () => Promise<void>) => {
    try {
      await is()
    } catch (h) {
      setHata(hataIsle(h, cik))
    }
  }
  const gizle = (oyuncuId: number, gizli: boolean) =>
    yap(async () => {
      await api.gizle(oyuncuId, gizli)
      setSurum((s) => s + 1)
    })
  const dogrula = (turId: number) =>
    yap(async () => {
      const d = turuDogrula(await api.tur(turId))
      const metin = d.durum === 'kayitYok' ? m.hafta.kayitYok : doldur(m.hafta[d.durum], { puan: sayi(d.puan) })
      setNotlar((n) => ({ ...n, [turId]: metin }))
    })

  return (
    <section className={stil.bolum} aria-labelledby="hafta-baslik">
      <h2 id="hafta-baslik" className={stil.altBaslik}>{veri ? doldur(m.hafta.baslik, { donem: veri.donem }) : ''}</h2>
      <div className={stil.dugmeler}>
        <button type="button" onClick={() => setDonem(undefined)}>{m.hafta.bu}</button>
        <button type="button" onClick={() => veri && setDonem(oncekiDonem(veri.donem))}>{m.hafta.gecen}</button>
      </div>
      {hata && <p className={stil.hata} role="alert">{hata}</p>}
      {veri && veri.satirlar.length === 0 && <p className={stil.not}>{m.hafta.bos}</p>}
      <ol className={stil.liste}>
        {veri?.satirlar.map((s, i) => (
          <li key={s.turId} className={stil.satir}>
            <span className={stil.sira}>{i + 1}</span>
            <span>
              {s.takmaAd}
              {s.gizli && <em className={stil.etiket}>{m.hafta.gizli}</em>}
              {s.supheli && <em className={stil.etiket}>{m.hafta.supheli}</em>}
            </span>
            <span className={stil.puan}>{sayi(s.puan)}</span>
            <span className={stil.dugmeler}>
              <button type="button" onClick={() => gizle(s.oyuncuId, !s.gizli)}>
                {s.gizli ? m.hafta.goster : m.hafta.gizle}
              </button>
              <button type="button" onClick={() => dogrula(s.turId)}>{m.hafta.dogrula}</button>
            </span>
            {notlar[s.turId] && <span className={stil.satirNotu}>{notlar[s.turId]}</span>}
          </li>
        ))}
      </ol>
      {veri && <Kazananlar veri={veri} />}
    </section>
  )
}

const SUTUNLAR = ['bugun', 'hafta', 'toplam'] as const

function Taramalar({ api, cik }: Panel) {
  const [veri, setVeri] = useState<YonetimTaramaYaniti | null>(null)
  const [hata, setHata] = useState<string | null>(null)
  const [surum, setSurum] = useState(0)
  useEffect(() => {
    api.tarama().then(
      (v) => {
        setVeri(v)
        setHata(null)
      },
      (h: unknown) => setHata(hataIsle(h, cik)),
    )
  }, [api, cik, surum])
  const topla = (k: (typeof SUTUNLAR)[number]) => veri?.satirlar.reduce((t, s) => t + s[k], 0) ?? 0
  return (
    <section className={stil.bolum} aria-labelledby="tarama-baslik">
      <h2 id="tarama-baslik" className={stil.altBaslik}>{m.tarama.baslik}</h2>
      <p className={stil.not}>{m.tarama.not}</p>
      <div className={stil.dugmeler}>
        <button type="button" onClick={() => setSurum((s) => s + 1)}>{m.tarama.yenile}</button>
      </div>
      {hata && <p className={stil.hata} role="alert">{hata}</p>}
      {veri && (
        <table className={stil.tablo}>
          <thead>
            <tr>
              <th scope="col">{m.tarama.masa}</th>
              {SUTUNLAR.map((k) => <th key={k} scope="col">{m.tarama[k]}</th>)}
            </tr>
          </thead>
          <tbody>
            {veri.satirlar.map((s) => (
              <tr key={s.masa}>
                <th scope="row" className={stil.sira}>{s.masa}</th>
                {SUTUNLAR.map((k) => <td key={k} className={stil.puan}>{sayi(s[k])}</td>)}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">{m.tarama.hepsi}</th>
              {SUTUNLAR.map((k) => <td key={k} className={stil.puan}>{sayi(topla(k))}</td>)}
            </tr>
          </tfoot>
        </table>
      )}
    </section>
  )
}

export function YonetimSayfasi() {
  const { api, gir, cik } = useOturum()
  return (
    <main className={stil.sayfa}>
      <h1 className={stil.baslik}>{m.baslik}</h1>
      {api === undefined ? null : api ? (
        <>
          <button type="button" className={stil.cikis} onClick={cik}>{m.cikis}</button>
          <KodFormu api={api} cik={cik} />
          <Hafta api={api} cik={cik} />
          <Taramalar api={api} cik={cik} />
        </>
      ) : (
        <Giris gir={gir} />
      )}
    </main>
  )
}
