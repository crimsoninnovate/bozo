import { BlockList, isIP } from 'node:net'

/*
 * Gerçek IP (spec §10): `CF-Connecting-IP` yalnız istek Cloudflare aralığından geliyorsa.
 * Plesk'te Node'un önünde yerel bir vekil durur; güvenilir vekilin eklediği son
 * `X-Forwarded-For` adımı eş adres sayılır. IP yalnız bellekteki hız sınırında kullanılır.
 */

/** cloudflare.com/ips, 8 Ekim 2026. */
export const CLOUDFLARE_V4 = [
  '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22', '141.101.64.0/18',
  '108.162.192.0/18', '190.93.240.0/20', '188.114.96.0/20', '197.234.240.0/22', '198.41.128.0/17',
  '162.158.0.0/15', '104.16.0.0/13', '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22',
]
export const CLOUDFLARE_V6 = [
  '2400:cb00::/32', '2606:4700::/32', '2803:f800::/32', '2405:b500::/32', '2405:8100::/32',
  '2a06:98c0::/29', '2c0f:f248::/32',
]

/** `::ffff:1.2.3.4` biçimindeki IPv4 adresi düz yazılır. */
export function ipDuzelt(adres: string): string {
  return adres.replace(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i, '$1')
}

export function listeKur(cidrler: readonly string[]): BlockList {
  const liste = new BlockList()
  for (const cidr of cidrler) {
    const [adres = '', uzunluk] = cidr.split('/')
    const tur = isIP(adres) === 6 ? 'ipv6' : 'ipv4'
    if (uzunluk === undefined) liste.addAddress(adres, tur)
    else liste.addSubnet(adres, Number(uzunluk), tur)
  }
  return liste
}

function listede(liste: BlockList, adres: string): boolean {
  const tur = isIP(adres)
  return tur !== 0 && liste.check(adres, tur === 6 ? 'ipv6' : 'ipv4')
}

export const CLOUDFLARE = listeKur([...CLOUDFLARE_V4, ...CLOUDFLARE_V6])

export type IpBasliklari = { 'cf-connecting-ip'?: string; 'x-forwarded-for'?: string }

export function gercekIp(soket: string | undefined, basliklar: IpBasliklari, guvenilirVekil: BlockList): string {
  let es = ipDuzelt(soket ?? '')
  const iletilen = basliklar['x-forwarded-for']
  if (iletilen && listede(guvenilirVekil, es)) {
    const son = ipDuzelt(iletilen.split(',').at(-1)?.trim() ?? '')
    if (isIP(son)) es = son
  }
  const cf = ipDuzelt(basliklar['cf-connecting-ip'] ?? '')
  if (cf && isIP(cf) && listede(CLOUDFLARE, es)) return cf
  return es || 'bilinmiyor'
}
