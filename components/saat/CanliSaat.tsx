'use client'

import { useGirneSaati } from './useGirneSaati'
import { saatMetni } from '@/lib/saat'
import stil from './CanliSaat.module.css'

type Props = {
  /**
   * dev: hero'daki ayrık saat (saat + yanıp sönen iki nokta + dakika), krem rakamlar.
   * orta: gece bölümündeki düz tangerine saat, nokta yanıp sönmez.
   * hayalet: gece bölümü arka planındaki dev, neredeyse görünmez saat.
   * Bkz. docs/tasarim/ana-sayfa.json > paylasilanBilesenler > CanliSaat (üç kanonik varyant).
   */
  boy: 'dev' | 'orta' | 'hayalet'
}

const YER_TUTUCU = '--'

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
      {boy === 'dev' ? (
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
