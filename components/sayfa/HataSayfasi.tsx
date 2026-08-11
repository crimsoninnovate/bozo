import { KorSahnesi } from '@/components/ember/KorSahnesi'
import { Buton } from '@/components/ui/Buton'
import { EtiketSatiri } from '@/components/ui/EtiketSatiri'
import { sozluk, type Dil } from '@/content'
import { yol } from '@/lib/site'
import stil from './HataSayfasi.module.css'

type Props = { dil: Dil }

/**
 * 404 gövdesi. Tasarım paketinde karşılığı yoktur; yerleşim sitenin kendi
 * ortalanmış blok kalıbından alınır (Ana Sayfa Alternatif.dc.html:219-242).
 *
 * Sayfa KABUK TAŞIMAZ: üst bar ve alt bilgi basılmaz. İki gerekçe var. `Kabuk`
 * zorunlu bir `aktif: RotaAnahtari` ister ve 404'ün rota anahtarı yoktur; ayrıca
 * kabuğun ikinci bir kopyası kabuğun kendi bakımını ikiye böler. Misafire çıkış
 * yolu iki butonla verilir: ana sayfa ve menü. Marka sürekliliği `KorSahnesi`
 * ile kurulur, yoğunluk takibi kapalıdır (takip edilecek bölüm yok).
 */
export function HataSayfasi({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <>
      <KorSahnesi varyant="ic" />
      <main className={stil.bolum}>
        <div className={stil.blok}>
          <EtiketSatiri className={stil.kicker}>{s.hata.kicker}</EtiketSatiri>
          <h1 className={stil.baslik}>{s.hata.baslik}</h1>
          <p className={stil.metin}>{s.hata.metin}</p>
          <div className={stil.butonlar}>
            <Buton tur="birincil" boy="lg" href={yol('ana', dil)}>
              {s.hata.anaSayfa}
            </Buton>
            <Buton tur="ikincil" boy="lg" href={yol('menu', dil)}>
              {s.hata.menu}
            </Buton>
          </div>
        </div>
      </main>
    </>
  )
}
