import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BUTCE, EVRELER, ILK_MISAFIRLER, RAF, TUR_TIK } from './ayar.ts'
import { geceKur } from './gece.ts'
import type { Misafir, Urun } from './tipler.ts'

const TOHUMLAR = Array.from({ length: 300 }, (_, i) => i * 7919 + 1)

function evreninMisafirleri(gece: Misafir[], evre: number): Misafir[] {
  const ayar = EVRELER[evre]
  if (!ayar) throw new RangeError(`tanımsız evre: ${evre}`)
  return gece.filter((m) => m.no >= ILK_MISAFIRLER.length && m.gelis >= ayar.baslangic && m.gelis < ayar.bitis)
}

const kume = (m: Misafir[]): string => m.flatMap((x) => x.fis).sort().join(',')

test('butce_sisBoylariToplami_sisSayisinaEsit_eslikciFisSayisiniAsmaz', () => {
  for (const b of BUTCE) {
    assert.equal(b.sisBoylari.reduce((x, y) => x + y, 0), b.sisler.length)
    assert.ok(b.eslikciler.length <= b.sisBoylari.length)
  }
})

test('gece_ayniTohum_ayniGeceyiVerir', () => {
  assert.deepEqual(geceKur(2026), geceKur(2026))
})

test('gece_ilkIkiMisafir_tohumdanBagimsizVeYonlendirmeli', () => {
  for (const tohum of [1, 99, 123456]) {
    const [ilk, ikinci] = geceKur(tohum)
    assert.deepEqual(ilk, { no: 0, gelis: 60, fis: ['ciger'], karisik: false, tukenmez: true })
    assert.deepEqual(ikinci, { no: 1, gelis: 720, fis: ['ciger', 'domates'], karisik: false, tukenmez: false })
  }
})

test('gece_herTohumda_evreBasinaMisafirSayisiVeUrunKumesiAyni', () => {
  const ornek = geceKur(1)
  for (let evre = 1; evre < EVRELER.length; evre++) {
    const beklenenSayi = evreninMisafirleri(ornek, evre).length
    const beklenenKume = kume(evreninMisafirleri(ornek, evre))
    for (const tohum of TOHUMLAR) {
      const misafirler = evreninMisafirleri(geceKur(tohum), evre)
      assert.equal(misafirler.length, beklenenSayi, `tohum ${tohum}, evre ${evre}`)
      assert.equal(kume(misafirler), beklenenKume, `tohum ${tohum}, evre ${evre}`)
    }
  }
})

test('gece_gelisler_artanSirada', () => {
  for (const tohum of TOHUMLAR) {
    const gece = geceKur(tohum)
    gece.forEach((m, i) => {
      if (i > 0) assert.ok(m.gelis > (gece[i - 1]?.gelis ?? 0), `tohum ${tohum}: ${i}. misafir sırasız`)
    })
  }
})

test('gece_herFis_enCokUcSisVeBirEslikci_enAzBirSis', () => {
  for (const tohum of TOHUMLAR) {
    for (const m of geceKur(tohum)) {
      const sis = m.fis.filter((k) => RAF.includes(k as Urun)).length
      const eslikci = m.fis.length - sis
      assert.ok(sis >= 1 && sis <= 3 && eslikci <= 1, `tohum ${tohum}, misafir ${m.no}: ${m.fis.join(',')}`)
    }
  }
})

test('gece_yirmiDortMisafir_sonMisafir05tenEnAz8SnOnce', () => {
  for (const tohum of TOHUMLAR) {
    const gece = geceKur(tohum)
    assert.equal(gece.length, 24, `tohum ${tohum}`)
    assert.ok((gece.at(-1)?.gelis ?? TUR_TIK) <= TUR_TIK - 480, `tohum ${tohum}: son misafir geç`)
  }
})

test('gece_ikiBozoKarisik_artArdaGelmez', () => {
  for (const tohum of TOHUMLAR) {
    const gece = geceKur(tohum)
    gece.forEach((m, i) => {
      if (i > 0) assert.ok(!(m.karisik && gece[i - 1]?.karisik), `tohum ${tohum}: ${i}`)
    })
  }
})

test('gece_bozoKarisik_cigerDalakYurekVeDomates', () => {
  const karisiklar = geceKur(5).filter((m) => m.karisik)
  assert.equal(karisiklar.length, 2)
  for (const m of karisiklar) for (const u of [...RAF, 'domates'] as const) assert.ok(m.fis.includes(u))
  assert.deepEqual(karisiklar.map((m) => m.fis.length), [4, 4])
})
