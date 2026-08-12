import Link from 'next/link'
import { sozluk, type Dil } from '@/content'
import { yol, type RotaAnahtari } from '@/lib/site'
import stil from './AltBilgi.module.css'

type Props = {
  dil: Dil
  aktif: RotaAnahtari
  /** Hikaye/Konum varyantı üst boşluğu bir tık sıkar (40/18 yerine 46/20). */
  sikMi?: boolean
}

/**
 * `Ana:381-386`, `Hikaye:157-162`, `Konum:188-193`: telif metni + soluk tane
 * rayı. Üç footer varyantından ikisinde aynı, menü şeridinde hiç yok
 * (`Menu:283-292` telif satırı taşımaz).
 */
export function TelifSeridi({ dil, aktif, sikMi = false }: Props) {
  const s = sozluk(dil)

  return (
    <div className={`${stil.telifSeridi}${sikMi ? ` ${stil.telifSeridiSik}` : ''}`}>
      <div className={stil.telifMetin}>
        {s.ortak.telif} · {s.ortak.satirlar.adresSehirUlke}
        {aktif !== 'gizlilik' && (
          <>
            {' · '}
            {/*
             * Tasarımın hiçbir sayfasında Gizlilik'e bağlantı yok, kopyalanacak
             * bir yerleşim yok; telif şeridine modest bir metin bağlantısı
             * eklendi (fix round 1). Gizlilik sayfasının kendi telif şeridinde
             * tekrarlanmaz: kendine giden bağlantı ölü bir hedeftir.
             */}
            <Link href={yol('gizlilik', dil)} className={stil.gizlilikLink}>
              {s.ortak.nav.gizlilik}
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
