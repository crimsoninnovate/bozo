import { fontSiniflari } from '@/lib/fontlar'
import { restaurantJsonLd } from '@/lib/jsonld'
import '../globals.css'

export default function TrKokLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={fontSiniflari}>
      <body>
        <script
          type="application/ld+json"
          // Tek işletme, tek gerçek: iki kök layout da aynı yapısal veriyi basar.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
        />
        {children}
      </body>
    </html>
  )
}
