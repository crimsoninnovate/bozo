import { isletme } from '../content/isletme.ts'
import { sozluk, type Sozluk } from '../content/index.ts'
import type { Dil } from '../content/types.ts'
import { SITE_URL, tumYollar, type RotaAnahtari } from './site.ts'

function rotaEtiketi(s: Sozluk, anahtar: RotaAnahtari): string {
  const nav = s.ortak.nav as Record<string, string>
  const etiket = anahtar === 'ana' ? nav.anaSayfa : nav[anahtar]
  if (!etiket) throw new Error(`llmsTxt: "${anahtar}" için nav etiketi yok`)
  return etiket
}

function rotaSatirlari(dil: Dil): string[] {
  const s = sozluk(dil)
  return tumYollar().map(({ anahtar, tr, en }) => {
    const yolStr = dil === 'en' ? en : tr
    const aciklama = s.ortak.sayfaMeta[anahtar].aciklama
    return `- [${rotaEtiketi(s, anahtar)}](${SITE_URL}${yolStr}): ${aciklama}`
  })
}

/**
 * LLM/answer-engine'lerin siteyi hızlı taraması için olgusal özet (llms.txt kongre,
 * https://llmstxt.org). Elle yazılmaz: `sozluk()`, `tumYollar()` ve `isletme`'den derlenir,
 * tıpkı `app/sitemap.ts`/`app/robots.ts` gibi; bir rota eklenip burası unutulursa dosya
 * sessizce bayatlamaz.
 */
export function llmsTxt(): string {
  const s = sozluk('tr')
  const ozet =
    `${isletme.ad}, ${isletme.kategori}. ${s.ortak.satirlar.adresKisa}. ` +
    `${s.ortak.satirlar.saatlerUzun} açık. ${s.ortak.alkolsuzKisa}.`

  return [
    `# ${isletme.ad}`,
    '',
    `> ${ozet}`,
    '',
    '## Türkçe',
    '',
    ...rotaSatirlari('tr'),
    '',
    '## English',
    '',
    ...rotaSatirlari('en'),
    '',
  ].join('\n')
}
