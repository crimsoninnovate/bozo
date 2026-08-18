import { useId } from 'react'
import { ArrowDown, ArrowRight, Clock, MapPin, Phone, UtensilsCrossed } from 'lucide-react'
import stil from './Ikonlar.module.css'

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
 * WhatsApp ve Instagram marka işaretidir ve kendi renginde durur (sahibi,
 * 18 Ağustos 2026: tanınırlık); geometri simple-icons (CC0) ve lucide-static'ten.
 */
export function PinIkon({ boy = 16 }: Props) {
  return <MapPin size={boy} aria-hidden="true" />
}

export function TelefonIkon({ boy = 16 }: Props) {
  return <Phone size={boy} aria-hidden="true" />
}

/** Telefonlu balon, WhatsApp yeşili. Lucide'ın genel balonu 13-18 Ağustos arasında durdu. */
export function WhatsAppIkon({ boy = 16 }: Props) {
  return (
    <svg width={boy} height={boy} viewBox="0 0 24 24" className={stil.whatsapp} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

/** Saat satırlarının ikonu; çekmecede "Her gün 10:00 - 05:00" satırının başında. */
export function SaatIkon({ boy = 16 }: Props) {
  return <Clock size={boy} aria-hidden="true" />
}

/**
 * Lucide v1 marka ikonlarını kaldırdı, `Instagram` pakette yok. Geometri
 * `lucide-static`'in kendi instagram.svg'sinden birebir (ISC), çizgi Instagram
 * gradyanı. Gradyan `userSpaceOnUse`: nokta çizgisinin kutusu sıfır genişlikte,
 * kutuya bağlı gradyan orada boyamaz. Kimlik `useId`: sayfada birden çok işaret var.
 */
export function InstagramIkon({ boy = 16 }: Props) {
  const gradyanId = useId()
  return (
    <svg
      width={boy}
      height={boy}
      viewBox="0 0 24 24"
      fill="none"
      stroke={`url(#${gradyanId})`}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradyanId} gradientUnits="userSpaceOnUse" x1="2" y1="22" x2="22" y2="2">
          <stop offset="0" className={stil.instagram1} />
          <stop offset="0.3" className={stil.instagram2} />
          <stop offset="0.55" className={stil.instagram3} />
          <stop offset="0.8" className={stil.instagram4} />
          <stop offset="1" className={stil.instagram5} />
        </linearGradient>
      </defs>
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

/**
 * Gezinme okları, yalnız `Buton`un `ok` propu için. Sayfaya giden buton sağa,
 * sayfa içi çapaya giden buton aşağı gösterir: ikisi farklı hareket.
 */
export function OkSagIkon({ boy = 16 }: Props) {
  return <ArrowRight size={boy} aria-hidden="true" />
}

export function OkAsagiIkon({ boy = 16 }: Props) {
  return <ArrowDown size={boy} aria-hidden="true" />
}
