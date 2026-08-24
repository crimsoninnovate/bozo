import { fontSiniflari } from '@/lib/fontlar'
import { restaurantJsonLd, menuJsonLd } from '@/lib/jsonld'
import '../globals.css'
import { CerezOnayi } from '@/components/layout/CerezOnayi'

export default function TrKokLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={fontSiniflari}>
      <body>
        <script
          type="application/ld+json"
          // Tek işletme, tek gerçek: iki kök layout da aynı yapısal veriyi basar.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd('tr')) }}
        />
        {children}
        <CerezOnayi dil="tr" />
      </body>
    </html>
  )
}
