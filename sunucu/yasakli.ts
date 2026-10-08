import { takmaAdKatla } from '../lib/oyun/takmaAd.ts'

/*
 * Yalnız sunucuda: ayrılmış adlar ve ölçülü bir TR/EN küfür listesi (spec §8). Katlanmış ad
 * üstünden bakılır; kısa kökler tam sözcük olarak (Kamil "am" değildir), uzunlar parça olarak.
 */
const AYRILMIS = ['bozo', 'cigercibozo', 'usta', 'admin'].map(takmaAdKatla)

const KISA = ['am', 'amk', 'aq', 'got', 'sik', 'pic', 'oc', 'ibne', 'fuck', 'shit', 'cunt', 'ass', 'dick', 'cock']
const UZUN = ['orospu', 'pezevenk', 'yarak', 'yarrak', 'amcik', 'sikik', 'sikis', 'siktir', 'gavat', 'kahpe',
  'bitch', 'nigger', 'faggot', 'whore', 'pussy', 'penis', 'vagina'].map(takmaAdKatla)

/** Adın katlanmış hali ayrılmışsa, küfür içeriyorsa ya da harfi kalmıyorsa true. */
export function yasakliMi(ad: string): boolean {
  const katlanmis = takmaAdKatla(ad)
  if (katlanmis.length === 0 || AYRILMIS.includes(katlanmis)) return true
  if (UZUN.some((kok) => katlanmis.includes(kok))) return true
  const sozcukler = ad.toLocaleLowerCase('tr').split(/[\s._-]+/).map(takmaAdKatla)
  return sozcukler.some((s) => KISA.includes(s))
}
