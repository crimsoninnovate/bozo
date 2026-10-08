import { sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { TUR_TIK } from '@/lib/oyun/ayar'
import { oyunSaati } from '@/lib/oyun/gosterim'
import type { Sonuc } from '@/lib/oyun/tipler'
import stil from './SonucEkrani.module.css'

type Props = { dil: Dil; sonuc: Sonuc; onceki: number | null; yeni: boolean; tekrar: () => void }

export function SonucEkrani({ dil, sonuc, onceki, yeni, tekrar }: Props) {
  const s = sozluk(dil)
  const sayi = (n: number) => n.toLocaleString(dil === 'en' ? 'en-GB' : 'tr-TR')
  const sonTane = s.ana.hero.kilometreTaslari.find((k) => k.saat === oyunSaati(TUR_TIK))
  const satir =
    sonuc.bitti === 'gece' && sonTane
      ? `${sonTane.saat} · ${sonTane.metin}`
      : `${oyunSaati(sonuc.tik)} · ${s.oyun.ucSofraKalkti}`
  const ozet = [
    [sonuc.ozet.sofra, s.oyun.ozet.sofra],
    [sonuc.ozet.sis, s.oyun.ozet.sis],
    [sonuc.ozet.tamKivam, s.oyun.ozet.tamKivam],
    [sonuc.ozet.enUzunKombo, s.oyun.ozet.enUzunKombo],
  ] as const
  const enIyiSatiri = yeni
    ? s.oyun.yeniEnIyi
    : onceki !== null
      ? `${s.oyun.enIyi} ${sayi(onceki)}, ${sayi(onceki - sonuc.puan)} ${s.oyun.kaldi}`
      : null

  return (
    <section className={stil.sonuc} aria-live="polite">
      <p className={stil.satir}>{satir}</p>
      <p className={stil.puan}>{sayi(sonuc.puan)}</p>
      <ul className={stil.ozet}>
        {ozet.map(([deger, etiket]) => (
          <li key={etiket}>
            <span className={stil.deger}>{sayi(deger)}</span> {etiket}
          </li>
        ))}
      </ul>
      {enIyiSatiri && <p className={stil.enIyi}>{enIyiSatiri}</p>}
      <button type="button" className={stil.tekrar} onClick={tekrar} autoFocus>
        {s.oyun.tekrar}
      </button>
    </section>
  )
}
