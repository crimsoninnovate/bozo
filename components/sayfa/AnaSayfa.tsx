import { sozluk, type Dil } from '@/content'

type Props = { dil: Dil }

/** Yer tutucu gövde. Görev 9 ve 10 bunu ana sayfanın gerçek bölümleriyle doldurur. */
export function AnaSayfa({ dil }: Props) {
  const s = sozluk(dil)
  return <h1>{s.ortak.nav.anaSayfa}</h1>
}
