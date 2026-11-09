import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  chmodSync, existsSync, linkSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, statSync, symlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { DerlemeDurumu } from '../../lib/menu/aktarim.ts'
import { yonetimDerlemeDurumu } from '../derleme.ts'
import type { Baglam } from '../uclar.ts'

/* arc derleme betikleri (spec 2026-11-09 C): `yukle.sh` bekçisi, `derle.sh` durumları, okuyucuyla uyum. */

const BURASI = dirname(fileURLToPath(import.meta.url))
const DERLE = join(BURASI, 'derle.sh')
const YUKLE = join(BURASI, 'yukle.sh')
const BEKCI = ['index.html', 'favicon.svg', 'sosyal-kart.jpg', 'marka/rozet.svg', 'foto/tane-yakin-cekim.webp']

type Ortam = { kok: string; panel: string; depo: string; cikti: string; sahte: string; gecici: string }

function ortamKur(): Ortam {
  const kok = mkdtempSync(join(tmpdir(), 'bozo-arc-'))
  const o = {
    kok, panel: join(kok, 'panel'), depo: join(kok, 'depo'), cikti: join(kok, 'cikti'), sahte: join(kok, 'bin'),
    gecici: join(kok, 'tmp'),
  }
  for (const d of [o.panel, o.depo, o.sahte, o.gecici]) mkdirSync(d, { recursive: true })
  writeFileSync(join(o.depo, 'package-lock.json'), '{"kilit":1}')
  // flock macOS'ta yok; git ve npm testte sahte. Linux'ta gerçek flock da aynı yolu izler.
  sahteYaz(o, 'flock', 'exit 0')
  sahteYaz(o, 'git', 'case "$1" in rev-parse) echo abc123 ;; esac; exit 0')
  return o
}

function sahteYaz(o: Ortam, ad: string, govde: string): void {
  const yol = join(o.sahte, ad)
  writeFileSync(yol, `#!/usr/bin/env bash\n${govde}\n`)
  chmodSync(yol, 0o755)
}

function env(o: Ortam, ek: Record<string, string> = {}): NodeJS.ProcessEnv {
  return {
    ...process.env, PATH: `${o.sahte}:${process.env.PATH ?? ''}`,
    DERLEME_DIZINI: o.panel, DEPO: o.depo, CIKTI: o.cikti, TMPDIR: o.gecici, ...ek,
  }
}

/** `npm ci` bu lockfile için başarıyla koşmuş gibi: `node_modules/.bozo-kilit` özetle eşleşir. */
function modullerHazir(o: Ortam): void {
  mkdirSync(join(o.depo, 'node_modules'), { recursive: true })
  const ozet = createHash('sha256').update(readFileSync(join(o.depo, 'package-lock.json'))).digest('hex')
  writeFileSync(join(o.depo, 'node_modules', '.bozo-kilit'), `${ozet}\n`)
}

const calistir = (betik: string, o: Ortam, ek?: Record<string, string>, args: string[] = []) =>
  spawnSync('bash', [betik, ...args], { env: env(o, ek), encoding: 'utf8' })

const yukleKuru = (o: Ortam, args: string[] = []) => calistir(YUKLE, o, { YUKLE_KURU: '1' }, args)

function ciktiKur(o: Ortam, eksik?: string): void {
  for (const dosya of BEKCI) {
    if (dosya === eksik) continue
    mkdirSync(dirname(join(o.cikti, dosya)), { recursive: true })
    writeFileSync(join(o.cikti, dosya), 'x')
  }
}

/** Ham `durum.json` ve skor sunucusunun okuyucusundan geçen hali; okuyucu reddederse `bos` döner. */
async function durumOku(o: Ortam): Promise<{ ham: DerlemeDurumu; okunan: DerlemeDurumu }> {
  const ham = JSON.parse(readFileSync(join(o.panel, 'durum.json'), 'utf8')) as DerlemeDurumu
  // Uç yalnız `derlemeDizini`ni okur; gerisi bu testte kullanılmaz.
  const b = { derlemeDizini: o.panel } as unknown as Baglam
  const yanit = await yonetimDerlemeDurumu(b)
  return { ham, okunan: (yanit.govde as { durum: DerlemeDurumu }).durum }
}

test('betikler_bashSozdizimi_gecerli', () => {
  for (const betik of [DERLE, YUKLE, join(BURASI, 'ortak.sh')]) {
    const r = spawnSync('bash', ['-n', betik], { encoding: 'utf8' })
    assert.equal(r.status, 0, `${betik}: ${r.stderr}`)
  }
})

