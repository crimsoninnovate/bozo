import type { Isletme } from '../../content/types.ts'
import { herkeseAcik } from './herkeseAcik.ts'
import type { Iletisim, MenuBelgesi } from './tipler.ts'

/*
 * Menü belgesinin iletişim bölümü, statik build'e `NEXT_PUBLIC_ILETISIM` ile gömülür.
 * İçerik herkese açık site verisidir (`herkeseAcik`: kapalı telefonun numarası girmez), sır taşımaz.
 */

const METIN_ALANLARI = ['telefon', 'eposta', 'instagram', 'facebook', 'tiktok', 'googleYorumKodu'] as const

/** `surum` canlı belge sürümüdür (belgenin kendisi taşımaz); yoksa `0` = tohum. */
export function iletisimiEnveCevir(b: MenuBelgesi, surum: number = 0): { iletisim: string; surum: string } {
  const { telefonAcik, telefon, eposta, instagram, facebook, tiktok, googleYorumKodu } = herkeseAcik(b).iletisim
  const iletisim: Iletisim = { telefonAcik, telefon, eposta, instagram, facebook, tiktok, googleYorumKodu }
  return { iletisim: JSON.stringify(iletisim), surum: String(surum) }
}

function iletisimMi(girdi: unknown): girdi is Iletisim {
  if (typeof girdi !== 'object' || girdi === null) return false
  const o = girdi as Record<string, unknown>
  return typeof o['telefonAcik'] === 'boolean' && METIN_ALANLARI.every((alan) => typeof o[alan] === 'string')
}

/** Ham yoksa varsayılan sessizce kalır; bozuksa uyarır ve varsayılan kalır (build kırılmaz). */
export function iletisimiEnvdenOku(ham: string | undefined, varsayilan: Isletme): Isletme {
  if (ham === undefined) return varsayilan
  let girdi: unknown
  try {
    girdi = JSON.parse(ham)
  } catch (hata) {
    console.warn('NEXT_PUBLIC_ILETISIM okunamadi (bozuk JSON), varsayilan iletisim kullaniliyor', hata)
    return varsayilan
  }
  if (!iletisimMi(girdi)) {
    console.warn('NEXT_PUBLIC_ILETISIM gecersiz, varsayilan iletisim kullaniliyor', ham)
    return varsayilan
  }
  const numara = girdi.telefonAcik ? girdi.telefon : null
  return {
    ...varsayilan,
    telefon: numara,
    whatsapp: numara,
    eposta: girdi.eposta,
    instagram: girdi.instagram,
    facebook: girdi.facebook,
    tiktok: girdi.tiktok,
    googleYorumKodu: girdi.googleYorumKodu,
  }
}
