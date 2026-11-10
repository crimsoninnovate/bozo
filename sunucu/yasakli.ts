import { takmaAdKatla } from '../lib/oyun/takmaAd.ts'

/*
 * Yalnız sunucuda: ayrılmış adlar ve ölçülü bir TR/EN küfür listesi (spec §8). Katlanmış ad
 * üstünden bakılır; kısa kökler tam sözcük olarak (Kamil "am" değildir), uzunlar parça olarak.
 */
const AYRILMIS = ['bozo', 'cigercibozo', 'usta', 'admin'].map(takmaAdKatla)

const KISA = ['am', 'amk', 'aq', 'got', 'sik', 'pic', 'oc', 'ibne', 'fuck', 'shit', 'cunt', 'ass', 'dick', 'cock']
const UZUN = ['orospu', 'pezevenk', 'yarak', 'yarrak', 'amcik', 'sikik', 'sikis', 'siktir', 'gavat', 'kahpe',
  'bitch', 'nigger', 'faggot', 'whore', 'pussy', 'penis', 'vagina'].map(takmaAdKatla)

// Latin harfine benzeyen Kiril ve Yunan harfleri: "bоzо" (Kiril о) ekranda "bozo" okunur.
const BENZER: Record<string, string> = {
  а: 'a', в: 'b', е: 'e', ё: 'e', к: 'k', м: 'm', н: 'h', о: 'o', р: 'p', с: 'c', т: 't', у: 'y', х: 'x',
  і: 'i', ї: 'i', ј: 'j', ѕ: 's', ԁ: 'd', α: 'a', β: 'b', ε: 'e', η: 'n', ι: 'i', κ: 'k', ν: 'v',
  ο: 'o', ρ: 'p', τ: 't', υ: 'u', χ: 'x', ω: 'w',
}

/** Tam genişlik ve aksanlar açılır, benzer harfler Latin'e döner; yalnız yasak denetimi için. */
function benzerleriAc(ad: string): string {
  const kucuk = ad.normalize('NFKC').toLocaleLowerCase('tr').normalize('NFD').replace(/\p{M}/gu, '')
  return [...kucuk].map((h) => BENZER[h] ?? h).join('')
}

/** Adın katlanmış hali ayrılmışsa, küfür içeriyorsa ya da harfi kalmıyorsa true. */
export function yasakliMi(ad: string): boolean {
  // Boşluk denetimi asıl katlamayla: benzersizlik anahtarı odur (Latin harfi olmayan ad boş katlanır).
  if (takmaAdKatla(ad).length === 0) return true
  const acik = benzerleriAc(ad)
  const katlanmis = takmaAdKatla(acik)
  if (AYRILMIS.includes(katlanmis) || UZUN.some((kok) => katlanmis.includes(kok))) return true
  const sozcukler = acik.split(/[\s._-]+/).map(takmaAdKatla)
  return sozcukler.some((s) => KISA.includes(s))
}