test('yukle_bekciDosyasiEksik_hataVeCikis1', async () => {
  for (const eksik of BEKCI) {
    const o = ortamKur()
    ciktiKur(o, eksik)
    const r = yukleKuru(o)
    assert.equal(r.status, 1, eksik)
    const { ham, okunan } = await durumOku(o)
    assert.equal(ham.asama, 'hata')
    assert.deepEqual(okunan, ham)
    assert.ok(ham.gunluk.some((s) => s.includes(eksik)), `${eksik}: ${ham.gunluk.join('\n')}`)
  }
})

test('yukle_tamCikti_yayindaVeSurum', async () => {
  const o = ortamKur()
  ciktiKur(o)
  writeFileSync(join(o.cikti, 'menu.canli.meta.json'), JSON.stringify({ surum: 7, cekilme: 'x' }))
  writeFileSync(join(o.kok, 'derleme.log'), 'derle: build done\n')
  const r = yukleKuru(o)
  assert.equal(r.status, 0, r.stderr)
  const { ham, okunan } = await durumOku(o)
  assert.equal(ham.asama, 'yayinda')
  assert.equal(ham.surum, 7)
  assert.equal(typeof ham.zaman, 'string')
  assert.ok(ham.gunluk.includes('derle: build done'))
  assert.deepEqual(okunan, ham)
})

test('yukle_metaYok_yayindaSurumNull', async () => {
  const o = ortamKur()
  ciktiKur(o)
  assert.equal(yukleKuru(o).status, 0)
  assert.equal((await durumOku(o)).ham.surum, null)
})

test('yukle_argumanVerilirse_reddeder', () => {
  const o = ortamKur()
  ciktiKur(o)
  const r = yukleKuru(o, ['/tmp'])
  assert.notEqual(r.status, 0)
  assert.equal(existsSync(join(o.panel, 'durum.json')), false)
})

test('derle_basarili_ciktiKopyalanirIstekSilinirDurumDerleniyor', async () => {
  const o = ortamKur()
  modullerHazir(o)
  writeFileSync(join(o.panel, 'istek'), '2026-11-09T10:00:00.000Z')
  mkdirSync(join(o.depo, 'content'))
  writeFileSync(join(o.depo, 'content', 'menu.canli.meta.json'), '{"surum":4}')
  sahteYaz(o, 'npm', 'echo "npm $*"; [ "$1" = run ] && mkdir -p out/marka && echo site > out/index.html; exit 0')
  const r = calistir(DERLE, o)
  assert.equal(r.status, 0, readFileSync(join(o.kok, 'derleme.log'), 'utf8'))
  assert.equal(readFileSync(join(o.cikti, 'index.html'), 'utf8'), 'site\n')
  assert.equal(readFileSync(join(o.cikti, 'menu.canli.meta.json'), 'utf8'), '{"surum":4}')
  assert.equal(existsSync(join(o.panel, 'istek')), false)
  const log = readFileSync(join(o.kok, 'derleme.log'), 'utf8')
  assert.match(log, /npm run build/)
  assert.doesNotMatch(log, /npm ci/)
  const { ham, okunan } = await durumOku(o)
  assert.equal(ham.asama, 'derleniyor')
  assert.deepEqual(okunan, ham)
})

test('derle_nodeModulesYok_npmCiCalisir', () => {
  const o = ortamKur()
  sahteYaz(o, 'npm', 'echo "npm $*"; [ "$1" = run ] && mkdir -p out && touch out/index.html; exit 0')
  assert.equal(calistir(DERLE, o).status, 0)
  assert.match(readFileSync(join(o.kok, 'derleme.log'), 'utf8'), /npm ci/)
})

test('derle_canliMenuAlinamadi_hataVeCiktiyaDokunmaz', async () => {
  const o = ortamKur()
  modullerHazir(o)
  mkdirSync(o.cikti)
  writeFileSync(join(o.cikti, 'eski.html'), 'eski')
  sahteYaz(o, 'npm', 'echo "menuCek: CANLI MENU ALINAMADI (x)"; mkdir -p out; touch out/index.html; exit 0')
  const r = calistir(DERLE, o)
  assert.notEqual(r.status, 0)
  assert.equal(existsSync(join(o.cikti, 'eski.html')), true)
  const { ham, okunan } = await durumOku(o)
  assert.equal(ham.asama, 'hata')
  assert.ok(ham.gunluk.some((s) => s.includes('CANLI MENU ALINAMADI')))
  assert.deepEqual(okunan, ham)
})

