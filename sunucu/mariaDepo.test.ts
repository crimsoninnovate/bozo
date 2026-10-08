import { readFileSync } from 'node:fs'
import { depoSozlesmesi } from './depoSozlesmesi.ts'
import { mariaDepoKur, semayiUygula } from './mariaDepo.ts'

/*
 * Gerçek MariaDB'ye karşı aynı sözleşme; isteğe bağlı, `npm test` hermetik kalır:
 *   docker run -d --name bozo-maria -e MARIADB_ROOT_PASSWORD=sifre -e MARIADB_DATABASE=bozo_test \
 *     -p 127.0.0.1:3399:3306 mariadb:10.11
 *   BOZO_TEST_DB_URL=mariadb://root:sifre@127.0.0.1:3399/bozo_test node --test sunucu/mariaDepo.test.ts
 */
const DB_URL = process.env.BOZO_TEST_DB_URL ?? null
const SEMA = readFileSync(new URL('./sema.sql', import.meta.url), 'utf8')
const TABLOLAR = ['kazanan', 'tur', 'donem', 'tur_jetonu', 'oyuncu', 'gunluk_sayac']

depoSozlesmesi(
  'mariaDepo',
  DB_URL
    ? async () => {
        await semayiUygula(DB_URL, SEMA, TABLOLAR)
        return mariaDepoKur(DB_URL)
      }
    : null,
)
