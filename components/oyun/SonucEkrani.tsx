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
import { OcakSonerIsareti } from './Semboller'
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

const SAYMA_MS = 900
const GECIS = { duration: 0.3, ease: 'easeOut' as const }

/** Puan sayarak artar (spec §12); azaltılmış harekette son değer doğrudan. */
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

/** Gecenin bitiş satırı: 05:00 ise ana sayfanın "son tane" satırı, değilse saat ve "üç sofra kalktı". */
function bitisSatiri(s: Sozluk, sonuc: Sonuc): { metin: string; geceTamam: boolean } {
  const sonTane = s.ana.hero.kilometreTaslari.find((k) => k.saat === oyunSaati(TUR_TIK))
  if (sonuc.bitti === 'gece' && sonTane) return { metin: `${sonTane.saat} · ${sonTane.metin}`, geceTamam: true }
  return { metin: `${oyunSaati(sonuc.tik)} · ${s.oyun.ucSofraKalkti}`, geceTamam: false }
}

/** Kişisel en iyiye kalan fark (spec §11); ilk turda satır yok. */
function enIyiSatiri(s: Sozluk, puan: number, onceki: number | null, yeni: boolean, sayi: (n: number) => string) {
  if (yeni) return s.oyun.yeniEnIyi
  if (onceki === null) return null
  return `${s.oyun.enIyi} ${sayi(onceki)}, ${sayi(onceki - puan)} ${s.oyun.kaldi}`
}

/** Özet satırları (spec §11): sofra, şiş, tam kıvam, en uzun kombo; sırayla belirir. */
function OzetListesi({ s, sonuc, sayi }: { s: Sozluk; sonuc: Sonuc; sayi: (n: number) => string }) {
  const satirlar = [
    [sonuc.ozet.sofra, s.oyun.ozet.sofra],
    [sonuc.ozet.sis, s.oyun.ozet.sis],
    [sonuc.ozet.tamKivam, s.oyun.ozet.tamKivam],
    [sonuc.ozet.enUzunKombo, s.oyun.ozet.enUzunKombo],
  ] as const
  return (
    <ul className={stil.ozet}>
      {satirlar.map(([deger, etiket], i) => (
        <m.li
          key={etiket}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...GECIS, delay: 0.45 + i * 0.08 }}
        >
          <span className={stil.deger}>{sayi(deger)}</span> {etiket}
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
  const sayi = (n: number) => n.toLocaleString(dil === 'en' ? 'en-GB' : 'tr-TR')
  const satir = bitisSatiri(s, sonuc)
  const enIyi = enIyiSatiri(s, sonuc.puan, onceki, yeni, sayi)

  // Odak puana gider: ekran okuyucu düğmeyi değil sonucu duyar. Sayım görsel, gizli metin son değer.
  useEffect(() => puanRef.current?.focus(), [])

  return (
    <section className={stil.sonuc}>
      <img className={stil.rozet} src={ROZET} alt="" width={1748} height={1999} decoding="async" />
      <m.p className={stil.satir} {...MUHUR}>
        {satir.geceTamam && <OcakSonerIsareti boy={18} />}
        {satir.metin}
      </m.p>
      <h2 ref={puanRef} tabIndex={-1} className={stil.puan}>
        <span className={stil.gizli}>
          {s.oyun.puan}: {sayi(sonuc.puan)}
        </span>
        <span aria-hidden="true">{sayi(sayilan)}</span>
      </h2>
      <OzetListesi s={s} sonuc={sonuc} sayi={sayi} />
      {enIyi && <p className={stil.enIyi}>{enIyi}</p>}
      <SiraSatiri s={s} gonderim={gonderim} sayi={sayi} />
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
