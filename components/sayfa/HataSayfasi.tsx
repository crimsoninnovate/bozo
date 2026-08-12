'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { KorSahnesi } from '@/components/ember/KorSahnesi'
import { Buton } from '@/components/ui/Buton'
import { EtiketSatiri } from '@/components/ui/EtiketSatiri'
import { TaneDizilimi } from '@/components/ui/TaneDizilimi'
import { sozluk, type Dil } from '@/content'
import { yol, yoldanDil } from '@/lib/site'
import stil from './HataSayfasi.module.css'

/**
 * 404 gövdesi. Tasarım paketinde karşılığı yoktur; yerleşim sitenin kendi
 * ortalanmış blok kalıbından alınır (Ana Sayfa Alternatif.dc.html:219-242).
 *
 * Sayfa KABUK TAŞIMAZ: üst bar ve alt bilgi basılmaz. İki gerekçe var. `Kabuk`
 * zorunlu bir `aktif: RotaAnahtari` ister ve 404'ün rota anahtarı yoktur; ayrıca
 * kabuğun ikinci bir kopyası kabuğun kendi bakımını ikiye böler. Misafire çıkış
 * yolu iki butonla verilir: ana sayfa ve menü. Marka sürekliliği `KorSahnesi`
 * ile kurulur, yoğunluk takibi kapalıdır (takip edilecek bölüm yok).
 *
 * Kabuksuzluk sayfayı kimliksiz bırakıyordu: denetimde ölçüldü, "Ciğerci Bozo"
 * dizesi sayfada yalnız RSC yükünde geçiyor, görünür hiçbir yerde yok
 * (ux-hareket-denetimi-ic-sayfalar.md, S3). Wordmark tek başına basılır;
 * yukarıdaki iki gerekçe tam kabuğa ait, marka işaretine değil.
 *
 * DİL: statik export tek bir `out/404.html` üretir, yani sunucu hangi dilin
 * istendiğini bilemez ve TR basar. Dil istemcide düzeltilir; ilk render sunucuyla
 * aynı olmak zorunda olduğu için anahtar `useEffect` içinde, render sırasında değil.
 */
export function HataSayfasi() {
  const [dil, setDil] = useState<Dil>('tr')
  const s = sozluk(dil)

  useEffect(() => {
    const istenenDil = yoldanDil(window.location.pathname)
    if (istenenDil === 'tr') return
    setDil(istenenDil)
    // `<html lang>` ve başlık belgenin kendi katmanı; metinle birlikte dönmezse
    // ekran okuyucu Türkçe seslendirmeye devam eder.
    document.documentElement.lang = istenenDil
    const t = sozluk(istenenDil)
    document.title = `${t.hata.kicker} · ${t.ortak.marka.ad}`
  }, [])

  return (
    <>
      <KorSahnesi varyant="ic" />
      <main className={stil.bolum}>
        <div className={stil.blok}>
          <Link href={yol('ana', dil)} className={stil.marka}>
            <TaneDizilimi buyuk={8} kucuk={5} bosluk={4} />
            <span className={stil.markaAd}>{s.ortak.marka.ad}</span>
          </Link>
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
