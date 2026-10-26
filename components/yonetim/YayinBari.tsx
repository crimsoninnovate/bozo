'use client'

import { useId, useRef, useState, type ReactNode } from 'react'
import { yonetim as m } from '@/content/yonetim'
import ortak from './oturum.module.css'
import stil from './YayinBari.module.css'

/** Sayfanın dibine sabit eylem çubuğu, sütun genişliğinde; `ust` çubuğun hemen üstünde açılır. */
export function AltBar({ ust, children }: { ust?: ReactNode; children: ReactNode }) {
  return (
    <div className={stil.alt}>
      {ust}
      <div className={stil.satir}>{children}</div>
    </div>
  )
}

/** "Değişiklikleri At" onayı; açılınca odak güvenli seçenekte (Vazgeç). */
function AtSorusu({ onEvet, onVazgec }: { onEvet: () => void; onVazgec: () => void }) {
  const a = m.menu.at
  const soru = useId()
  return (
    <div className={stil.soru} role="alertdialog" aria-label={a.dugme} aria-describedby={soru}>
      <p id={soru} className={stil.soruMetni}>{a.soru}</p>
      <div className={ortak.dugmeler}>
        <button type="button" className={ortak.ikincil} autoFocus onClick={onVazgec}>{a.vazgec}</button>
        <button type="button" className={ortak.ana} onClick={onEvet}>{a.evet}</button>
      </div>
    </div>
  )
}

type Props = {
  /** `yayinDurumu`: tek satırlık durum ve Yayınla'nın kapalı olup olmadığı. */
  durum: { metin: string; kapali: boolean }
  degisiklikVar: boolean
  onYayinla: () => void
  /** Çalışma kopyasını yayındakine döndürür. */
  onAt: () => void
}

/** Solda durum ve "Değişiklikleri At", sağda Yayınla. */
export function YayinBari({ durum, degisiklikVar, onYayinla, onAt }: Props) {
  const [soruluyor, setSoruluyor] = useState(false)
  const atDugmesi = useRef<HTMLButtonElement>(null)
  const durumKimlik = useId()
  const vazgec = () => {
    setSoruluyor(false)
    requestAnimationFrame(() => atDugmesi.current?.focus())
  }
  const soru = soruluyor && degisiklikVar
  return (
    <AltBar ust={soru && <AtSorusu onEvet={() => { onAt(); setSoruluyor(false) }} onVazgec={vazgec} />}>
      <div className={stil.sol}>
        <p id={durumKimlik} className={stil.durum}>{durum.metin}</p>
        {degisiklikVar && !soru && (
          <button ref={atDugmesi} type="button" className={stil.at} onClick={() => setSoruluyor(true)}>
            {m.menu.at.dugme}
          </button>
        )}
      </div>
      <button type="button" className={`${ortak.ana} ${stil.yayinla}`} disabled={durum.kapali}
        aria-describedby={durumKimlik} onClick={onYayinla}>
        {m.menu.yayinla}
      </button>
    </AltBar>
  )
}
