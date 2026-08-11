import { fontSiniflari } from '@/lib/fontlar'
import '../globals.css'

export default function TrKokLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={fontSiniflari}>
      <body>{children}</body>
    </html>
  )
}
