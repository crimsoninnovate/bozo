import { Bricolage_Grotesque, Inter } from 'next/font/google'

// latin-ext zorunlu: ğ Ğ ş Ş İ bu alt kümede. ı ç ö ü latin alt kümesinde.
export const bricolage = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-bricolage',
})

export const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
})

export const fontSiniflari = `${bricolage.variable} ${inter.variable}`
