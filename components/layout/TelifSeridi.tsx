import { sozluk, type Dil } from '@/content'
import stil from './AltBilgi.module.css'

type Props = {
  dil: Dil
  /** Hikaye/Konum varyantı üst boşluğu bir tık sıkar (40/18 yerine 46/20). */
  sikMi?: boolean
}

/**
 * `Ana:381-386`, `Hikaye:157-162`, `Konum:188-193`: telif metni + soluk tane
 * rayı. Üç footer varyantından ikisinde aynı, menü şeridinde hiç yok
 * (`Menu:283-292` telif satırı taşımaz).
 */
export function TelifSeridi({ dil, sikMi = false }: Props) {
  const s = sozluk(dil)

  return (
    <div className={`${stil.telifSeridi}${sikMi ? ` ${stil.telifSeridiSik}` : ''}`}>
      <div className={stil.telifMetin}>
        {/*
         * Gizlilik bağlantısı KALDIRILDI (sahibi, 13 Ağustos 2026, "şimdilik").
         * Tasarımın hiçbir sayfasında zaten yoktu; footer'a fix turunda
         * eklenmişti. Sayfa duruyor ve site haritasında kalıyor, yalnız
         * içeriden bağlantısı yok.
         */}
        {s.ortak.telif} · {s.ortak.satirlar.adresSehirUlke}
      </div>
    </div>
  )
}
