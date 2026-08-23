import { sozluk, type Dil } from '@/content'
import { yol } from '@/lib/site'
import stil from './AltBilgi.module.css'
import { YapimciIsareti } from './YapimciIsareti'

type Props = {
  dil: Dil
}

/**
 * `Ana:381-386`, `Hikaye:157-162`, `Konum:188-193`: telif metni + soluk tane
 * rayı. Üç footer varyantından ikisinde aynı, menü şeridinde hiç yok
 * (`Menu:283-292` telif satırı taşımaz).
 */
export function TelifSeridi({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <div className={stil.telifSeridi}>
      <div className={stil.telifMetin}>
        {/*
         * Gizlilik bağlantısı 24 Ağustos 2026'da GERİ KONDU. 13 Ağustos'ta
         * sahibi "şimdilik" kaldırmıştı; o gün site hiçbir şey toplamıyordu.
         * GA4 eklendikten sonra bildirimin erişilebilir olması gerekiyor
         * (KKTC 89/2007 Madde 13, Tüzük Madde 5(5): yükümlülük talebe bağlı değil).
         */}
        {s.ortak.telif} · {s.ortak.satirlar.adresSehirUlke} ·{' '}
        <a className={stil.telifBaglanti} href={yol('gizlilik', dil)}>
          {s.ortak.gizlilikBaglantisi}
        </a>
      </div>

      <YapimciIsareti dil={dil} />
    </div>
  )
}
