import { BolumBasligi } from '@/components/ui/BolumBasligi'
import { Cip } from '@/components/ui/Cip'
import { FotoYuvasi, type KorNefesi } from '@/components/ui/FotoYuvasi'
import { TaneDizilimi } from '@/components/ui/TaneDizilimi'
import { sozluk, type Dil, type Sozluk } from '@/content'
import { fiyatMetni } from '@/content/isletme'
import type { FotoId, Urun } from '@/content/types'
import { menuUrunler, ozelUrun } from '@/content/urunler'
import { OlcuSatirlari } from './OlcuSatirlari'
import { UrunKarti } from './UrunKarti'
import stil from './Ocaktan.module.css'

type Props = { dil: Dil }

type UrunMetni = { ad: string; aciklama: string }

/**
 * Kartların kor nefesi. Tasarım her plakaya kendi süresini veriyor ve süreler
 * hiçbir kurala uymuyor (10 / 11 / 9.5 / 12), o yüzden indeksten türetilmez.
 * Menu:127, 145, 163, 181. Beşincisi tasarımda yok: karışık ürün 13 Ağustos
 * 2026'da eklendi, süre komşularının aralığından seçildi.
 */
const KART_NEFESLERI: KorNefesi[] = [
  { sure: 10, gecikme: 0.6 },
  { sure: 11, gecikme: 1.2 },
  { sure: 9.5, gecikme: 1.8 },
  { sure: 12, gecikme: 2.4 },
  { sure: 10.5, gecikme: 3 },
]

/**
 * `Urun.id` paylaşılan tipte `string`, sözlük ise sabit anahtarlı. Eşleşmeyen
 * bir kimlik sessizce boş kart basmasın diye burada patlar.
 */
function urunMetni(s: Sozluk, id: string): UrunMetni {
  const kayit: Record<string, UrunMetni | undefined> = s.menu.ocaktan.urunler
  const metin = kayit[id]
  if (!metin) throw new Error(`Menü ürünü sözlükte yok: ${id}`)
  return metin
}

function fotoIdGerekli(urun: Urun): FotoId {
  if (!urun.fotoId) throw new Error(`Menü ürününün foto yuvası yok: ${urun.id}`)
  return urun.fotoId
}

/** Tasarımın iki haneli statik indeksi (Menu:106, 131, 149, 167, 185). Sözlüğe girmez. */
function indeksMetni(sira: number): string {
  return String(sira + 1).padStart(2, '0')
}

/** İmza ürün paneli: ızgaradaki kart değil, spread plakasının yanındaki panel. Menu:104-120 */
function ImzaPaneli({ dil, urun }: { dil: Dil; urun: Urun }) {
  const s = sozluk(dil)
  const metin = urunMetni(s, urun.id)
  const spec = s.menu.ocaktan.cigerSpec

  return (
    <div className={stil.imzaPaneli}>
      <div className={stil.imzaUst}>
        <span className={stil.indeks}>{indeksMetni(0)}</span>
        <Cip tur="outline">{s.menu.ocaktan.imzaRozeti}</Cip>
      </div>
      <h3 className={stil.imzaAd}>{metin.ad}</h3>
      <p className={stil.imzaAciklama}>{metin.aciklama}</p>
      <div className={stil.specSatiri}>
        <Cip tur="dolu">{spec.sis}</Cip>
        <Cip tur="dolu">{spec.dagilim}</Cip>
        <Cip tur="dolu">{spec.sure}</Cip>
      </div>
      <div className={stil.olcuBlogu}>
        <OlcuSatirlari dil={dil} urun={urun} />
      </div>
    </div>
  )
}

/**
 * Bozo Special: tek ölçüsü olan kombinasyon, o yüzden ızgarada değil ızgaranın
 * altında kendi şeridinde. Yarım ve dürüm satırı basılmaz, taşımıyor.
 */
function OzelSerit({ dil }: { dil: Dil }) {
  const { ozel } = sozluk(dil).menu.ocaktan

  return (
    <article className={stil.ozel}>
      <div className={stil.ozelGovde}>
        <div className={stil.ozelUst}>
          <h3 className={stil.ozelAd}>{ozel.ad}</h3>
          <Cip tur="dolu">{ozel.sisNotu}</Cip>
        </div>
        <p className={stil.ozelAciklama}>{ozel.aciklama}</p>
      </div>
      <span className={stil.ozelFiyat}>{fiyatMetni(ozelUrun.fiyat)}</span>
    </article>
  )
}

/**
 * Menü sayfasının ocaktan bölümü. Menu Sayfasi.dc.html:85-198
 *
 * `Bolum` kullanılmaz (bkz. MenuSayfasi.tsx). Çapa payını `Kabuk` veriyor,
 * burada yalnız id duruyor.
 *
 * Spread plakasının kadrajı `tane-yakin-cekim-yatay`: aynı konunun ayrı bir
 * kare olarak istenen yatay çekimi (content/fotograflar.ts:11-15). Ürün
 * kaydındaki `fotoId` (dikey `tane-yakin-cekim`) çekim listesinin ilk karosuna
 * ait; iki kadraj tek anahtarla anlatılamıyor, o yüzden manifestte iki kayıt var.
 */
export function Ocaktan({ dil }: Props) {
  const s = sozluk(dil)
  const [imza, ...kartlar] = menuUrunler
  if (!imza) throw new Error('Ocaktan ürün listesi boş')

  return (
    <section id="ocaktan" className={stil.bolum}>
      <BolumBasligi
        olcek="sayfa"
        baslik={s.menu.ocaktan.baslik}
        sag={<TaneDizilimi adet={6} buyuk={13} kucuk={8} bosluk={10} ton="krem80" />}
      />

      <div className={stil.imzaSatiri}>
        <FotoYuvasi id="tane-yakin-cekim-yatay" dil={dil} bicim="spread" />
        <ImzaPaneli dil={dil} urun={imza} />
      </div>

      <div className={stil.izgara}>
        {kartlar.map((urun, sira) => {
          const metin = urunMetni(s, urun.id)
          return (
            <UrunKarti
              key={urun.id}
              dil={dil}
              fotoId={fotoIdGerekli(urun)}
              indeks={indeksMetni(sira + 1)}
              ad={metin.ad}
              aciklama={metin.aciklama}
              urun={urun}
              korNefesi={KART_NEFESLERI[sira]}
            />
          )
        })}
      </div>

      <OzelSerit dil={dil} />

      {/* Kuralı bir kez söyleyen dipnot. `BolumBasligi`nin not yuvası tane rayına
          ait (sag ?? not), o yüzden başlıkta değil fiyatların altında. */}
      <p className={stil.olcuNotu}>{s.menu.ocaktan.yarimNotu}</p>
    </section>
  )
}
