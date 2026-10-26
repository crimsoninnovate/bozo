import { isletme } from '../content/isletme.ts'
import { sozluk, type Sozluk } from '../content/index.ts'
import type { Dil } from '../content/types.ts'
import { acilisSpotu } from './menu/sayilar.ts'
import type { MenuBelgesi } from './menu/tipler.ts'
import { SITE_URL, tumYollar, type RotaAnahtari } from './site.ts'

function rotaEtiketi(s: Sozluk, anahtar: RotaAnahtari): string {
  const etiket = anahtar === 'ana' ? s.ortak.nav.anaSayfa : s.ortak.nav[anahtar]
  if (!etiket) throw new Error(`llmsTxt: "${anahtar}" için nav etiketi yok`)
  return etiket
}

function rotaSatirlari(dil: Dil, menu: MenuBelgesi): string[] {
  const s = sozluk(dil)
  return tumYollar().map(({ anahtar, tr, en }) => {
    const yolStr = dil === 'en' ? en : tr
    const aciklama = acilisSpotu(s.ortak.sayfaMeta[anahtar].aciklama, menu, dil)
    return `- [${rotaEtiketi(s, anahtar)}](${SITE_URL}${yolStr}): ${aciklama}`
  })
}

/** Menü kalemleri adlarıyla; tükenmiş kalem listede kalır ama "(bugün yok)" taşır. Fiyat yazılmaz. */
function menuSatirlari(b: MenuBelgesi): string[] {
  const satir = (ad: string, tukendi: boolean) => `- ${ad}${tukendi ? ' (bugün yok)' : ''}`
  return [
    ...b.kalemler.map((k) => satir(k.ad.tr, k.tukendi)),
    satir(b.ozel.ad.tr, false),
    ...b.icecekler.map((i) => satir(i.ad.tr, i.tukendi)),
  ]
}

/**
 * LLM/answer-engine özet dosyası (llms.txt kongre, https://llmstxt.org). Elle yazılmaz:
 * `sozluk()`/`tumYollar()`/`isletme`/menü belgesinden derlenir, tıpkı `sitemap.ts`/`robots.ts` gibi.
 */
export function llmsTxt(menu: MenuBelgesi): string {
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
    ...rotaSatirlari('tr', menu),
    '',
    '## English',
    '',
    ...rotaSatirlari('en', menu),
    '',
    '## Menü',
    '',
    ...menuSatirlari(menu),
    '',
  ].join('\n')
}
