import { sozluk, type Dil } from '@/content'

type Props = { dil: Dil }

/** Yer tutucu gövde. Görev 14 bunu gizlilik sayfasının gerçek metniyle doldurur. */
export function GizlilikSayfasi({ dil }: Props) {
  const s = sozluk(dil)
  return <h1>{s.ortak.nav.gizlilik}</h1>
}
