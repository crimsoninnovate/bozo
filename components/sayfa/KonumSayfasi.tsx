import { sozluk, type Dil } from '@/content'

type Props = { dil: Dil }

/** Yer tutucu gövde. Görev 13 bunu konum sayfasının gerçek içeriğiyle doldurur. */
export function KonumSayfasi({ dil }: Props) {
  const s = sozluk(dil)
  return <h1>{s.ortak.nav.konum}</h1>
}
