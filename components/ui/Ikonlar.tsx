import { MapPin, MessageCircle, Phone, UtensilsCrossed } from 'lucide-react'

type Props = {
  boy?: number
}

/**
 * İkonlar tek kaynaktan: `lucide-react`. Elle çizilen önceki set tutarsızdı,
 * üçü dolu biri çizgiydi ve ağırlıkları tutmuyordu; sahibi 13 Ağustos 2026'da
 * değiştirilmesini istedi.
 *
 * Sarmalayıcılar duruyor: çağıranlar Türkçe adı ve `boy` propunu koruyor, yani
 * altı dosyanın hiçbiri değişmiyor ve ileride ikon değiştirmek tek satır.
 *
 * WhatsApp'ın Lucide'da marka işareti yok (kütüphane marka logosu taşımıyor).
 * `MessageCircle` kullanıldı; her çağrıldığı yerde yanında "WhatsApp" etiketi
 * var, yani tanınırlık etiketten geliyor.
 */
export function PinIkon({ boy = 16 }: Props) {
  return <MapPin size={boy} aria-hidden="true" />
}

export function TelefonIkon({ boy = 16 }: Props) {
  return <Phone size={boy} aria-hidden="true" />
}

export function WhatsAppIkon({ boy = 16 }: Props) {
  return <MessageCircle size={boy} aria-hidden="true" />
}

/**
 * Lucide v1 marka ikonlarını kaldırdı, `Instagram` pakette yok. Geometri
 * `lucide-static`'in kendi instagram.svg'sinden birebir (ISC), böylece set
 * tek dilde kalıyor.
 */
export function InstagramIkon({ boy = 16 }: Props) {
  return (
    <svg
      width={boy}
      height={boy}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

/** Menü sayfasının ikonu. Bu sitede "menü" yemek listesidir, gezinme değil. */
export function SofraIkon({ boy = 16 }: Props) {
  return <UtensilsCrossed size={boy} aria-hidden="true" />
}
