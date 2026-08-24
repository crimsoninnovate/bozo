import { fontSiniflari } from '@/lib/fontlar'
import { restaurantJsonLd } from '@/lib/jsonld'
import '../globals.css'
import { CerezOnayi } from '@/components/layout/CerezOnayi'

export default function EnKokLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontSiniflari}>
      <body>
        <script
          type="application/ld+json"
          // Single business, single fact: both root layouts print the same structured data.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
        />
        {children}
        <CerezOnayi dil="en" />
      </body>
    </html>
  )
}
