import { Acilis } from './konum/Acilis'
import { Harita } from './konum/Harita'
import { SaatlerVeIletisim } from './konum/SaatlerVeIletisim'
import type { Dil } from '@/content'

type Props = { dil: Dil }

/**
 * Konum sayfasının gövdesi. Konum Sayfasi.dc.html:63-164
 *
 * Bu sayfa `Bolum` KULLANMAZ: `data-erit` ve `data-yogunluk` bu tasarım
 * dosyasında sıfır kez geçiyor (Ana Sayfa'da sekizer kez). Kaydırmaya bağlı
 * erime ve yükselme ana sayfaya ait; burada düz `<section>` var.
 *
 * Çapa payı da bölümde değil: `Kabuk`, ana sayfa dışındaki rotalarda `<main>`'e
 * `.icSayfa` sınıfını basıyor ve o sınıf id taşıyan her torununa
 * `scroll-margin-top: 96px` veriyor (Konum:252'nin `- 96` değeri). Bölümün tek
 * görevi `#harita` id'sini taşımak; hem üst barın CTA'sı hem hero'nun birincil
 * butonu oraya gidiyor.
 *
 * Varsayılan hal Konum'unki olduğu için prop geçilmez.
 *
 * Footer bu ağaçta değil: Konum'un "Sayfalar" kolonlu footer'ı `Kabuk` >
 * `AltBilgi` varyantlarından geliyor (Konum:166-194).
 */
export function KonumSayfasi({ dil }: Props) {
  return (
    <>
      <Acilis dil={dil} />
      <Harita dil={dil} />
      <SaatlerVeIletisim dil={dil} />
    </>
  )
}
