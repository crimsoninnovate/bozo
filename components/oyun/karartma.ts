export type Kutu = { sol: number; ust: number; en: number; boy: number }

/** Rehber karartması: alan dikdörtgeninden açık kutular (kaynak, hedef) oyularak çıkar; evenodd ikisini de açık bırakır. */
export function karartmaYolu(en: number, boy: number, aciklar: readonly Kutu[]): string {
  const delikler = aciklar.map((k) => `M${k.sol} ${k.ust}H${k.sol + k.en}V${k.ust + k.boy}H${k.sol}Z`)
  return `path(evenodd, "${['M0 0H' + en + 'V' + boy + 'H0Z', ...delikler].join(' ')}")`
}
