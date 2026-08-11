import stil from './IletisimSatiri.module.css'

/**
 * Alt satırın ne olduğu. Tasarım üç satıra aynı tipografiyi vermiyor:
 * - `deger`: işletme verisi, `400 14px/1` + tabular-nums (Konum:131). Bugün yalnız
 *   telefon satırı; numara bilinmediği için yer tutucu basar.
 * - `aciklama`: sabit açıklama cümlesi, `400 14px/1.4`, tabular YOK (Konum:138, 145).
 *   WhatsApp ve Instagram satırları. Bunlar işletme verisi değildir ve hesap
 *   bilinmese de aynen basılır.
 */
export type AltSatirTuru = 'deger' | 'aciklama'

type Props = {
  ikon: React.ReactNode
  etiket: string
  alt: string
  tur: AltSatirTuru
  href: string | null
  hariciMi?: boolean
}

/**
 * İletişim kartının satırı. Konum Sayfasi.dc.html:127-147
 *
 * Tasarım satırı `cursor:pointer` taşıyan bir `<div>` olarak çiziyor. Hedefi
 * bilinen satır gerçek `<a>` olur; hedefi bilinmeyen satır düz `<div>` kalır,
 * çünkü o bir devre dışı kontrol değil, henüz bağlantısı olmayan bir bilgidir.
 * `Buton`'un `.pasif` sönükleştirmesi burada uygulanmaz: tasarım bu satırları
 * tam opaklıkta gösteriyor ve satırın metni her durumda okunmalı.
 */
export function IletisimSatiri({ ikon, etiket, alt, tur, href, hariciMi = false }: Props) {
  const icerik = (
    <>
      {ikon}
      <span className={stil.yigin}>
        <span className={stil.etiket}>{etiket}</span>
        <span className={tur === 'deger' ? stil.deger : stil.aciklama}>{alt}</span>
      </span>
    </>
  )

  if (href === null) {
    return <div className={stil.satir}>{icerik}</div>
  }

  return (
    <a className={`${stil.satir} ${stil.baglanti}`} href={href} rel={hariciMi ? 'noopener' : undefined}>
      {icerik}
    </a>
  )
}
