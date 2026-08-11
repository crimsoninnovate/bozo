import { fontSiniflari } from '@/lib/fontlar'
import { restaurantJsonLd } from '@/lib/jsonld'
import '../globals.css'

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
      </body>
    </html>
  )
}
