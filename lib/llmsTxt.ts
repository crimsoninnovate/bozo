import { isletme } from '../content/isletme.ts'
import { sozluk, type Sozluk } from '../content/index.ts'
import type { Dil } from '../content/types.ts'
import { SITE_URL, tumYollar, type RotaAnahtari } from './site.ts'

function rotaEtiketi(s: Sozluk, anahtar: RotaAnahtari): string {
  const etiket = anahtar === 'ana' ? s.ortak.nav.anaSayfa : s.ortak.nav[anahtar]
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
 * LLM/answer-engine özet dosyası (llms.txt kongre, https://llmstxt.org). Elle yazılmaz:
 * `sozluk()`/`tumYollar()`/`isletme`'den derlenir, tıpkı `sitemap.ts`/`robots.ts` gibi.
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
