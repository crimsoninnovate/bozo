import { CanliSaat } from '@/components/saat/CanliSaat'
import { DurumAltMetni } from '@/components/saat/DurumAltMetni'
import { DurumCipi } from '@/components/saat/DurumCipi'
import { GunMerdiveni } from '@/components/saat/GunMerdiveni'
import { KapanisNotu } from '@/components/saat/KapanisNotu'
import { Bolum } from '@/components/ui/Bolum'
import { Buton } from '@/components/ui/Buton'
import { PinIkon } from '@/components/ui/Ikonlar'
import { TaneDizilimi } from '@/components/ui/TaneDizilimi'
import { sozluk, type Dil } from '@/content'
import { yolTarifiUrl } from '@/lib/site'
import stil from './Acilis.module.css'

type Props = { dil: Dil }

/**
 * Ana sayfanın açılış bölümü.
 *
 * Tasarım kaynağı DEĞİŞTİ: Ana Sayfa Alternatif.dc.html:86-126 tek kolonluk bir
 * hero çiziyordu ve 1440px'te sağ yarısı ölü kalıyordu. UYGULAMA-NOTLARI 2 onu
 * iki kolona böler ve boş yarıyı markanın ana fikriyle, canlı saatle doldurur.
 * Daha önce oraya konan tane alanı bu yüzden kalktı.
 */
export function Acilis({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <Bolum id="acilis" yogunluk={1} className={stil.bolum} eritClassName={stil.erit}>
      <div className={stil.izgara}>
        <div className={stil.sol}>
          <div className={stil.durumSatiri}>
            <DurumCipi dil={dil} boy="dev" />
            <DurumAltMetni dil={dil} />
          </div>

          <h1 className={stil.baslik}>
            {s.ana.hero.baslikSatir1}
            <br />
            {s.ana.hero.baslikSatir2}
            <br />
            <span className={stil.baslikUcuncu}>{s.ana.hero.altBaslik}</span>
          </h1>

          {/*
            Şiş grafiği. UYGULAMA-NOTLARI 2 bunu altı eşit 17px kareye ve üç
            renge düşürmüştü, çubuk da karelerin sağında duruyordu; sahibi
            13 Ağustos 2026'da beğenmedi. Handoff'un rayına dönüldü:
            20/12/20/20/12/20, gap 12, çubuk karelerin ARKASINDAN geçiyor
            (Ana Sayfa Alternatif.dc.html:101-103, docs/tasarim/ana-sayfa.json).
            Mobil ölçüler Mobil Prototip.dc.html:80-81'in ray varyantı.
          */}
          <div className={stil.sisSatiri}>
            <TaneDizilimi
              adet={6}
              buyuk={20}
              kucuk={12}
              bosluk={12}
              mobil={{ buyuk: 13, kucuk: 8, bosluk: 8 }}
              cizgi
              kor
            />
          </div>

          <div className={stil.ctaSatiri}>
            <Buton
              tur="birincil"
              boy="xl"
              href={yolTarifiUrl()}
              hariciMi
              ikon={<PinIkon boy={18} />}
            >
              {s.ortak.cta.yolTarifiAl}
            </Buton>
            {/* Tasarımda data-git="ocaktan": menü SAYFASINA değil, sayfa içinde
                "Ocaktan" bölümüne kaydırır (Ana:113). */}
            <Buton tur="ikincil" boy="xl" href="#ocaktan" ok>
              {s.ortak.cta.menuyuGor}
            </Buton>
          </div>

          <p className={stil.meta}>
            <span>{s.ortak.satirlar.adresKisa}</span>
            <span aria-hidden="true" className={stil.metaAyirici} />
            <span>{s.ortak.satirlar.saatlerGunluk}</span>
            <span aria-hidden="true" className={stil.metaAyirici} />
            <span>{s.ortak.alkolsuzKisa}</span>
          </p>
        </div>

        <div className={stil.sag}>
          <span className={stil.saatEtiketi}>{s.ana.hero.saatEtiketi}</span>
          <CanliSaat boy="dev" />
          <KapanisNotu dil={dil} />
          <GunMerdiveni dil={dil} />
        </div>
      </div>

      <a className={stil.ipucu} href="#iddia">
        <span aria-hidden="true" className={stil.ipucuKare} />
        <span aria-hidden="true" className={stil.ipucuCizgi} />
        <span className={stil.ipucuMetin}>{s.ana.hero.scrollIpucu}</span>
      </a>
    </Bolum>
  )
}
