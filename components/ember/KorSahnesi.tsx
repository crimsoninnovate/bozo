'use client'

import { useEffect, useRef } from 'react'
import { hareketAzaltilmisMi } from '@/lib/hareket'
import { cerceveyeAboneOl } from '@/lib/cerceve'
import stil from './KorSahnesi.module.css'

/**
 * Tasarımda iki sahne var, biri ötekinin ayarlanmış hali değil.
 *
 * `ana`: Ana Sayfa Alternatif.dc.html:28-35. Parlak (kor .78, çekirdek .42),
 *   üç duman pufu, kaydırmaya bağlı yoğunluk takibi.
 * `ic`:  Menu / Hikaye / Konum Sayfasi.dc.html:27-33, üçünde birebir aynı.
 *   Sönük (kor .55, çekirdek .26), iki puf, sabit; takip yok.
 *
 * Ayrım okunurluk için gerekli, kozmetik değil: iç sayfalarda gövde metni
 * sahnenin üstünde okunuyor ve ana sayfanın sahnesi oraya basıldığında krem .78
 * metnin kontrastı 4.34:1'e düşüp AA'yı geçmiyor (ölçüm: task-14-report.md).
 * Tasarımın kendi çözümü metni açmak değil, sahneyi kısmak.
 */
export type SahneVaryanti = 'ana' | 'ic'

type Props = {
  varyant: SahneVaryanti
}

export function KorSahnesi({ varyant }: Props) {
  const korRef = useRef<HTMLSpanElement>(null)
  const cekirdekRef = useRef<HTMLSpanElement>(null)
  const anaMi = varyant === 'ana'

  useEffect(() => {
    // Yoğunluk takibi bölümlerin `data-yogunluk` değerini okur; o değeri yalnız
    // ana sayfa taşır (diğer üç tasarım dosyasında `data-yogunluk` hiç geçmiyor).
    if (!anaMi) return
    const kor = korRef.current
    const cekirdek = cekirdekRef.current
    if (!kor || !cekirdek) return

    return cerceveyeAboneOl(({ yogunluk }) => {
      // Kararma (opacity) prefers-reduced-motion'ın hedeflediği türden bir
      // hareket değildir, izlemeye devam eder.
      kor.style.opacity = String(Math.min(1, 0.3 + yogunluk * 0.7))
      cekirdek.style.opacity = String(Math.min(1, 0.24 + yogunluk * 0.6))
      // Ölçek (scale) kaydırmayla değişen bir dönüşümdür; bu tam olarak
      // prefers-reduced-motion'ın önlemek istediği şeydir, hele ki global
      // geçişler kapalıyken her karede aniden zıplayarak. Hareket
      // azaltılmışsa izlemeyi bırakır ve nötr yoğunlukta (1) sabit kalır.
      // Bunu geri "düzeltmeyin": kasıtlı bir erişilebilirlik kararı.
      const olcekYogunlugu = hareketAzaltilmisMi() ? 1 : yogunluk
      kor.style.transform = `scale(${0.9 + olcekYogunlugu * 0.16})`
    })
  }, [anaMi])

  return (
    <div className={`${stil.kap} ${anaMi ? stil.ana : stil.ic}`} aria-hidden="true">
      <span ref={korRef} className={stil.kor} />
      <span ref={cekirdekRef} className={stil.cekirdek} />
      {anaMi ? (
        <>
          <span className={`${stil.duman} ${stil.duman1}`} />
          <span className={`${stil.duman} ${stil.duman2}`} />
          <span className={`${stil.duman} ${stil.duman3}`} />
        </>
      ) : (
        <>
          <span className={`${stil.duman} ${stil.icDuman1}`} />
          <span className={`${stil.duman} ${stil.icDuman2}`} />
        </>
      )}
      <span className={stil.vinyet} />
      <span className={stil.izgara} />
    </div>
  )
}
