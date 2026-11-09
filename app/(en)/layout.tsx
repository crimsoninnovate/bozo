import { fontSiniflari } from '@/lib/fontlar'
import { isletme } from '@/content/isletme'
import { jsonLdMetni, restaurantJsonLd } from '@/lib/jsonld'
import { derlenmisSaatler } from '@/lib/menu/saatEnv'
import '../globals.css'
import { CerezOnayi } from '@/components/layout/CerezOnayi'

export default function EnKokLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontSiniflari}>
      <body>
        <script
          type="application/ld+json"
          // Single business, single fact: both root layouts print the same structured data.
          dangerouslySetInnerHTML={{ __html: jsonLdMetni(restaurantJsonLd(isletme, derlenmisSaatler())) }}
        />
        {children}
        <CerezOnayi dil="en" />
      </body>
    </html>
  )
}
