import { FotoYuvasi } from '@/components/ui/FotoYuvasi'
import { BolumBasligi } from '@/components/ui/BolumBasligi'
import { sozluk, type Dil, type Sozluk } from '@/content'
import { fiyatMetni } from '@/content/isletme'
import { icecekler } from '@/content/urunler'
import stil from './Icecekler.module.css'

type Props = { dil: Dil }

/**
 * QR glifinin 3x3 deseni: dört köşe krem, merkez tangerine, kenar ortaları boş.
 * Menu:255-257
 */
const QR_DESENI = ['dolu', 'bos', 'dolu', 'bos', 'merkez', 'bos', 'dolu', 'bos', 'dolu'] as const

function icecekAdi(s: Sozluk, id: string): string {
  const kayit: Record<string, string | undefined> = s.menu.icecekler.urunler
  const ad = kayit[id]
  if (!ad) throw new Error(`İçecek sözlükte yok: ${id}`)
  return ad
}

function olcuAdi(s: Sozluk, id: string): string {
  const kayit: Record<string, string | undefined> = s.menu.icecekler.olculer
  const ad = kayit[id]
  if (!ad) throw new Error(`İçecek ölçüsü sözlükte yok: ${id}`)
  return ad
}

function qrHucreSinifi(hucre: (typeof QR_DESENI)[number]): string | undefined {
  if (hucre === 'dolu') return stil.qrDolu
  if (hucre === 'merkez') return stil.qrMerkez
  return undefined
}

/**
 * Menü sayfasının içecekler bölümü. Menu Sayfasi.dc.html:233-262
 *
 * Alkolsüz satırı `ortak.alkolsuzKisa` kullanır, `ortak.alkolsuz` DEĞİL:
 * ikincisi menüde olmayan bir cümle daha taşıyor. Tasarımdaki cümle sonda nokta
 * taşıyor, sözlükteki anahtar taşımıyor; fark rapora yazıldı, sözlüğe elle
 * nokta eklenmedi.
 */
export function Icecekler({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <section id="icecekler" tabIndex={-1} className={stil.bolum}>
      <BolumBasligi olcek="sayfa" baslik={s.menu.icecekler.baslik} />

      <div className={stil.satir}>
        <FotoYuvasi id="ayran" dil={dil} bicim="icecek" bosMobildeGizli />
        <div className={stil.kolon}>
          <ul className={stil.liste}>
            {icecekler.map((icecek) => (
              <li key={icecek.id} className={stil.kalem}>
                <span className={stil.ad}>{icecekAdi(s, icecek.id)}</span>
                <span className={stil.olculer}>
                  {icecek.olculer.map(({ olcu, fiyat }) => (
                    <span key={olcu} className={stil.olcu}>
                      {olcuAdi(s, olcu)}
                      <span className={stil.fiyat}>{fiyatMetni(fiyat)}</span>
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={stil.dipnot}>
        <p className={stil.alkolsuz}>{s.ortak.alkolsuzKisa}</p>
        <div className={stil.qrGrup}>
          <span aria-hidden="true" className={stil.qr}>
            {QR_DESENI.map((hucre, sira) => (
              <span key={sira} className={qrHucreSinifi(hucre)} />
            ))}
          </span>
          <p className={stil.qrNotu}>{s.menu.icecekler.qrNotu}</p>
        </div>
      </div>
    </section>
  )
}
