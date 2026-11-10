import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const ANA = new URL('./ana.ts', import.meta.url).pathname

// DB_URL bağlanılamaz bir adres: kontrol bağlantıdan önce düşmeli.
const calistir = (tuz: string) =>
  spawnSync(process.execPath, [ANA], {
    env: {
      NODE_ENV: 'test', PATH: process.env.PATH ?? '', PORT: '0',
      GIZLI_TUZ: tuz, DB_URL: 'mariadb://u:p@127.0.0.1:1/yok',
    },
    encoding: 'utf8',
    timeout: 10_000,
  })

test('ana_uretimdeKisaTuz_baslamaz', () => {
  const sonuc = calistir('kisa')
  assert.notEqual(sonuc.status, 0)
  assert.match(sonuc.stderr, /GIZLI_TUZ en az 32 karakter/)
})
