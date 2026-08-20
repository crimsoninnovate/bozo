import { Bolum } from '@/components/ui/Bolum'
import { Buton } from '@/components/ui/Buton'
import { CapaBaglantisi } from '@/components/ui/CapaBaglantisi'
import { PinIkon } from '@/components/ui/Ikonlar'
import { TaneDizilimi } from '@/components/ui/TaneDizilimi'
import { sozluk, type Dil } from '@/content'
import { yolTarifiUrl } from '@/lib/site'
import stil from './Acilis.module.css'
import { OcakKarti } from './OcakKarti'

type Props = { dil: Dil }

/**
 * Ana sayfanın açılış bölümü. Kaynak: `header-hero-v2/SPEC.md` §5
 * (20 Ağustos 2026), önceki kaynak UYGULAMA-NOTLARI 2 idi.
 *
 * v2'nin getirdikleri: iki satırlık başlık (ikincisi bakır tonda), rozetin üç
 * sözünün überline olması, gövde paragrafı, tane ölçüsü grafiği, sağdaki canlı
 * bloğun kartlanması ve alt meta şeridi.
 *
 * SPEC'İN OCAK FOTOĞRAF BANDI UYGULANMADI (sahibinin kararı, 20 Ağustos 2026).
 * Handoff kor sahnesini bilmiyordu ve hero'nun altına tam genişlik bir görsel
 * öneriyordu; o band `KorSahnesi`'nin üstüne opak bir şerit koyup zemin
 * animasyonunu kesiyordu. Hero o boşluk olmadan nefes alıyor.
 */
export function Acilis({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <Bolum id="acilis" yogunluk={1} className={stil.bolum} eritClassName={stil.erit}>
      <div className={stil.izgara}>
        <div className={stil.sol}>
          <p className={stil.uberSatir}>{s.ana.hero.uberSatir}</p>

          {/* Tek H1, iki satır. İkinci satır gri değil bakır: kırık değil kasıtlı okusun. */}
          <h1 className={stil.baslik}>
            <span className={stil.satir1}>{s.ana.hero.baslikSatir1}</span>
            <span className={stil.satir2}>{s.ana.hero.baslikSatir2}</span>
          </h1>

          {/*
            Tane ölçüsü grafiği, markanın imza öğesi. Dizilim `lib/sis.ts`'in
            kilitli ritminden (ciğer, yağ, ciğer, ciğer, yağ, ciğer); spec'in
            x koordinatları farklı bir sıra veriyordu, marka kararı kazanır.
          */}
          <TaneDizilimi
            adet={6}
            buyuk={20}
            kucuk={12}
            bosluk={12}
            mobil={{ buyuk: 13, kucuk: 8, bosluk: 8 }}
            cizgi
            kor
            etiket={s.ana.hero.taneOlcusuEtiketi}
          />

          <p className={stil.govde}>{s.ana.hero.govde}</p>

          <div className={stil.ctaSatiri}>
            <Buton
              tur="birincil"
              boy="xl"
              href={yolTarifiUrl()}
              hariciMi
              ikon={<PinIkon boy={15} />}
            >
              {s.ortak.cta.yolTarifiAl}
            </Buton>
            {/* Tasarımda data-git="ocakbasi": menü SAYFASINA değil, sayfa içinde
                "Ocakbasi" bölümüne kaydırır (Ana:113). */}
            <Buton tur="ikincil" boy="xl" href="#ocakbasi" ok>
              {s.ortak.cta.menuyuGor}
            </Buton>
          </div>
        </div>

        <div className={stil.sag}>
          <OcakKarti dil={dil} />
        </div>
      </div>

      <div className={stil.metaSerit}>
        <p className={stil.meta}>
          <span>{s.ortak.satirlar.adresKisa}</span>
          <span aria-hidden="true" className={stil.metaAyirici} />
          <span>{s.ortak.satirlar.saatlerGunluk}</span>
          <span aria-hidden="true" className={stil.metaAyirici} />
          <span>{s.ortak.alkolsuzKisa}</span>
        </p>
        {/* Yumuşak kaydırma: sayfadaki dört çapadan ikisi (bu ipucu ve bardaki "Gece")
            düz <a> ile tek karede zıplıyordu, ikisi 600ms kayıyordu. Ölçüldü, 18 Ağustos 2026. */}
        <CapaBaglantisi className={stil.ipucu} href="#iddia">
          <span className={stil.ipucuMetin}>{s.ana.hero.scrollIpucu}</span>
          <span aria-hidden="true" className={stil.ipucuOk}>
            ↓
          </span>
        </CapaBaglantisi>
      </div>
    </Bolum>
  )
}
