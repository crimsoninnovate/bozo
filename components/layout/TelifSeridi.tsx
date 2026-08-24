import { sozluk, type Dil } from '@/content'
import { yol, type RotaAnahtari } from '@/lib/site'
import stil from './AltBilgi.module.css'
import { YapimciIsareti } from './YapimciIsareti'

type Props = {
  dil: Dil
  aktif: RotaAnahtari
}

/**
 * `Ana:381-386`, `Hikaye:157-162`, `Konum:188-193`: telif metni + soluk tane
 * rayı. Üç footer varyantından ikisinde aynı, menü şeridinde hiç yok
 * (`Menu:283-292` telif satırı taşımaz).
 */
export function TelifSeridi({ dil, aktif }: Props) {
  const s = sozluk(dil)

  return (
    <div className={stil.telifSeridi}>
      <div className={stil.telifMetin}>
        {/*
         * Gizlilik bağlantısı 24 Ağustos 2026'da GERİ KONDU. 13 Ağustos'ta
         * sahibi "şimdilik" kaldırmıştı; o gün site hiçbir şey toplamıyordu.
         * GA4 eklendikten sonra bildirimin erişilebilir olması gerekiyor
         * (KKTC 89/2007 Madde 13, Tüzük Madde 5(5): yükümlülük talebe bağlı değil).
         * Bulunulan sayfaya giden bağlantı ölü hedeftir, o yüzden gizlilik
         * rotasında kendisi basılmaz (tasarımın eski "Sayfalar" kolonu da aynı
         * kuralı uyguluyordu).
         */}
        {s.ortak.telif} · {s.ortak.satirlar.adresSehirUlke}
        {aktif !== 'gizlilik' && (
          <>
            {' '}
            ·{' '}
            <a className={stil.telifBaglanti} href={yol('gizlilik', dil)}>
              {s.ortak.gizlilikBaglantisi}
            </a>
          </>
        )}
      </div>

      <YapimciIsareti dil={dil} />
    </div>
  )
}
