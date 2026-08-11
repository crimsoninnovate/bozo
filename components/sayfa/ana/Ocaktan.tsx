import { Bolum } from '@/components/ui/Bolum'
import { BolumBasligi } from '@/components/ui/BolumBasligi'
import { CamPanel } from '@/components/ui/CamPanel'
import { MenuSatiri } from '@/components/ui/MenuSatiri'
import { sozluk, type Dil, type Sozluk } from '@/content'
import { ocaktanUrunler } from '@/content/urunler'
import stil from './Ocaktan.module.css'

type Props = { dil: Dil }

type UrunMetni = { ad: string; aciklama: string }

/**
 * `Urun.id` paylaşılan tipte `string`, sözlük ise sabit anahtarlı. Eşleşmeyen bir
 * kimlik sessizce boş satır basmasın diye derleme sırasında patlar.
 */
function urunMetni(s: Sozluk, id: string): UrunMetni {
  const kayit: Record<string, UrunMetni | undefined> = s.ana.ocaktan.urunler
  const metin = kayit[id]
  if (!metin) throw new Error(`Ocaktan ürünü sözlükte yok: ${id}`)
  return metin
}

/** Ana sayfanın ocaktan bölümü. Ana Sayfa Alternatif.dc.html:169-217 */
export function Ocaktan({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <Bolum id="ocaktan" yogunluk={0.4} className={stil.bolum} eritClassName={stil.erit}>
      <CamPanel opaklik={0.74} dolgu="orta" genislik="sayfa">
        <BolumBasligi baslik={s.ana.ocaktan.baslik} not={s.ana.ocaktan.altNot} />
        <ol className={stil.liste}>
          {ocaktanUrunler.map((urun, sira) => {
            const metin = urunMetni(s, urun.id)
            return (
              <MenuSatiri
                key={urun.id}
                sira={sira + 1}
                ad={metin.ad}
                aciklama={metin.aciklama}
                fiyat={urun.fiyat}
              />
            )
          })}
        </ol>
      </CamPanel>
    </Bolum>
  )
}
