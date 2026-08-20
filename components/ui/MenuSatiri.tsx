import stil from './MenuSatiri.module.css'

type Props = {
  ad: string
  aciklama: string
}

/**
 * Ana sayfanın "Ocakbasi" listesindeki tek satır. UYGULAMA-NOTLARI 3.
 *
 * Tasarımın (Ana:176-214) fiyat sütunu ve üçlü tane rayı KALKTI:
 * - fiyat sütunu yayında beş kez `000 TL` basıyordu, yer tutucu bir rakam
 *   fiyat listesinin kendisinden daha kötü bir bilgi (bkz. 1.1).
 * - üçlü ray beş satırın beşinde de aynıydı, yani bilgi taşımıyordu.
 *
 * Fiyatlar 13 Ağustos 2026'da geldi ve **geri gelmiyorlar**: sahibi ana sayfanın
 * beş ürün adı artı menüye giden tek CTA olarak kalmasını istedi. UYGULAMA-NOTLARI
 * 1.1'in "fiyatlar kesinleşince rakamlar satırların sağına döner" planı bu kararla
 * kapandı. Satırlara fiyat eklemeyin.
 *
 * SIRA NUMARASI KALKTI (sahibi, 20 Ağustos 2026). Masaüstünde sessiz bir indeksti
 * ama telefonda ızgara tek kolona indiği için numara adın ÜSTÜNE, kendi satırına
 * düşüyordu ve liste "hepsini sırayla almak gerekiyor" gibi okunuyordu. Yerine
 * başka bir süs konmadı: beş satırda tekrar eden bir işaret bilgi taşımaz, aynı
 * gerekçeyle üçlü tane rayı da bu satırdan kaldırılmıştı. `<ol>` da `<ul>` oldu,
 * çünkü sıra anlamlı değil.
 *
 * Satır interaktif DEĞİL: tasarım `cursor:pointer` veriyor ama hiçbir hedef
 * vermiyor. Sahte tıklanabilirlik izlenimi vermemek için imleç değişmez;
 * hover'ın kayma ve zemin geri bildirimi korunur.
 */
export function MenuSatiri({ ad, aciklama }: Props) {
  return (
    <li className={stil.satir}>
      <span className={stil.ad}>{ad}</span>
      <span className={stil.aciklama}>{aciklama}</span>
    </li>
  )
}
