import { KorSahnesi } from '@/components/ember/KorSahnesi'
import { AltBilgi } from '@/components/layout/AltBilgi'
import { MobilAksiyonBari } from '@/components/layout/MobilAksiyonBari'
import { UstBar } from '@/components/layout/UstBar'
import { sozluk, type Dil } from '@/content'
import { breadcrumbJsonLd, jsonLdMetni, menuJsonLd } from '@/lib/jsonld'
import type { RotaAnahtari } from '@/lib/site'
import stil from './Kabuk.module.css'

/** Atlanan blok bağlantısının hedefi; `<main>` ile bağlantının tek ortak değeri. */
const ICERIK_ID = 'icerik'

type Props = {
  dil: Dil
  aktif: RotaAnahtari
  children: React.ReactNode
}

/**
 * On iki rotanın ortak kabuğu: kor sahnesi, üst bar, sayfa gövdesi, alt bilgi ve
 * mobil eylem barı. Her `app/**\/page.tsx` bunu bir kez sarmalar.
 *
 * `UstBar` (nav listesi, CTA hedefi, bar ölçüsü) ve `KorSahnesi` (yoğunluk
 * takibi) rotaya göre değişir, alt bilgi değişmez (tek varyant kaldı); App Router
 * layout'ları sayfanın kendi prop'larını almaz, bu yüzden bu bilgi kök
 * `layout.tsx` dosyalarında değil, burada, her sayfanın zaten bildiği `aktif`
 * değerinden geçirilir. Hangi rotanın hangi varyantı aldığı `lib/kabuk.ts`
 * içinde tek tabloda, kaynak satırlarıyla birlikte durur.
 *
 * `<main>`'in iç sayfa sınıfı yalnız çapa payını taşır (bkz. Kabuk.module.css);
 * ana sayfa payını `Bolum` kendi içinde verir.
 *
 * Atlanan blok bağlantısı ilk odak durağıdır ve üst barın yedi hedefini atlar.
 * `tabIndex={-1}` olmadan Safari fragman bağlantısında sıralı odak başlangıcını
 * taşımaz, yani bağlantı kaydırır ama sonraki Tab yine bara döner.
 */
export function Kabuk({ dil, aktif, children }: Props) {
  const anaSayfaMi = aktif === 'ana'
  const s = sozluk(dil)

  return (
    <>
      <a href={`#${ICERIK_ID}`} className={stil.atla}>
        {s.ortak.erisim.icerigeAtla}
      </a>
      {!anaSayfaMi && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMetni(breadcrumbJsonLd(aktif, dil)) }}
        />
      )}
      {aktif === 'menu' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMetni(menuJsonLd(dil)) }}
        />
      )}
      <KorSahnesi varyant={anaSayfaMi ? 'ana' : 'ic'} />
      <UstBar dil={dil} aktif={aktif} />
      <main id={ICERIK_ID} tabIndex={-1} className={anaSayfaMi ? undefined : stil.icSayfa}>
        {children}
      </main>
      <AltBilgi dil={dil} aktif={aktif} />
      <MobilAksiyonBari dil={dil} />
    </>
  )
}
