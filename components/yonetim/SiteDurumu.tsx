'use client'

import { siteDurumu, siteSurumuOku } from '@/lib/menu/panel'
import stil from './SiteDurumu.module.css'

/** Sitenin build'e gömdüğü menü sürümü; derleme anında sabitlenir (`next.config.ts`). */
const SITE_SURUMU = siteSurumuOku(process.env.NEXT_PUBLIC_MENU_SURUMU)

/** Panelin yayındaki sürümüyle sitenin basıldığı sürümü yan yana söyler; fark varsa vurgulu. */
export function SiteDurumu({ yayinSurum }: { yayinSurum: number | null }) {
  const durum = siteDurumu(yayinSurum, SITE_SURUMU)
  return (
    <p className={durum.guncel ? stil.durum : stil.fark} role="status">
      {durum.metin}
    </p>
  )
}
