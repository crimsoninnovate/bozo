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
   * hayalet: gece bölümü arka planındaki dev, neredeyse görünmez saat.
   * Bkz. docs/tasarim/ana-sayfa.json > paylasilanBilesenler > CanliSaat.
   */
  boy: 'dev' | 'kucuk' | 'orta' | 'hayalet'
}

const YER_TUTUCU = '--'
// Bu iki boy saat+kolon+dakika olarak ayrık span'lara bölünür ve kolon yanıp söner;
// orta/hayalet düz metindir (bkz. Ana Sayfa Alternatif.dc.html data-saat-tam/-dev).
const AYRIK_BOYLAR = new Set(['dev', 'kucuk'])

export function CanliSaat({ boy }: Props) {
  const durum = useGirneSaati()
  const metin = durum ? saatMetni(durum) : null
  const dateTimeDeger = metin ? `${metin.saat}:${metin.dakika}` : undefined
  // hayalet dekoratif bir arka plan öğesidir, mount durumundan bağımsız her zaman gizlenir.
  const gizli = boy === 'hayalet' || metin === null

  return (
    <time
      className={`${stil.taban} ${stil[boy]}`}
      dateTime={dateTimeDeger}
      aria-hidden={gizli || undefined}
    >
      {AYRIK_BOYLAR.has(boy) ? (
        <>
          <span>{metin ? metin.saat : YER_TUTUCU}</span>
          <span className={stil.kolon}>:</span>
          <span>{metin ? metin.dakika : YER_TUTUCU}</span>
        </>
      ) : metin ? (
        `${metin.saat}:${metin.dakika}`
      ) : (
        `${YER_TUTUCU}:${YER_TUTUCU}`
      )}
    </time>
  )
}
