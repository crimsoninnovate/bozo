import { Acilis } from './menu/Acilis'
import { Icecekler } from './menu/Icecekler'
import { Ikramlar } from './menu/Ikramlar'
import { Ocaktan } from './menu/Ocaktan'
import type { Dil } from '@/content'

type Props = { dil: Dil }

/**
 * Menü sayfasının gövdesi. Menu Sayfasi.dc.html:63-281
 *
 * Bu sayfa `Bolum` KULLANMAZ. Tasarım taraması: `data-erit` ve `data-yogunluk`
 * `Menu Sayfasi.dc.html`'de sıfır kez geçiyor (Ana Sayfa'da sekizer kez).
 * Kaydırmaya bağlı erime ve yükselme ana sayfaya ait bir davranış; burada düz
 * `<section>` var.
 *
 * Çapa payı da bölümlerde değil: `Kabuk`, ana sayfa dışındaki rotalarda
 * `<main>`'e `.icSayfa` sınıfını basıyor ve o sınıf id taşıyan her torununa
 * `scroll-margin-top: 96px` veriyor (Menu:347'nin `- 96` değeri). Bölümlerin
 * tek görevi doğru id'yi taşımak: `#ocaktan`, `#ikramlar`, `#icecekler`, üçü de
 * üst barın bu sayfadaki nav hedefleri.
 *
 * Footer bu ağaçta değil: menü sayfasının kompakt şeridi `Kabuk` > `AltBilgi`
 * varyantlarından geliyor (Menu:283-292).
 */
export function MenuSayfasi({ dil }: Props) {
  return (
    <>
      <Acilis dil={dil} />
      <Ocaktan dil={dil} />
      <Ikramlar dil={dil} />
      <Icecekler dil={dil} />
    </>
  )
}
