import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { menuBelgesiDogrula } from './dogrulama.ts'
import { herkeseAcik, tukendisiz } from './herkeseAcik.ts'
import type { MenuBelgesi } from './tipler.ts'

const seed = JSON.parse(
  readFileSync(new URL('../../content/menu.varsayilan.json', import.meta.url), 'utf8'),
) as MenuBelgesi

const NUMARA = '+90 533 111 22 33'

function telefonla(telefonAcik: boolean): MenuBelgesi {
  const b = structuredClone(seed)
  b.iletisim = { ...b.iletisim, telefonAcik, telefon: NUMARA }
  return b
}

test('herkeseAcik_telefonKapali_numaraBosalir', () => {
  const sonuc = herkeseAcik(telefonla(false))
  assert.equal(sonuc.iletisim.telefon, '')
  assert.equal(sonuc.iletisim.telefonAcik, false)
  assert.equal(JSON.stringify(sonuc).includes('111 22 33'), false)
  assert.equal(menuBelgesiDogrula(sonuc).tamam, true, 'boşaltılmış belge doğrulayıcıdan geçer')
})

test('herkeseAcik_telefonAcik_numaraKalir', () => {
  assert.equal(herkeseAcik(telefonla(true)).iletisim.telefon, NUMARA)
})

test('herkeseAcik_girdiyiDegistirmez', () => {
  const girdi = telefonla(false)
  herkeseAcik(girdi)
  assert.equal(girdi.iletisim.telefon, NUMARA)
})

test('herkeseAcik_iletisimsizBirinciSurum_aynenDoner', () => {
  const { iletisim: _t, ...eski } = structuredClone(seed)
  const girdi = eski as unknown as MenuBelgesi
  assert.equal(herkeseAcik(girdi), girdi)
})

test('tukendisiz_tukenmisKalemVeIcecek_hepsiStokta', () => {
  const b = structuredClone(seed)
  const ciger = b.kalemler[0]
  const icecek = b.icecekler[0]
  assert.ok(ciger && icecek)
  ciger.tukendi = true
  icecek.tukendi = true
  const sonuc = tukendisiz(b)
  assert.ok(sonuc.kalemler.every((k) => !k.tukendi))
  assert.ok(sonuc.icecekler.every((i) => !i.tukendi))
  assert.equal(ciger.tukendi, true, 'girdiye dokunmaz')
  assert.deepEqual({ ...sonuc, kalemler: [], icecekler: [] }, { ...b, kalemler: [], icecekler: [] })
})
