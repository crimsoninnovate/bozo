import { CanliSaat } from '@/components/saat/CanliSaat'
import { DurumAltMetni } from '@/components/saat/DurumAltMetni'
import { DurumCipi } from '@/components/saat/DurumCipi'
import { Bolum } from '@/components/ui/Bolum'
import { Buton } from '@/components/ui/Buton'
import { TaneDizilimi } from '@/components/ui/TaneDizilimi'
import { sozluk, type Dil } from '@/content'
import { yolTarifiUrl } from '@/lib/site'
import stil from './Acilis.module.css'

type Props = { dil: Dil }

/** Ana sayfanın açılış bölümü. Ana Sayfa Alternatif.dc.html:86-126 */
export function Acilis({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <Bolum id="acilis" yogunluk={1} className={stil.bolum} eritClassName={stil.erit}>
      <div className={stil.durumSatiri}>
        <DurumCipi dil={dil} boy="dev" />
        <CanliSaat boy="dev" />
        <DurumAltMetni dil={dil} />
      </div>

      <h1 className={stil.baslik}>
        {s.ana.hero.baslikSatir1}
        <br />
        {s.ana.hero.baslikSatir2}
      </h1>

      <div className={stil.altSatir}>
        <span className={stil.altBaslik}>{s.ana.hero.altBaslik}</span>
        <TaneDizilimi
          adet={6}
          buyuk={20}
          kucuk={12}
          bosluk={12}
          mobil={{ buyuk: 13, kucuk: 8, bosluk: 7 }}
          cizgi
          kor
        />
      </div>

      <div className={stil.ctaSatiri}>
        <Buton tur="birincil" boy="xl" href={yolTarifiUrl()} hariciMi>
          {s.ortak.cta.yolTarifiAl}
        </Buton>
        {/* Tasarımda data-git="ocaktan": menü SAYFASINA değil, sayfa içinde
            "Ocaktan" bölümüne kaydırır (Ana:113). */}
        <Buton tur="ikincil" boy="xl" href="#ocaktan">
          {s.ortak.cta.menuyuGor}
        </Buton>
        <p className={stil.meta}>
          <span>{s.ortak.satirlar.adresKisa}</span>
          <span aria-hidden="true" className={stil.metaAyirici} />
          <span>{s.ortak.satirlar.saatlerGunluk}</span>
        </p>
      </div>

      <a className={stil.ipucu} href="#iddia">
        <span aria-hidden="true" className={stil.ipucuKare} />
        <span aria-hidden="true" className={stil.ipucuCizgi} />
        <span className={stil.ipucuMetin}>{s.ana.hero.scrollIpucu}</span>
      </a>
    </Bolum>
  )
}
