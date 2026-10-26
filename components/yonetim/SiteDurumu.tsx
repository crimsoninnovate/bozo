'use client'

import { siteDurumu, siteSurumuOku } from '@/lib/menu/panel'
import stil from './SiteDurumu.module.css'

/** Sitenin build'e gömdüğü menü sürümü; derleme anında sabitlenir (`next.config.ts`). */
const SITE_SURUMU = siteSurumuOku(process.env.NEXT_PUBLIC_MENU_SURUMU)

type Props = {
  yayinSurum: number | null
  /** Üst barın tek satırı (canlı bölge); tam cümle Geçmiş sekmesinde durur. */
  kisa?: boolean
}

/** Panelin yayındaki sürümüyle sitenin basıldığı sürümü yan yana söyler; fark varsa vurgulu. */
export function SiteDurumu({ yayinSurum, kisa = false }: Props) {
  const durum = siteDurumu(yayinSurum, SITE_SURUMU)
  if (kisa) {
    return <p className={durum.guncel ? stil.kisa : `${stil.kisa} ${stil.kisaFark}`} role="status">{durum.kisa}</p>
  }
  return <p className={durum.guncel ? stil.durum : stil.fark}>{durum.metin}</p>
}
