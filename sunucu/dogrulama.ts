import {
  ANAHTAR_HEX,
  EN_COK_DOKUNUS,
  KANALLAR,
  ONAY_SURUMU,
  type Kanal,
  type OyuncuIstegi,
} from '../lib/oyun/aktarim.ts'
import { takmaAdBicimiGecerliMi } from '../lib/oyun/takmaAd.ts'
import type { Girdi } from '../lib/oyun/tipler.ts'
import { IstekHatasi } from './http.ts'

/* İstek gövdelerinin sınır denetimi (spec §9). Simülasyonun kendi denetimi `simule` içinde kalır. */

const nesne = (govde: unknown): Record<string, unknown> => {
  if (typeof govde !== 'object' || govde === null || Array.isArray(govde)) throw new IstekHatasi(400, 'govdeGecersiz')
  return govde as Record<string, unknown>
}

export function kanalCoz(govde: unknown): Kanal {
  const { kanal } = nesne(govde)
  const bulunan = KANALLAR.find((k) => k === kanal)
  if (!bulunan) throw new IstekHatasi(400, 'kanalGecersiz')
  return bulunan
}

export function oyuncuIstegiCoz(govde: unknown): OyuncuIstegi {
  const { takmaAd, anahtar, onaySurumu } = nesne(govde)
  if (typeof anahtar !== 'string' || !new RegExp(`^[0-9a-f]{${ANAHTAR_HEX}}$`).test(anahtar)) {
    throw new IstekHatasi(400, 'anahtarGecersiz')
  }
  if (onaySurumu !== ONAY_SURUMU) throw new IstekHatasi(400, 'onaySurumuEski')
  if (typeof takmaAd !== 'string' || !takmaAdBicimiGecerliMi(takmaAd)) throw new IstekHatasi(422, 'takmaAdKullanilamaz')
  return { takmaAd, anahtar, onaySurumu }
}

/** Dizi, en çok 1.200 dokunuş, hedef başına tikte en çok bir; öğelerin kalan denetimi `simule`de. */
export function girdileriCoz(govde: unknown): Girdi[] {
  const { girdiler } = nesne(govde)
  if (!Array.isArray(girdiler)) throw new IstekHatasi(400, 'girdilerGecersiz')
  if (girdiler.length > EN_COK_DOKUNUS) throw new IstekHatasi(422, 'cokDokunus')
  const ayniTik = new Set<string>()
  let oncekiTik = -1
  for (const girdi of girdiler) {
    if (!Array.isArray(girdi) || girdi.length !== 2) throw new IstekHatasi(422, 'girdilerGecersiz')
    const [tik, hedef] = girdi as [unknown, unknown]
    if (typeof tik !== 'number' || typeof hedef !== 'string') throw new IstekHatasi(422, 'girdilerGecersiz')
    if (tik !== oncekiTik) ayniTik.clear()
    if (ayniTik.has(hedef)) throw new IstekHatasi(422, 'ayniTikteAyniHedef')
    ayniTik.add(hedef)
    oncekiTik = tik
  }
  return girdiler as Girdi[]
}
