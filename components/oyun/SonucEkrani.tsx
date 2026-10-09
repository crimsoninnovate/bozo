import { useEffect, useRef, useState } from 'react'
import { m } from 'motion/react'
import { ROZET } from '@/components/ui/Rozet'
import { sozluk, type Sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { useHareketAzaltilmisMi } from '@/lib/hareket'
import { TUR_TIK } from '@/lib/oyun/ayar'
import { oyunSaati } from '@/lib/oyun/gosterim'
import type { Sonuc } from '@/lib/oyun/tipler'
import { yol } from '@/lib/site'
import { KalktiIsareti, OcakSonerIsareti } from './Semboller'
import { GonderimDurumu, SiraSatiri } from './SonucGonderim'
import type { Gonderim } from './useOyunAkisi'
import stil from './SonucEkrani.module.css'

type Props = {
  dil: Dil
  sonuc: Sonuc
  onceki: number | null
  yeni: boolean
  tekrar: () => void
  gonderim: Gonderim
  katil: () => void
  tekrarDene: () => void
}

const SAYMA_MS = 1200
const GECIS = { duration: 0.3, ease: 'easeOut' as const }

/** Puan sayarak artar, 1,2 sn (hareket notu); azaltılmış harekette son değer doğrudan. */
function useSayac(hedef: number, azalt: boolean): number {
  const [deger, setDeger] = useState(azalt ? hedef : 0)
  useEffect(() => {
    if (azalt) {
      setDeger(hedef)
      return
    }
    const baslangic = performance.now()
    let kare = 0
    const adim = (simdi: number) => {
      const oran = Math.min(1, (simdi - baslangic) / SAYMA_MS)
      setDeger(Math.round(hedef * (1 - (1 - oran) ** 3)))
      if (oran < 1) kare = requestAnimationFrame(adim)
    }
    kare = requestAnimationFrame(adim)
    // Arka plandaki sekmede rAF durur; zamanlayıcı son değeri garanti eder.
    const emniyet = window.setTimeout(() => setDeger(hedef), SAYMA_MS + 120)
    return () => {
      cancelAnimationFrame(kare)
      clearTimeout(emniyet)
    }
  }, [hedef, azalt])
  return deger
}

/** Gecenin bitiş satırı: 05:00 ise ana sayfanın "son tane" satırı, değilse saat ve "üç misafir kalktı". */
function bitisSatiri(s: Sozluk, sonuc: Sonuc): { metin: string; geceTamam: boolean } {
  const sonTane = s.ana.hero.kilometreTaslari.find((k) => k.saat === oyunSaati(TUR_TIK))
  if (sonuc.bitti === 'gece' && sonTane) return { metin: `${sonTane.saat} · ${sonTane.metin}`, geceTamam: true }
  return { metin: `${oyunSaati(sonuc.tik)} · ${s.oyun.ucMisafirKalkti}`, geceTamam: false }
}

type Sayi = (n: number) => string

/** Kişisel en iyi (spec §11, handoff 1c): "Yeni en iyi" rozeti ya da kalan fark; ilk turda satır yok. */
function EnIyi({ s, puan, onceki, yeni, sayi }: { s: Sozluk; puan: number; onceki: number | null; yeni: boolean; sayi: Sayi }) {
  if (yeni) return <span className={stil.rozetYeni}>{s.oyun.yeniEnIyi}</span>
  if (onceki === null) return null
  return (
    <p className={stil.karsilastirma}>
      {s.oyun.enIyi} <strong>{sayi(onceki)}</strong>, <strong>{sayi(onceki - puan)}</strong> {s.oyun.kaldi}
    </p>
  )
}

/** Özet (spec §11): misafir, şiş, tam kıvam, en uzun kombo, bahşiş; beş sütun, 100 ms arayla belirir. */
function OzetListesi({ s, sonuc, sayi }: { s: Sozluk; sonuc: Sonuc; sayi: Sayi }) {
  const satirlar = [
    [sayi(sonuc.ozet.misafir), s.oyun.ozet.misafir],
    [sayi(sonuc.ozet.sis), s.oyun.ozet.sis],
    [sayi(sonuc.ozet.tamKivam), s.oyun.ozet.tamKivam],
    [`×${sonuc.ozet.enUzunKombo}`, s.oyun.ozet.enUzunKombo],
    [sayi(sonuc.ozet.bahsis), s.oyun.ozet.bahsis],
  ] as const
  return (
    <ul className={stil.ozet}>
      {satirlar.map(([deger, etiket], i) => (
        <m.li
          key={etiket}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...GECIS, delay: 0.45 + i * 0.1 }}
        >
          <span className={stil.deger}>{deger}</span>
          <span className={stil.etiket}>{etiket}</span>
        </m.li>
      ))}
    </ul>
  )
}

/** Saat mühürlenir: satır büyükten yerine oturur; azaltılmışta Motion ölçeği keser, opaklık kalır. */
const MUHUR = { initial: { opacity: 0, scale: 1.3 }, animate: { opacity: 1, scale: 1 }, transition: GECIS }

export function SonucEkrani({ dil, sonuc, onceki, yeni, tekrar, gonderim, katil, tekrarDene }: Props) {
  const s = sozluk(dil)
  const azalt = useHareketAzaltilmisMi()
  const sayilan = useSayac(sonuc.puan, azalt)
  const puanRef = useRef<HTMLHeadingElement>(null)
  const sayi: Sayi = (n) => n.toLocaleString(dil === 'en' ? 'en-GB' : 'tr-TR')
  const satir = bitisSatiri(s, sonuc)

  // Odak puana gider: ekran okuyucu düğmeyi değil sonucu duyar. Sayım görsel, gizli metin son değer.
  useEffect(() => puanRef.current?.focus(), [])

  return (
    <section className={stil.sonuc}>
      <img className={stil.rozet} src={ROZET} alt="" width={1748} height={1999} decoding="async" />
      <m.p className={stil.satir} {...MUHUR}>
        {satir.geceTamam ? <OcakSonerIsareti boy={24} /> : <KalktiIsareti boy={24} />}
        {satir.metin}
      </m.p>
      <h2 ref={puanRef} tabIndex={-1} className={stil.puan}>
        <span className={stil.gizli}>
          {s.oyun.puan}: {sayi(sonuc.puan)}
        </span>
        <span aria-hidden="true">{sayi(sayilan)}</span>
      </h2>
      <span className={stil.puanEtiketi} aria-hidden="true">
        {s.oyun.puan}
      </span>
      <OzetListesi s={s} sonuc={sonuc} sayi={sayi} />
      <div className={stil.satirlar}>
        {gonderim.durum === 'cevrimdisi' && <p className={stil.cevrimdisi}>{s.oyun.gonderim.cevrimdisi}</p>}
        <EnIyi s={s} puan={sonuc.puan} onceki={onceki} yeni={yeni} sayi={sayi} />
        <SiraSatiri s={s} gonderim={gonderim} sayi={sayi} />
      </div>
      <button type="button" className={stil.tekrar} onClick={tekrar}>
        {s.oyun.tekrar}
      </button>
      <GonderimDurumu
        s={s}
        gonderim={gonderim}
        sayi={sayi}
        katil={katil}
        tekrarDene={tekrarDene}
        siralamaYolu={yol('siralama', dil)}
      />
    </section>
  )
}
