// Kendi 'use client' bildirimi yok: yalnız UstBar (client) tarafından render edilir.
import { useGirneSaati } from '@/components/saat/useGirneSaati'
import { sozluk, type Dil } from '@/content'
import stil from './GeceSeridi.module.css'

type Props = { dil: Dil }

/**
 * 01:00 - 05:00 arası görünen kırmızı gece şeridi. Sunucuda ve ilk istemci
 * render'ında `useGirneSaati` null döner (hydration güvenliği); gerçek gece
 * durumu yalnız mount sonrası gelir, o ana kadar şerit hiç basılmaz.
 */
export function GeceSeridi({ dil }: Props) {
  const durum = useGirneSaati()
  if (!durum?.gece) return null

  const s = sozluk(dil)
  return (
    // data-gece-serit: çapa payı şerit görünürken büyür (Kabuk.module.css).
    <div className={stil.serit} data-gece-serit>
      <span className={stil.nokta} aria-hidden="true" />
      <span className={stil.metin}>{s.ortak.durum.geceSerit}</span>
    </div>
  )
}
