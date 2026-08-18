'use client'

import { useGirneSaati } from './useGirneSaati'
import { saatMetni } from '@/lib/saat'
import stil from './CanliSaat.module.css'

type Props = {
  /**
   * dev: ana sayfa hero'sundaki ayrık saat (saat + yanıp sönen iki nokta + dakika), krem
   *   rakamlar, clamp(30px,3.4vw,44px). Tek kullanım yeri: ana sayfa.
   * kucuk: Konum ve Menü sayfası hero'larındaki, aynı ayrık yapıyı taşıyan küçük saat,
   *   clamp(24px,2.6vw,34px). "Ana Sayfa Alternatif.dc.html" dev boyutunun küçültülmüş
   *   ikizi değil; Konum ve Menü'nün KENDİ ölçüsü, iki sayfada birebir aynı (bkz.
   *   iyilestirmeler.md, Fix round 1). Yer tutucu olarak "hero-tek-kullanim" diye
   *   etiketlenen konum.json girişine güvenmeyin, iki sayfada tekrarlandığı doğrulandı.
   * orta: gece bölümündeki düz tangerine saat, nokta yanıp sönmez.
   * Bkz. docs/tasarim/ana-sayfa.json > paylasilanBilesenler > CanliSaat.
   */
  boy: 'dev' | 'kucuk' | 'orta'
}

const YER_TUTUCU = '--'
// Bu iki boy saat+kolon+dakika olarak ayrık span'lara bölünür ve kolon yanıp söner;
// orta düz metindir (bkz. Ana Sayfa Alternatif.dc.html data-saat-tam/-dev).
const AYRIK_BOYLAR = new Set(['dev', 'kucuk'])

/* Rakam hücresi görünmez bir "00" (::before) ile iki tabular rakam genişliğinde durur:
   "--" yarısı kadardı ve hidrasyonda kolonla dakika 69px (mobil 16px) sağa atlıyordu. */
function Rakam({ deger }: { deger: string }) {
  return (
    <span className={stil.rakam}>
      <span>{deger}</span>
    </span>
  )
}

export function CanliSaat({ boy }: Props) {
  const durum = useGirneSaati()
  const metin = durum ? saatMetni(durum) : null
  const dateTimeDeger = metin ? `${metin.saat}:${metin.dakika}` : undefined

  return (
    <time
      className={`${stil.taban} ${stil[boy]}`}
      dateTime={dateTimeDeger}
      aria-hidden={metin === null || undefined}
    >
      {AYRIK_BOYLAR.has(boy) ? (
        <>
          <Rakam deger={metin ? metin.saat : YER_TUTUCU} />
          <span className={stil.kolon}>:</span>
          <Rakam deger={metin ? metin.dakika : YER_TUTUCU} />
        </>
      ) : metin ? (
        `${metin.saat}:${metin.dakika}`
      ) : (
        `${YER_TUTUCU}:${YER_TUTUCU}`
      )}
    </time>
  )
}