test('derle_buildCoker_son200SatirKacisliGunluk', async () => {
  const o = ortamKur()
  modullerHazir(o)
  const govde = 'for i in $(seq 1 300); do echo "satir $i"; done; ' +
    'printf \'tirnak " ters \\\\ sekme\\t\\033[31mrenk\\033[0m\\n\'; exit 3'
  sahteYaz(o, 'npm', govde)
  const r = calistir(DERLE, o)
  assert.notEqual(r.status, 0)
  const { ham, okunan } = await durumOku(o)
  assert.equal(ham.asama, 'hata')
  assert.equal(ham.gunluk.length, 200)
  assert.ok(ham.gunluk.includes('tirnak " ters \\ sekme\trenk'), ham.gunluk.slice(-3).join('\n'))
  assert.match(ham.gunluk.at(-1) ?? '', /exit 3/)
  assert.deepEqual(okunan, ham)
})

test('derle_sinyalleOldurulur_hataYazar', async () => {
  const o = ortamKur()
  modullerHazir(o)
  sahteYaz(o, 'npm', 'echo basladi; sleep 30')
  // systemd birimin tüm grubunu öldürür; burada süreç grubu aynısını yapar.
  const c = spawn('bash', [DERLE], { env: env(o), detached: true, stdio: 'ignore' })
  const bitti = new Promise<number | null>((coz) => c.on('exit', (kod) => coz(kod)))
  const log = join(o.kok, 'derleme.log')
  for (let i = 0; i < 100 && !(existsSync(log) && readFileSync(log, 'utf8').includes('basladi')); i++) {
    await new Promise((coz) => setTimeout(coz, 50))
  }
  process.kill(-(c.pid ?? 0), 'SIGTERM')
  assert.notEqual(await bitti, 0)
  const { ham } = await durumOku(o)
  assert.equal(ham.asama, 'hata')
})

test('bayatDurum_birimBasarisizDurdu_derleniyorHataOlur', async () => {
  for (const betik of [DERLE, YUKLE]) {
    const o = ortamKur()
    const kuru: Record<string, string> = betik === YUKLE ? { YUKLE_KURU: '1' } : {}
    const yaz = (asama: string) => writeFileSync(join(o.panel, 'durum.json'),
      JSON.stringify({ asama, surum: null, zaman: null, gunluk: [] }))
    yaz('derleniyor')
    // Kilidi hiç almamış bir çalışma (sahiplik izi yok) başka bir derlemenin durumuna dokunmaz.
    assert.equal(calistir(betik, o, { ...kuru, SERVICE_RESULT: 'timeout' }).status, 0)
    assert.equal((await durumOku(o)).ham.asama, 'derleniyor')
    writeFileSync(join(o.gecici, betik === YUKLE ? 'bozo-yukle.sahip' : 'bozo-derle.sahip'), '')
    assert.equal(calistir(betik, o, { ...kuru, SERVICE_RESULT: 'success' }).status, 0)
    assert.equal((await durumOku(o)).ham.asama, 'derleniyor')
    assert.equal(calistir(betik, o, { ...kuru, SERVICE_RESULT: 'timeout' }).status, 0)
    const { ham, okunan } = await durumOku(o)
    assert.equal(ham.asama, 'hata')
    assert.ok(ham.gunluk.some((s) => s.includes('timeout')))
    assert.deepEqual(okunan, ham)
    yaz('yayinda')
    assert.equal(calistir(betik, o, { ...kuru, SERVICE_RESULT: 'timeout' }).status, 0)
    assert.equal((await durumOku(o)).ham.asama, 'yayinda')
  }
})

test('durumYaz_rootOlarak_reddederDosyaYazmaz', () => {
  // Sahte `id -u` 0 der: yukle.sh'in durum yazıcısı root'ken çalışmamalı (gerçekte runuser ile düşer).
  const o = ortamKur()
  ciktiKur(o)
  sahteYaz(o, 'id', 'echo 0')
  const r = yukleKuru(o)
  assert.notEqual(r.status, 0)
  assert.match(r.stderr, /refusing to run as root/)
  assert.equal(existsSync(join(o.panel, 'durum.json')), false)
})

test('yukle_kendiGunlugu_stdinIleGunlugeGirer', async () => {
  const o = ortamKur()
  ciktiKur(o, 'favicon.svg')
  yukleKuru(o)
  const { ham } = await durumOku(o)
  assert.ok(ham.gunluk.includes('yukle: failed (exit 1)'), ham.gunluk.join('\n'))
})

