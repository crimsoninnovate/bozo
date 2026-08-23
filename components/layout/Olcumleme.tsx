import Script from 'next/script'

/** GA4 ölçüm kimliği; akış "BozoWeb", https://cigercibozo.com, akış no 15488960965. */
const OLCUM_KIMLIGI = 'G-N3893E7B1P'

const BASLATMA = [
  'window.dataLayer = window.dataLayer || [];',
  'function gtag(){dataLayer.push(arguments);}',
  "gtag('js', new Date());",
  "gtag('config', '" + OLCUM_KIMLIGI + "');",
].join('\n')

/**
 * Google Analytics 4. DOĞRUDAN BASILMAZ: `CerezOnayi` onu yalnız onay "kabul"
 * iken basar, yani etiket onaysız DOM'a hiç girmez. Gerekçe KKTC 89/2007
 * Madde 11(2)(A): yurt dışına aktarım kişinin onayına bağlı.
 *
 * `afterInteractive`: etiket ilk boyamayı bekletmez. Statik export'ta
 * `next/script` etiketi istemcide enjekte eder, yani HTML kaynağında değil
 * çalışma anında görünür.
 *
 * Ölçümün gizlilik sayfasındaki karşılığı `content/*` altındaki `gizlilik.ts`
 * dosyalarında; araç değişirse orası da değişmek zorunda.
 */
export function Olcumleme() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${OLCUM_KIMLIGI}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: BASLATMA }} />
    </>
  )
}
