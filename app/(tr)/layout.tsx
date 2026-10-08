import { fontSiniflari } from '@/lib/fontlar'
import { jsonLdMetni, restaurantJsonLd } from '@/lib/jsonld'
import '../globals.css'
import { CerezOnayi } from '@/components/layout/CerezOnayi'

export default function TrKokLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={fontSiniflari}>
      <body>
        <script
          type="application/ld+json"
          // Tek işletme, tek gerçek: iki kök layout da aynı yapısal veriyi basar.
          dangerouslySetInnerHTML={{ __html: jsonLdMetni(restaurantJsonLd()) }}
        />
        {children}
        <CerezOnayi dil="tr" />
      </body>
    </html>
  )
}