test('derle_npmCiBirKezCoker_sonrakiCalismaAyniHeadleYenidenDener', async () => {
  const o = ortamKur()
  const sayac = join(o.kok, 'ci-sayisi')
  sahteYaz(o, 'npm', `if [ "$1" = ci ]; then echo x >> "${sayac}"; [ "$(wc -l < "${sayac}")" -gt 1 ] || exit 1; fi
echo "npm $*"; [ "$1" = run ] && mkdir -p out && touch out/index.html; exit 0`)
  assert.notEqual(calistir(DERLE, o).status, 0)
  assert.equal((await durumOku(o)).ham.asama, 'hata')
  assert.equal(existsSync(join(o.depo, 'node_modules', '.bozo-kilit')), false)
  assert.equal(calistir(DERLE, o).status, 0)
  assert.match(readFileSync(join(o.kok, 'derleme.log'), 'utf8'), /npm ci/)
  assert.equal(calistir(DERLE, o).status, 0)
  assert.doesNotMatch(readFileSync(join(o.kok, 'derleme.log'), 'utf8'), /npm ci/)
  assert.equal(readFileSync(sayac, 'utf8').split('\n').filter(Boolean).length, 2)
})

test('yukle_bekciDosyasiSembolikBag_reddeder', async () => {
  const o = ortamKur()
  ciktiKur(o, 'favicon.svg')
  writeFileSync(join(o.kok, 'gercek.svg'), 'x')
  symlinkSync(join(o.kok, 'gercek.svg'), join(o.cikti, 'favicon.svg'))
  assert.equal(yukleKuru(o).status, 1)
  const { ham } = await durumOku(o)
  assert.equal(ham.asama, 'hata')
  assert.ok(ham.gunluk.some((s) => s.includes('nothing extracted') && s.includes('favicon.svg')))
})

test('yukle_sabitBag_acmadanReddeder', async () => {
  const o = ortamKur()
  ciktiKur(o)
  linkSync(join(o.cikti, 'index.html'), join(o.cikti, 'kopya.html'))
  assert.equal(yukleKuru(o).status, 1)
  assert.ok((await durumOku(o)).ham.gunluk.some((s) => s.includes('nothing extracted') && s.includes('kopya.html')))
})

/** Sahte `tar`: oluşturma çağrısı (`-C dizin -cf - .`) hazır arşivi verir, gerisi gerçek tar'a gider. */
function sahteArsiv(o: Ortam, arsiv: string): void {
  sahteYaz(o, 'tar', `if [ "$1" = -C ] && [ "$3" = -cf ]; then cat "${arsiv}"; exit 0; fi
PATH="\${PATH#*:}" exec tar "$@"`)
}

test('yukle_arsivdeUstDizinYaSaMutlakYol_acmadanReddeder', async () => {
  for (const uye of ['../../../kacak.txt', join(tmpdir(), 'bozo-mutlak-kacak.txt')]) {
    const o = ortamKur()
    ciktiKur(o)
    const kaynak = join(o.kok, 'kaynak')
    mkdirSync(kaynak)
    writeFileSync(join(kaynak, 'index.html'), 'x')
    const arsiv = join(o.kok, 'kotu.tar')
    // -P: tar `..` ve mutlak yolu korur; kötü niyetli bir arşiv böyle görünür.
    const gnu = spawnSync('tar', ['--version'], { encoding: 'utf8' }).stdout.includes('GNU')
    const yeniAd = gnu ? [`--transform=s|^index.html$|${uye}|`] : ['-s', `|^index.html$|${uye}|`]
    const r = spawnSync('tar', ['-cPf', arsiv, ...yeniAd, '-C', kaynak, 'index.html'])
    assert.equal(r.status, 0, String(r.stderr))
    sahteArsiv(o, arsiv)
    assert.equal(yukleKuru(o).status, 1)
    const { ham } = await durumOku(o)
    assert.ok(ham.gunluk.some((s) => s.includes('nothing extracted') && s.includes(uye)), ham.gunluk.join('\n'))
    assert.equal(existsSync(join(o.kok, 'kacak.txt')), false)
    assert.equal(existsSync(join(tmpdir(), 'bozo-mutlak-kacak.txt')), false)
  }
})

test('derle_basarili_ciktiVeGunlukGrubaKapali', () => {
  const o = ortamKur()
  modullerHazir(o)
  sahteYaz(o, 'npm', '[ "$1" = run ] && mkdir -p out && touch out/index.html; exit 0')
  assert.equal(calistir(DERLE, o).status, 0)
  assert.equal(statSync(o.cikti).mode & 0o777, 0o750)
  assert.equal(statSync(join(o.cikti, 'index.html')).mode & 0o777, 0o640)
  assert.equal(statSync(join(o.kok, 'derleme.log')).mode & 0o777, 0o640)
})

test('yukle_basarili_sahneVeSahiplikIziKalmaz', () => {
  const o = ortamKur()
  ciktiKur(o)
  assert.equal(yukleKuru(o).status, 0)
  assert.deepEqual(readdirSync(o.gecici), [])
})
