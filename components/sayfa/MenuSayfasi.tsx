import { sozluk, type Dil } from '@/content'

type Props = { dil: Dil }

/** Yer tutucu gövde. Görev 11 bunu menü sayfasının gerçek içeriğiyle doldurur. */
export function MenuSayfasi({ dil }: Props) {
  const s = sozluk(dil)
  return <h1>{s.ortak.nav.menu}</h1>
}
