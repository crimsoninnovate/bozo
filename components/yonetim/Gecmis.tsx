'use client'

import { yonetim as m } from '@/content/yonetim'
import type { SurumOzeti } from '@/lib/menu/aktarim'
import { doldur } from '@/lib/metin'
import { ZAMAN_DILIMI } from '@/lib/saat'
import ortak from './oturum.module.css'
import stil from './Gecmis.module.css'

const g = m.menu.gecmis

const bicim = new Intl.DateTimeFormat('tr-TR', {
  timeZone: ZAMAN_DILIMI, day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
})

export const surumTarihi = (iso: string): string => bicim.format(new Date(iso))

type Props = {
  surumler: SurumOzeti[]
  /** Şu an yayındaki sürümün kimliği. */
  yayindaki: number | null
  onDon: (surum: SurumOzeti) => void
}

export function Gecmis({ surumler, yayindaki, onDon }: Props) {
  return (
    <section aria-labelledby="gecmis-baslik" className={stil.bolum}>
      <h2 id="gecmis-baslik" className={stil.baslik}>{g.baslik}</h2>
      {surumler.length === 0 && <p className={ortak.not}>{g.bos}</p>}
      <ol className={stil.liste}>
        {surumler.map((s) => (
          <li key={s.id} className={stil.satir}>
            <span>
              {doldur(g.satir, {
                tarih: surumTarihi(s.olusturma),
                kaynak: s.kaynak === 'geriAl' ? g.geriAl : g.panel,
              })}
            </span>
            {s.id === yayindaki ? (
              <em className={stil.etiket}>{g.yayinda}</em>
            ) : (
              <button type="button" className={ortak.ikincil} onClick={() => onDon(s)}>{g.don}</button>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
