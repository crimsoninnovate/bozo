// Kendi 'use client' bildirimi yok: yalnız UstBar (client) tarafından render edilir,
// UstBar'ın sınırından miras alır. Ayrı bir bildirim, sunucu bileşeninden serileştirilemeyen
// `kapat` fonksiyon prop'unu doğrudan bu dosyaya geçiyormuş gibi göstererek sahte bir
// sınır uyarısı üretiyordu (bkz. task-6-report.md).
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useGirneSaati } from '@/components/saat/useGirneSaati'
import { sozluk, type Dil } from '@/content'
import { yol, type RotaAnahtari } from '@/lib/site'
import stil from './Cekmece.module.css'

type Props = {
  dil: Dil
  aktif: RotaAnahtari
  acik: boolean
  kapat: () => void
  tetikleyiciRef: React.RefObject<HTMLButtonElement | null>
}

/**
 * Tam ekran mobil menü. Açıkken body kaydırması kilitlenir, Escape kapatır,
 * odak ilk linke gider ve kapsayıcı içinde döngüye alınır (focus trap),
 * kapanışta odak tetikleyiciye (hamburger) döner.
 *
 * Tasarımdaki bağlı link listesi Menü/Hikaye/Konum/Galeri/Rezervasyon'du;
 * Galeri ve Rezervasyon bu sitenin mimarisinde (RotaAnahtari, içerik
 * sözlüğü) karşılığı olmayan sayfalar, uydurulmadı. Gerçek üç rota
 * kullanıldı, bkz. task-6-report.md.
 */
export function Cekmece({ dil, aktif, acik, kapat, tetikleyiciRef }: Props) {
  const kapsayiciRef = useRef<HTMLDivElement>(null)
  const ilkLinkRef = useRef<HTMLAnchorElement>(null)
  const durum = useGirneSaati()
  const s = sozluk(dil)

  useEffect(() => {
    if (!acik) return
    const kapsayici = kapsayiciRef.current
    if (!kapsayici) return

    const oncekiTasma = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ilkLinkRef.current?.focus()

    const tuslar = (olay: KeyboardEvent) => {
      if (olay.key === 'Escape') {
        kapat()
        return
      }
      if (olay.key !== 'Tab') return
      const odaklanabilirler = Array.from(
        kapsayici.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      )
      const ilk = odaklanabilirler[0]
      const son = odaklanabilirler[odaklanabilirler.length - 1]
      if (!ilk || !son) return
      if (olay.shiftKey && document.activeElement === ilk) {
        olay.preventDefault()
        son.focus()
      } else if (!olay.shiftKey && document.activeElement === son) {
        olay.preventDefault()
        ilk.focus()
      }
    }

    document.addEventListener('keydown', tuslar)
    return () => {
      document.removeEventListener('keydown', tuslar)
      document.body.style.overflow = oncekiTasma
      tetikleyiciRef.current?.focus()
    }
  }, [acik, kapat, tetikleyiciRef])

  if (!acik) return null

  // Hydration güvenliği: mount öncesi/sonrası ilk render kapalı görünümle eşleşir.
  const acikMi = durum?.acik ?? false
  const linkler: { anahtar: RotaAnahtari; etiket: string }[] = [
    { anahtar: 'menu', etiket: s.ortak.nav.menu },
    { anahtar: 'hikaye', etiket: s.ortak.nav.hikaye },
    { anahtar: 'konum', etiket: s.ortak.nav.konum },
  ]

  return (
    <div ref={kapsayiciRef} className={stil.kap} role="dialog" aria-modal="true">
      <button
        type="button"
        className={stil.kapat}
        onClick={kapat}
        aria-label={s.ortak.erisim.menuyuKapat}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      <nav className={stil.linkler} aria-label={s.ortak.erisim.mobilGezinme}>
        {linkler.map((link, i) => (
          <Link
            key={link.anahtar}
            ref={i === 0 ? ilkLinkRef : undefined}
            href={yol(link.anahtar, dil)}
            className={stil.link}
            aria-current={link.anahtar === aktif ? 'page' : undefined}
          >
            {link.etiket}
          </Link>
        ))}
      </nav>

      <div className={stil.durumBlogu}>
        <div className={stil.durumSatiri}>
          <span aria-hidden="true" className={`${stil.nokta} ${acikMi ? stil.acikNokta : stil.kapaliNokta}`} />
          <span className={acikMi ? stil.acikMetin : stil.kapaliMetin}>
            {acikMi ? s.ortak.durum.acik : s.ortak.durum.kapali}
          </span>
        </div>
        <div className={stil.notMetin}>
          {s.ortak.satirlar.saatlerGunluk} · {s.ortak.alkolsuzKisa}
        </div>
      </div>
    </div>
  )
}
