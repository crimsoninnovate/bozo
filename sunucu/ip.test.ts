import { test } from 'node:test'
import assert from 'node:assert/strict'
import { gercekIp, ipDuzelt, kovaAnahtari, listeKur } from './ip.ts'

const VEKIL = listeKur(['127.0.0.1', '::1'])

test('gercekIp_cloudflareDisindanGelenCfBasligi_yokSayilir', () => {
  assert.equal(gercekIp('1.2.3.4', { 'cf-connecting-ip': '9.9.9.9' }, VEKIL), '1.2.3.4')
})

test('gercekIp_cloudflareAraligindanGelenCfBasligi_gercekIp', () => {
  assert.equal(gercekIp('173.245.50.7', { 'cf-connecting-ip': '9.9.9.9' }, VEKIL), '9.9.9.9')
  assert.equal(gercekIp('2606:4700::1', { 'cf-connecting-ip': '2001:db8::5' }, VEKIL), '2001:db8::5')
})

test('gercekIp_guvenilirVekilArkasinda_xForwardedForSonAdimiEsSayilir', () => {
  const basliklar = { 'x-forwarded-for': '9.9.9.9, 104.16.1.1', 'cf-connecting-ip': '9.9.9.9' }
  assert.equal(gercekIp('127.0.0.1', basliklar, VEKIL), '9.9.9.9')
  assert.equal(gercekIp('::ffff:127.0.0.1', { 'x-forwarded-for': '5.5.5.5' }, VEKIL), '5.5.5.5')
})

/** Plesk: nginx → Apache → Node, iki yerel adım; istemcinin uydurduğu baştaki adım okunmaz. */
test('gercekIp_ikiYerelVekilZinciri_guvenilirAdimlarAtlanir', () => {
  const zincir = { 'x-forwarded-for': '6.6.6.6, 9.9.9.9, 104.16.1.1, 127.0.0.1', 'cf-connecting-ip': '9.9.9.9' }
  assert.equal(gercekIp('127.0.0.1', zincir, VEKIL), '9.9.9.9')
  assert.equal(gercekIp('127.0.0.1', { 'x-forwarded-for': '6.6.6.6, 5.5.5.5, ::1' }, VEKIL), '5.5.5.5')
})

test('gercekIp_guvenilmeyenEsinXForwardedFor_yokSayilir', () => {
  const basliklar = { 'x-forwarded-for': '104.16.1.1', 'cf-connecting-ip': '9.9.9.9' }
  assert.equal(gercekIp('8.8.8.8', basliklar, VEKIL), '8.8.8.8')
})

test('gercekIp_bozukBasliklar_esAdresKalir', () => {
  assert.equal(gercekIp('173.245.50.7', { 'cf-connecting-ip': 'abc' }, VEKIL), '173.245.50.7')
  assert.equal(gercekIp(undefined, {}, VEKIL), 'bilinmiyor')
})

test('ipDuzelt_ipv4Eslemeli_duzYazilir', () => {
  assert.equal(ipDuzelt('::ffff:10.0.0.1'), '10.0.0.1')
  assert.equal(ipDuzelt('2001:db8::1'), '2001:db8::1')
})

/** Bir istemci genelde bütün bir /64'e sahiptir: adres değiştirerek hız sınırından kaçamaz. */
test('kovaAnahtari_ipv6AyniSlash64_ayniAnahtar_ipv4Degismez', () => {
  assert.equal(kovaAnahtari('2001:db8::5'), kovaAnahtari('2001:db8:0:0:ffff:1:2:3'))
  assert.equal(kovaAnahtari('2001:DB8::5'), kovaAnahtari('2001:db8::6'))
  assert.notEqual(kovaAnahtari('2001:db8::5'), kovaAnahtari('2001:db8:0:1::5'))
  assert.equal(kovaAnahtari('1::2:3:4:5:6:7'), kovaAnahtari('1:0:2:3:4:5:6:7'), 'kısa :: yazımı aynı önek')
  assert.equal(kovaAnahtari('1::2:3:4:5:6:7'), '1:0:2:3::/64')
  assert.equal(kovaAnahtari('9.9.9.9'), '9.9.9.9')
  assert.equal(kovaAnahtari('bilinmiyor'), 'bilinmiyor')
})
