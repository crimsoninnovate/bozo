import Image from 'next/image'
import { fotograflar } from '@/content/fotograflar'
import type { Dil, FotoId } from '@/content/types'
import stil from './FotoYuvasi.module.css'

/**
 * Tasarımda iki plaka ailesi var.
 *
 * Pencere ailesi (kendi zemini yok, arkasındaki kor sahnesine açılır):
 *   portre     Ana:148 iddia, Ana:283 bozo
 *   portreUzun Hikaye:73, yanındaki kartla birlikte uzasın diye min-height
 *   genis      Ana:236 ikram, ortalanmış etiket
 *
 * Ocak ailesi (--plaka-zemin, kor lekesi, vinyet, taşma gizli):
 *   spread Menu:94, kart Menu:126, ikram Menu:207, icecek Menu:239, karo Menu:271
 */
export type YuvaBicimi = 'portre' | 'portreUzun' | 'genis' | 'spread' | 'kart' | 'ikram' | 'icecek' | 'karo'

/** Tasarımın her biçimde kaç köşe işareti kullandığı. */
const VARSAYILAN_KOSE: Record<YuvaBicimi, 0 | 1 | 2 | 4> = {
  portre: 4,
  portreUzun: 4,
  genis: 2,
  spread: 2,
  kart: 1,
  ikram: 0,
  icecek: 0,
  karo: 0,
}

/** Kor lekesi ve vinyet yalnız ocak ailesinde var. */
const OCAK_AILESI: ReadonlySet<YuvaBicimi> = new Set<YuvaBicimi>(['spread', 'kart', 'ikram', 'icecek', 'karo'])

/**
 * Bir plakanın kor nefesinin süresi ve gecikmesi, saniye.
 *
 * Tasarım her plakaya kendi zamanlamasını veriyor: ürün kartları 10s/.6s,
 * 11s/1.2s, 9.5s/1.8s, 12s/2.4s (Menu:126, 144, 162, 180) ve ikramlar 11s/0
 * ile 12s/1.5s (Menu:207, 219). Dört plakanın birlikte nefes alması mekanik
 * görünürdü; kayık ve farklı periyotlu olunca birbirinden bağımsız korlar gibi
 * okunuyor, sahnenin bütün amacı da bu.
 *
 * Gecikmeler kartlarda index * 0.6s kuralına uyuyor ama SÜRELER hiçbir kurala
 * uymuyor (9, 9.5, 10, 11, 11, 12, 12, 13) ve ikramların gecikmesi de (0, 1.5)
 * o kuralı bozuyor. Bu yüzden index değil, değer geçilir: index'ten türetmek
 * yalnız kart gecikmelerinde çalışan, ilk yeni plakada kırılan sahte bir
 * soyutlama olurdu.
 */
export type KorNefesi = { sure: number; gecikme?: number }

type Props = {
  id: FotoId
  dil: Dil
  bicim: YuvaBicimi
  /** Biçimin varsayılanını ezmek gerekirse. Tasarımda 0, 1, 2 ve 4 köşe var. */
  koseIsaretleri?: 0 | 1 | 2 | 4
  /**
   * Bu örneğin kor nefesi. Verilmezse biçimin tasarımdaki ilk örneğinin
   * zamanlaması kullanılır, yani hiç geçmeyen bir çağrı da doğru basar.
   */
  korNefesi?: KorNefesi
  /**
   * Plakanın içine mutlak konumlanan katman: iddia plakasının ortasındaki tane
   * rayı (Ana:149) ve menü kartının sağ üst indeks rozeti (Menu:131). Konumu
   * çağıran verir, plaka yalnız `position: relative` zeminini sağlar.
   */
  children?: React.ReactNode
}

function korNefesiStili(nefes: KorNefesi | undefined): React.CSSProperties | undefined {
  if (!nefes) return undefined
  return { animationDuration: `${nefes.sure}s`, animationDelay: `${nefes.gecikme ?? 0}s` }
}

export function FotoYuvasi({ id, dil, bicim, koseIsaretleri, korNefesi, children }: Props) {
  const foto = fotograflar[id]
  const etiket = dil === 'en' ? foto.etiketEn : foto.etiket

  if (foto.dosya) {
    return (
      <div className={`${stil.kap} ${stil[bicim]}`}>
        <Image src={foto.dosya} alt={etiket} fill className={stil.gorsel} sizes="(max-width: 800px) 100vw, 50vw" />
        {children}
      </div>
    )
  }

  const koseSayisi = koseIsaretleri ?? VARSAYILAN_KOSE[bicim]
  // Köşe sınıfları açık dizi olarak tutulur; şablon dizgisiyle indekslemek
  // noUncheckedIndexedAccess altında string | undefined döndürür ve derlemez.
  // Sıra kritik: tek köşeli varyant sol-üstü, iki köşeli varyant sol-üst ile
  // sağ-altı kullanır, bitişik ikisini değil.
  const koseSiniflari = [stil.solUst, stil.sagAlt, stil.sagUst, stil.solAlt]

  return (
    <div className={`${stil.kap} ${stil[bicim]}`}>
      {OCAK_AILESI.has(bicim) && (
        <>
          {/* Satır içi zamanlama yalnız süre ve gecikmeyi ezer; animasyon adı,
              yumuşama ve yineleme CSS'te kalır. Hareket azaltılmışta
              animasyonlar.css'in `animation: none !important` kuralı kazanır. */}
          <span aria-hidden="true" className={stil.kor} style={korNefesiStili(korNefesi)} />
          <span aria-hidden="true" className={stil.vinyet} />
        </>
      )}
      {koseSiniflari.slice(0, koseSayisi).map((koseSinif) => (
        <span key={koseSinif} aria-hidden="true" className={`${stil.kose} ${koseSinif}`} />
      ))}
      <span className={stil.etiket}>
        <span aria-hidden="true" className={stil.etiketCizgi} />
        {etiket}
      </span>
      {children}
    </div>
  )
}
