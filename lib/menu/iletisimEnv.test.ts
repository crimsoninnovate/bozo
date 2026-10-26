import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { mock, test } from 'node:test'
import type { Isletme } from '../../content/types.ts'
import { iletisimiEnvdenOku, iletisimiEnveCevir } from './iletisimEnv.ts'
import type { MenuBelgesi } from './tipler.ts'

const belge = JSON.parse(
  readFileSync(new URL('../../content/menu.varsayilan.json', import.meta.url), 'utf8'),
) as MenuBelgesi

const varsayilan: Isletme = {
  ad: 'Ciğerci Bozo', kisaAd: 'Bozo', kategori: 'k', cadde: 'c', sehir: 'Girne', ulke: 'KKTC',
  binaNo: null, postaKodu: null, koordinat: null, telefon: null, whatsapp: null,
  eposta: 'eski@ornek.com', instagram: 'eski', facebook: 'eski', tiktok: 'eski',
  googleYorumKodu: 'ESKIKOD123', googlePlaceId: 'ChIJ', alkolServisi: false, sahip: 'Bozo Çağlar',
}

function envIle(degisim: Partial<MenuBelgesi['iletisim']>): string {
  const b = structuredClone(belge)
  b.iletisim = { ...b.iletisim, ...degisim }
  return iletisimiEnveCevir(b, 7).iletisim
}

test('iletisimiEnvdenOku_hamYok_varsayilanKalir', () => {
  assert.deepEqual(iletisimiEnvdenOku(undefined, varsayilan), varsayilan)
})

test('iletisimiEnvdenOku_hamBozuk_uyarirVeVarsayilan', () => {
  const uyari = mock.method(console, 'warn', () => {})
  try {
    for (const ham of ['{ bozuk', '"metin"', '{"telefonAcik":"evet"}', '{"telefonAcik":true,"eposta":5}']) {
      assert.deepEqual(iletisimiEnvdenOku(ham, varsayilan), varsayilan, ham)
    }
    assert.equal(uyari.mock.callCount(), 4)
  } finally {
    uyari.mock.restore()
  }
})

test('iletisimiEnvdenOku_telefonKapali_telefonVeWhatsappNull', () => {
  const sonuc = iletisimiEnvdenOku(envIle({ telefonAcik: false, telefon: '+90 533 111 22 33' }), varsayilan)
  assert.equal(sonuc.telefon, null)
  assert.equal(sonuc.whatsapp, null)
})

test('iletisimiEnvdenOku_telefonAcik_ikisiDeNumara', () => {
  const sonuc = iletisimiEnvdenOku(envIle({ telefonAcik: true, telefon: '+90 533 111 22 33' }), varsayilan)
  assert.equal(sonuc.telefon, '+90 533 111 22 33')
  assert.equal(sonuc.whatsapp, '+90 533 111 22 33')
})

test('iletisimiEnvdenOku_eposta_ustuneYazar', () => {
  const sonuc = iletisimiEnvdenOku(
    envIle({ eposta: 'yeni@ornek.com', instagram: 'yeni.ig', facebook: 'yeni_fb', tiktok: 'yeni.tt', googleYorumKodu: 'YENIKOD-9' }),
    varsayilan,
  )
  assert.equal(sonuc.eposta, 'yeni@ornek.com')
  assert.equal(sonuc.instagram, 'yeni.ig')
  assert.equal(sonuc.facebook, 'yeni_fb')
  assert.equal(sonuc.tiktok, 'yeni.tt')
  assert.equal(sonuc.googleYorumKodu, 'YENIKOD-9')
  assert.equal(sonuc.ad, varsayilan.ad, 'iletişim dışındaki alanlara dokunmaz')
})

test('iletisimiEnveCevir_surum_metinOlarakDoner', () => {
  assert.equal(iletisimiEnveCevir(belge, 7).surum, '7')
  assert.equal(iletisimiEnveCevir(belge).surum, '0')
})
