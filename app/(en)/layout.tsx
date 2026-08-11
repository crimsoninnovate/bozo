import { fontSiniflari } from '@/lib/fontlar'
import '../globals.css'

export default function EnKokLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontSiniflari}>
      <body>{children}</body>
    </html>
  )
}
