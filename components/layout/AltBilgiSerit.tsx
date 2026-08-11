import { Buton } from '@/components/ui/Buton'
import { sozluk, type Dil } from '@/content'
import { isletme, TELEFON_YER_TUTUCU } from '@/content/isletme'
import { telefonUrl, yolTarifiUrl } from '@/lib/site'
import stil from './AltBilgi.module.css'

type Props = { dil: Dil }

/**
 * `Menu Sayfasi.dc.html:283-292`: menü sayfası dört kolonlu footer basmaz,
 * kompakt tek şerit basar. Solda marka kelimesi ve tek satırda adres + saat,
 * sağda iki buton. Telif şeridi bu varyantta yok (tasarım da taşımıyor).
 *
 * Uzun ve tek amaçlı bir sayfanın kısa bitişi; bölüm atlama navigasyonu üst
 * barda olduğu için altta ikinci bir sayfa listesine gerek kalmıyor.
 */
export function AltBilgiSerit({ dil }: Props) {
  const s = sozluk(dil)
  const telefon = telefonUrl(isletme.telefon)

  return (
    <footer className={`${stil.zemin} ${stil.serit}`}>
      <div className={stil.seritSol}>
        <span className={stil.seritMarka}>{s.ortak.marka.ad}</span>
        <span className={stil.seritSatir}>{s.ortak.satirlar.adresVeSaat}</span>
      </div>
      <div className={stil.seritButonlar}>
        <Buton tur="birincil" boy="md" href={yolTarifiUrl()} hariciMi>
          {s.ortak.cta.yolTarifiAl}
        </Buton>
        {/* Tasarımdaki etiket numaranın kendisi; numara gelmediği için yer tutucu
            basılır ve Buton href=null ile devre dışı bir kutuya döner. */}
        <Buton tur="ikincil" boy="md" href={telefon}>
          {isletme.telefon ?? TELEFON_YER_TUTUCU}
        </Buton>
      </div>
    </footer>
  )
}
