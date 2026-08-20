'use client'

import { useGirneSaati } from '@/components/saat/useGirneSaati'
import { sozluk, type Dil } from '@/content'
import { saatMetni } from '@/lib/saat'
import stil from './BarDurumu.module.css'

/**
 * Daralmış barın sağındaki canlı küme: nokta + saat + durum metni.
 * Ayrı bileşen, çünkü `useGirneSaati` dakikada bir yeniden render ediyor ve
 * bunu bütün bara yaymanın anlamı yok (SPEC.md §4, daralmış hâl).
 */
export function BarDurumu({ dil }: { dil: Dil }) {
  const durum = useGirneSaati()
  const s = sozluk(dil)
  // Sunucuda ve ilk boyada null: hydration uyuşmazlığı olmasın diye hiç basılmaz.
  if (!durum) return null

  const { saat, dakika } = saatMetni(durum)
  // Kapalı metninin uzunu bara sığmaz; sözlüğün kendi kısa biçimi kullanılır.
  const metin = durum.acik ? s.ortak.durum.acik : s.ortak.durum.kapaliKisa

  return (
    <span className={`${stil.kume} ${durum.acik ? stil.acik : stil.kapali}`}>
      <span className={stil.nokta} aria-hidden="true" />
      <time className={stil.saat} dateTime={`${saat}:${dakika}`}>
        {saat}:{dakika}
      </time>
      <span className={stil.ayirici} aria-hidden="true">
        ·
      </span>
      <span className={stil.metin}>{metin}</span>
    </span>
  )
}
