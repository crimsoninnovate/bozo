'use client'

import { Fragment, useEffect, useState } from 'react'
import { cerceveyeAboneOl } from '@/lib/cerceve'
import { hareketAzaltilmisMi } from '@/lib/hareket'
import stil from './BeadRay.module.css'

type Bolum = { id: string; buyuk: boolean }

type Props = { bolumler: Bolum[] }

/**
 * Sağ kenarda sabit dikey bölüm navigasyonu, yalnız ana sayfada. Kendi
 * scroll/resize dinleyicisi kurmaz: aktif bölümü ortak `lib/cerceve.ts`
 * çerçevesinden alır, böylece kor yoğunluğu ve boncuk aktifliği aynı
 * kare içinde güncellenir (bkz. lib/cerceve.ts dosya başı sözleşmesi).
 *
 * Dekoratif kabul edilir (kisitlar.md "Decorative layers ... bead rows
 * are aria-hidden") ve kapsayıcı aria-hidden taşır; düğmeler bu yüzden
 * klavye sekmesinden çıkarılır (tabIndex=-1) ama fare/dokunma ile
 * tıklanabilir kalır. aria-label yine de eklendi (task-6-brief.md Adım 7),
 * aria-hidden altında etkisiz ama zararsız; bkz. task-6-report.md.
 */
export function BeadRay({ bolumler }: Props) {
  const [aktifId, setAktifId] = useState<string | null>(null)
  // Bir kez okunur (bkz. KorSahnesi ile aynı desen): canlı bir medya sorgusu
  // dinleyicisi değil, yalnız ilk render'daki tercihi yakalar.
  const [azaltilmisMi] = useState(() => hareketAzaltilmisMi())

  useEffect(() => cerceveyeAboneOl((durum) => setAktifId(durum.aktifId)), [])

  const kaydir = (hedefId: string) => {
    const hedef = document.getElementById(hedefId)
    if (!hedef) return
    const ust = hedef.getBoundingClientRect().top + window.scrollY - 70
    window.scrollTo({ top: ust, behavior: azaltilmisMi ? 'auto' : 'smooth' })
  }

  return (
    <div className={stil.ray} aria-hidden="true">
      <span className={stil.ustCizgi} />
      {bolumler.map((bolum, i) => {
        const aktif = bolum.id === aktifId
        return (
          <Fragment key={bolum.id}>
            {i > 0 && <span className={stil.baglayici} />}
            <button
              type="button"
              tabIndex={-1}
              // Renk/parlama (kararma) her zaman aktifliği işaretler; ölçek (scale)
              // baş dönmesi yapabilecek bir harekettir, yalnız hareket izni varken
              // eklenir (bkz. lib/cerceve.ts dosya başı sözleşmesi ve task-6-report.md).
              className={`${stil.bead} ${bolum.buyuk ? stil.buyuk : stil.kucuk} ${aktif ? stil.aktif : ''} ${
                aktif && !azaltilmisMi ? stil.aktifOlcek : ''
              }`}
              onClick={() => kaydir(bolum.id)}
              aria-label={bolum.id}
            />
          </Fragment>
        )
      })}
      <span className={stil.altCizgi} />
    </div>
  )
}
