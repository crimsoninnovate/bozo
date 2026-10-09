import { BUTCE, EVRELER, ILK_MISAFIRLER, RAF } from './ayar.ts'
import { karistir, rastgele, type Rastgele } from './rastgele.ts'
import type { Kalem, Misafir } from './tipler.ts'

type FisTaslagi = { fis: Kalem[]; karisik: boolean }

/** Bir evrenin fişleri: şişler boylara dağıtılır, eşlikçiler en küçük fişlerden başlayarak birer tane eklenir. */
function evreFisleri(evre: number, r: Rastgele): FisTaslagi[] {
  const butce = BUTCE[evre - 1]
  if (!butce) throw new RangeError(`bütçesi olmayan evre: ${evre}`)
  const sisler = karistir([...butce.sisler], r)
  const fisler: FisTaslagi[] = [...butce.sisBoylari]
    .sort((a, b) => a - b)
    .map((boy) => ({ fis: sisler.splice(0, boy), karisik: false }))
  karistir([...butce.eslikciler], r).forEach((e, i) => fisler[i]?.fis.push(e))
  karistir(fisler, r)
  if (butce.karisik) {
    const fis: Kalem[] = butce.karisik.eslikci ? [...RAF, butce.karisik.eslikci] : [...RAF]
    fisler.splice(r.tam(0, fisler.length), 0, { fis, karisik: true })
  }
  return fisler
}

/** Geliş tikleri: aralığın ortası, ±%20 oynama; evre sınırları içinde kalır. */
function gelisTikleri(evre: number, adet: number, r: Rastgele): number[] {
  const butce = BUTCE[evre - 1]
  const ayar = EVRELER[evre]
  if (!butce || !ayar) throw new RangeError(`tanımsız evre: ${evre}`)
  const oyna = Math.floor(butce.aralik / 5)
  return Array.from({ length: adet }, (_, i) => {
    return ayar.baslangic + Math.floor((butce.aralik * (2 * i + 1)) / 2) + r.tam(-oyna, oyna)
  })
}

/** İki Bozo Karışık art arda gelmez: gelirse ikincisi bir sonraki fişle yer değiştirir. */
function karisigiAyir(fisler: FisTaslagi[]): void {
  for (let i = 1; i < fisler.length; i++) {
    const once = fisler[i - 1]
    const simdi = fisler[i]
    const sonra = fisler[i + 1]
    if (once?.karisik && simdi?.karisik && sonra) {
      fisler[i] = sonra
      fisler[i + 1] = simdi
    }
  }
}

/** Tohumdan bir gece: yönlendirmeli ilk iki misafir, sonra evre 2-5'in bütçesi. Aynı tohum her makinede aynı gece. */
export function geceKur(tohum: number): Misafir[] {
  const r = rastgele(tohum)
  const fisler: FisTaslagi[] = []
  const gelisler: number[] = []
  for (let evre = 1; evre < EVRELER.length; evre++) {
    const evreninFisleri = evreFisleri(evre, r)
    fisler.push(...evreninFisleri)
    gelisler.push(...gelisTikleri(evre, evreninFisleri.length, r))
  }
  karisigiAyir(fisler)
  const ilk: Misafir[] = ILK_MISAFIRLER.map((m, no) => ({
    no,
    gelis: m.gelis,
    fis: [...m.fis],
    karisik: false,
    tukenmez: m.tukenmez,
  }))
  const sonraki: Misafir[] = fisler.map((f, i) => ({
    no: ilk.length + i,
    gelis: gelisler[i] ?? 0,
    fis: f.fis,
    karisik: f.karisik,
    tukenmez: false,
  }))
  return [...ilk, ...sonraki]
}
