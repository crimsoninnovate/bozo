/**
 * Şiş işaretinin geometrisi. Ölçüler marka kararıyla kilitli:
 * design_handoff_bozo_website/marka/01-Logo-Final-Karar.md, "Yapı, kilitlenen
 * ölçüler". Birim bir büyük (ciğer) tanesi; her şey ona oranla türer.
 */

/** Büyük taneye oranlar. Tane oranı 1/0.6 = 1.7 değiştirilmez (Cilt 2 taslak). */
export const SIS_ORANLARI = {
  yag: 0.6,
  bosluk: 0.43,
  cubuk: 0.13,
  uc: 1.2,
  halka: 0.7,
  /** Uç tabanı çubuğun iki katı, 0.3x boğazla çubuğa iner: iğne uç DPR 1'de kayboluyordu. Çizim kararı. */
  ucTaban: 0.26,
  bogaz: 0.3,
  /** Köşe: büyük tane 0.15x, küçük 0.08x. 12px tanede 1.8 / 0.96px, 0-3px kuralının içinde. */
  buyukKose: 0.15,
  kucukKose: 0.08,
} as const

/** Dizilim sabittir: ciğer, yağ, ciğer, ciğer, yağ, ciğer. true = ciğer. */
export const SIS_DIZILIMI = [true, false, true, true, false, true] as const

export type Tane = { x: number; y: number; kenar: number; kose: number; ciger: boolean }

export type SisGeometrisi = {
  taneler: Tane[]
  /** Uç tabanından halkanın yakın kenarına uzanan çubuk. */
  cubuk: { x: number; y: number; en: number; boy: number }
  /** Sivri uç: (0, eksen) noktasından tabana açılan bıçak, boğazla çubuğa iner. */
  uc: { uzunluk: number; taban: number; bogaz: number }
  halka: { cx: number; cy: number; r: number; cap: number; kalinlik: number }
  /** Çubuğun ekseni; taneler ve halka buna ortalanır. */
  eksen: number
  en: number
  boy: number
}

/** Verilen büyük tane kenarı için işaretin bütün parçalarını yerleştirir. Uç solda, halka sağda. */
export function sisGeometrisi(x: number): SisGeometrisi {
  const bosluk = SIS_ORANLARI.bosluk * x
  const cubuk = SIS_ORANLARI.cubuk * x
  const uc = SIS_ORANLARI.uc * x
  const halka = SIS_ORANLARI.halka * x
  const eksen = x / 2

  const taneler: Tane[] = []
  let imlec = uc + bosluk
  for (const ciger of SIS_DIZILIMI) {
    const kenar = ciger ? x : SIS_ORANLARI.yag * x
    const kose = (ciger ? SIS_ORANLARI.buyukKose : SIS_ORANLARI.kucukKose) * x
    taneler.push({ x: imlec, y: eksen - kenar / 2, kenar, kose, ciger })
    imlec += kenar + bosluk
  }

  return {
    taneler,
    cubuk: { x: uc, y: eksen - cubuk / 2, en: imlec - uc, boy: cubuk },
    uc: { uzunluk: uc, taban: SIS_ORANLARI.ucTaban * x, bogaz: SIS_ORANLARI.bogaz * x },
    halka: { cx: imlec + halka / 2, cy: eksen, r: halka / 2 - cubuk / 2, cap: halka, kalinlik: cubuk },
    eksen,
    en: imlec + halka,
    boy: x,
  }
}
