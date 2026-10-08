'use client'

import Link from 'next/link'
import { LazyMotion, MotionConfig, domAnimation, m } from 'motion/react'
import { CamPanel } from '@/components/ui/CamPanel'
import { sozluk, type Sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { doldur } from '@/lib/metin'
import type { BenYaniti, TabloYaniti } from '@/lib/oyun/aktarim'
import { sifirlanmaMetni, tarihMetni } from '@/lib/oyun/tarih'
import { yol } from '@/lib/site'
import { useSiralama, type Silme } from './useSiralama'
import stil from './SiralamaSayfasi.module.css'

/* Sıralama sayfası (spec §11): haftanın ilk 10'u, oyuncunun sırası ve farkı, son şampiyon, sıfırlanma. */

const GECIS = { duration: 0.3, ease: 'easeOut' as const }
type Sayi = (n: number) => string

function Tablo({ s, dil, tablo, sayi }: { s: Sozluk; dil: Dil; tablo: TabloYaniti; sayi: Sayi }) {
  const ad = (takmaAd: string | null) => takmaAd ?? s.oyun.siralama.gizliAd
  return (
    <>
      <h2 className={stil.altBaslik}>{s.oyun.siralama.buHafta}</h2>
      {tablo.hafta.length === 0 ? (
        <p className={stil.not}>{s.oyun.siralama.bos}</p>
      ) : (
        <ol className={stil.liste}>
          {tablo.hafta.map((satir, i) => (
            <m.li
              key={satir.sira}
              className={stil.satir}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...GECIS, delay: i * 0.05 }}
            >
              <span className={stil.sira}>{satir.sira}</span>
              <span className={stil.ad}>{ad(satir.takmaAd)}</span>
              <span className={stil.puan}>{sayi(satir.puan)}</span>
            </m.li>
          ))}
        </ol>
      )}
      {tablo.sonSampiyon && (
        <p className={stil.not}>
          {s.oyun.siralama.sonSampiyon}: {ad(tablo.sonSampiyon.takmaAd)} · {sayi(tablo.sonSampiyon.puan)}
        </p>
      )}
      <p className={stil.not}>{doldur(s.oyun.siralama.sifirlanma, { zaman: sifirlanmaMetni(tablo.bitis, dil) })}</p>
    </>
  )
}

function Ben({ s, dil, ben, sayi }: { s: Sozluk; dil: Dil; ben: BenYaniti; sayi: Sayi }) {
  const { hafta, odul } = ben
  return (
    <>
      {hafta && (
        <p className={stil.ben}>
          {doldur(s.oyun.siralama.sira, { sira: hafta.sira })}
          {hafta.ustekiFark !== null &&
            ` · ${doldur(s.oyun.siralama.ustekiFark, { fark: sayi(hafta.ustekiFark) })}`}
        </p>
      )}
      {odul && (
        <section className={stil.odul} aria-labelledby="odul-baslik">
          <h2 id="odul-baslik" className={stil.altBaslik}>
            {s.oyun.odul.baslik}
          </h2>
          <p className={stil.kod}>{odul.kod}</p>
          <p className={stil.not}>
            {doldur(s.oyun.odul.sira, { sira: odul.sira })} ·{' '}
            {doldur(s.oyun.odul.gecerlilik, { tarih: tarihMetni(odul.gecerlilik, dil) })}
          </p>
          <p className={stil.not}>{odul.kullanildi ? s.oyun.odul.kullanildi : s.oyun.odul.ekranGoruntusu}</p>
        </section>
      )}
    </>
  )
}

type HesapProps = { s: Sozluk; takmaAd: string; silme: Silme; sor: () => void; vazgec: () => void; sil: () => void }

/** "Hesabımı sil" (spec §8): iki dokunuş, ikincisi onay. */
function Hesap({ s, takmaAd, silme, sor, vazgec, sil }: HesapProps) {
  return (
    <div className={stil.hesap}>
      <p className={stil.not}>{doldur(s.oyun.hesap.hesabin, { ad: takmaAd })}</p>
      {silme === 'yok' ? (
        <button type="button" className={stil.baglantiDugme} onClick={sor}>
          {s.oyun.hesap.sil}
        </button>
      ) : (
        <>
          <p className={stil.not}>{silme === 'hata' ? s.oyun.hesap.silinemedi : s.oyun.hesap.silSoru}</p>
          <div className={stil.dugmeler}>
            <button type="button" className={stil.tehlike} onClick={sil} disabled={silme === 'siliniyor'}>
              {s.oyun.hesap.silOnay}
            </button>
            <button type="button" className={stil.baglantiDugme} onClick={vazgec}>
              {s.oyun.katilim.vazgec}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export function SiralamaSayfasi({ dil }: { dil: Dil }) {
  const s = sozluk(dil)
  const { tablo, hesap, ben, silme, sor, vazgec, sil } = useSiralama()
  const sayi: Sayi = (n) => n.toLocaleString(dil === 'en' ? 'en-GB' : 'tr-TR')

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <div className={stil.sayfa}>
          <CamPanel opaklik={0.74} dolgu="orta" bulanik={false} className={stil.panel}>
            <section className={stil.siralama}>
              <h1 className={stil.baslik}>{s.oyun.siralama.baslik}</h1>
              {tablo.durum === 'hata' && <p className={stil.not}>{s.oyun.siralama.alinamadi}</p>}
              {tablo.durum === 'tamam' && <Tablo s={s} dil={dil} tablo={tablo.veri} sayi={sayi} />}
              {ben && <Ben s={s} dil={dil} ben={ben} sayi={sayi} />}
              {silme === 'silindi' && <p className={stil.not}>{s.oyun.hesap.silindi}</p>}
              {hesap && <Hesap s={s} takmaAd={hesap.takmaAd} silme={silme} sor={sor} vazgec={vazgec} sil={sil} />}
              <Link href={yol('oyun', dil)} className={stil.oyunaDon}>
                {s.oyun.siralama.oyunaDon}
              </Link>
            </section>
          </CamPanel>
        </div>
      </LazyMotion>
    </MotionConfig>
  )
}
