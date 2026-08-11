import { sozluk, type Dil } from '@/content'

type Props = { dil: Dil }

/** Yer tutucu gövde. Görev 12 bunu hikaye sayfasının gerçek içeriğiyle doldurur. */
export function HikayeSayfasi({ dil }: Props) {
  const s = sozluk(dil)
  return <h1>{s.ortak.nav.hikaye}</h1>
}
