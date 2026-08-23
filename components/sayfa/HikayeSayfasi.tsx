import type { Dil } from '@/content'
import { Acilis } from './hikaye/Acilis'
import { Anlati } from './hikaye/Anlati'
import { Lakap } from './hikaye/Lakap'
import { Portre } from './hikaye/Portre'
import { Sofra } from './hikaye/Sofra'
import { Usul } from './hikaye/Usul'

type Props = { dil: Dil }

/**
 * Hikaye sayfasının gövdesi: beş bölüm, düz akış.
 *
 * SIRA 24 Ağustos 2026'da değişti: `Lakap` anlatının ÖNÜNE alındı. Adın hikayesi
 * sayfanın en özgün malzemesi ve ortada kalıyordu; ayrıca `Portre`nin notu
 * ("Adın hikayesi hemen aşağıda") ancak bu sırayla doğru oluyor.
 *
 * `Bolum` bilinçli olarak kullanılmıyor: `data-erit` ve `data-yogunluk` bu
 * tasarım dosyasında sıfır kez geçiyor, yani ne erime hesabı ne kor sahnesi
 * yoğunluğu bu sayfaya ait. Bölümler düz `<section>`.
 *
 * Sayfada çapa yok (tasarımda hiçbir bölüm `id` taşımıyor ve Hikaye'nin üst
 * barı sayfa içi hedef basmıyor), o yüzden `Kabuk`'un 96px'lik çapa payı bu
 * sayfada hiçbir şeye denk gelmiyor.
 */
export function HikayeSayfasi({ dil }: Props) {
  return (
    <>
      <Acilis dil={dil} />
      <Portre dil={dil} />
      <Lakap dil={dil} />
      <Anlati dil={dil} />
      <Usul dil={dil} />
      <Sofra dil={dil} />
    </>
  )
}
