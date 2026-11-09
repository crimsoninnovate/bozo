import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parolaDogrula, parolaOzeti, SAHTE_OZET } from './parola.ts'

/* Personel şifresi scrypt özetiyle saklanır; düz şifre hiçbir yerde tutulmaz. */

test('parolaOzeti_dogruSifre_dogrular', async () => {
  const ozet = await parolaOzeti('dogru-sifre-1')
  assert.match(ozet, /^scrypt\$16384\$8\$1\$[A-Za-z0-9+/=]+\$[A-Za-z0-9+/=]+$/)
  assert.equal(await parolaDogrula('dogru-sifre-1', ozet), true)
  assert.equal(await parolaDogrula('yanlis-sifre', ozet), false)
})

test('parolaOzeti_ayniSifreIkiKez_farkliOzet', async () => {
  assert.notEqual(await parolaOzeti('ayni-sifre-1'), await parolaOzeti('ayni-sifre-1'))
})

test('parolaDogrula_bozukOzet_falseAtmaz', async () => {
  for (const bozuk of ['', 'scrypt$x', 'md5$a$b', 'scrypt$1$8$1$AAAA$AAAA', 'scrypt$16384$8$1$!!$!!']) {
    assert.equal(await parolaDogrula('herhangi-bir', bozuk), false, bozuk)
  }
})

test('sahteOzet_hicbirSifreyleTutmaz', async () => {
  assert.equal(await parolaDogrula('', SAHTE_OZET), false)
  assert.equal(await parolaDogrula('sifre-sifre', SAHTE_OZET), false)
})
