'use client'

import { hareketAzaltilmisMi } from '@/lib/hareket'

type Props = {
  href: string
  className: string
  children: React.ReactNode
}

/**
 * Sayfa içi çapaya giden bağlantı, yumuşak kaydırmayla.
 *
 * `html { scroll-behavior: smooth }` 13 Ağustos 2026'da kaldırıldı: Next'in
 * rota değişimi sonrası yaptığı konum düzeltmesini görünür bir yolculuğa
 * çeviriyordu (ölçüm `styles/reset.css`'te). Yumuşaklık yalnız gerçekten
 * istendiği yerde, JS'te veriliyor; desen `BeadRay` ile aynı.
 *
 * `scrollIntoView` seçildi çünkü `scroll-margin-top`u kendisi hesaba katıyor:
 * sabit üst barın payı `Kabuk`un verdiği CSS'te duruyor, burada tekrar edilmez.
 *
 * Varsayılan davranış engellenmiyor sayılmaz: `preventDefault` sonrası adres
 * çubuğuna hash yazılır, yoksa bağlantı paylaşılabilir bir hedef olmaktan çıkar.
 */
export function CapaBaglantisi({ href, className, children }: Props) {
  const tikla = (olay: React.MouseEvent<HTMLAnchorElement>) => {
    // Yeni sekme, indirme ve sağ tık gibi değiştirilmiş tıklamalar tarayıcıya kalır.
    if (olay.defaultPrevented || olay.metaKey || olay.ctrlKey || olay.shiftKey || olay.button !== 0) {
      return
    }
    const hedef = document.querySelector(href)
    if (!hedef) return
    olay.preventDefault()
    hedef.scrollIntoView({
      behavior: hareketAzaltilmisMi() ? 'auto' : 'smooth',
      block: 'start',
    })
    history.pushState(null, '', href)
  }

  return (
    <a className={className} href={href} onClick={tikla}>
      {children}
    </a>
  )
}
