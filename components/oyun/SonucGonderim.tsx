import Link from 'next/link'
import { m } from 'motion/react'
import type { Sozluk } from '@/content'
import { doldur } from '@/lib/metin'
import type { Gonderim } from './useOyunAkisi'
import stil from './SonucEkrani.module.css'

/*
 * Sonuç ekranının sunucuya bakan iki parçası (spec §7, §11): puanın altındaki haftalık sıra
 * satırı ve "Tekrar Oyna"nın altındaki durum ya da "Bu Skoru Sıralamaya Yaz" düğmesi.
 */
type Ortak = { s: Sozluk; gonderim: Gonderim; sayi: (n: number) => string }

const GECIS = { duration: 0.3, ease: 'easeOut' as const }

export function SiraSatiri({ s, gonderim, sayi }: Ortak) {
  if (gonderim.durum !== 'gonderildi') return null
  const { hafta, buTurEnIyi } = gonderim
  const fark =
    hafta.ustekiFark === null ? '' : ` · ${doldur(s.oyun.siralama.ustekiFark, { fark: sayi(hafta.ustekiFark) })}`
  return (
    <m.p className={stil.sira} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={GECIS}>
      {doldur(s.oyun.gonderim.sira, { sira: hafta.sira })}
      {fark}
      {!buTurEnIyi && (
        <>
          <br />
          {doldur(s.oyun.gonderim.enIyin, { puan: sayi(hafta.puan) })}
        </>
      )}
    </m.p>
  )
}

type DurumProps = Ortak & { katil: () => void; tekrarDene: () => void; siralamaYolu: string }

export function GonderimDurumu({ s, gonderim, katil, tekrarDene, siralamaYolu }: DurumProps) {
  return (
    <div className={stil.gonderim}>
      {gonderim.durum === 'cevrimdisi' && <p className={stil.durum}>{s.oyun.gonderim.cevrimdisi}</p>}
      {gonderim.durum === 'gonderiliyor' && <p className={stil.durum}>{s.oyun.gonderim.gonderiliyor}</p>}
      {gonderim.durum === 'bekliyor' && (
        <button type="button" className={stil.ikincil} onClick={katil}>
          {s.oyun.siralamayaYaz}
        </button>
      )}
      {gonderim.durum === 'hata' && (
        <p className={stil.durum}>
          {s.oyun.gonderim.hata}{' '}
          <button type="button" className={stil.baglantiDugme} onClick={tekrarDene}>
            {s.oyun.gonderim.tekrarDene}
          </button>
        </p>
      )}
      <Link href={siralamaYolu} className={stil.baglanti}>
        {s.oyun.siralama.baslik}
      </Link>
    </div>
  )
}
