import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BUTCE, EVRELER, ILK_MISAFIRLER, RAF, TUR_TIK } from './ayar.ts'
import { ustaOyna } from './deneme.ts'
import { geceKur } from './gece.ts'
import { simule } from './motor.ts'
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

const ZORLUK_TOHUMLARI = Array.from({ length: 200 }, (_, i) => i * 104729 + 3)
const oyna = (tohum: number, beceri: Parameters<typeof ustaOyna>[1]) => simule(tohum, ustaOyna(tohum, beceri))

/* Kapı (spec tabak §5): ayar değişikliği kapıyı bozarsa oyun ya yapılamaz ya baskısız olmuştur. */
test('bot_usta_gecelerinEnAz95iniTamamlar_enYuksekPuan', () => {
  let tamam = 0
  let usta = 0
  let duzenli = 0
  for (const t of ZORLUK_TOHUMLARI) {
    const u = oyna(t, 'usta')
    if (u.bitti === 'gece') tamam++
    usta += u.puan
    duzenli += oyna(t, 'duzenli').puan
  }
  assert.ok(tamam >= 190, `usta ${tamam}/200 gece tamamladı`)
  assert.ok(usta > duzenli, 'usta düzenliden fazla puan almalı')
})

test('bot_duzenli_gecelerinEnAz70iniTamamlar', () => {
  const tamam = ZORLUK_TOHUMLARI.filter((t) => oyna(t, 'duzenli').bitti === 'gece').length
  assert.ok(tamam >= 140, `düzenli ${tamam}/200 gece tamamladı`)
})

test('bot_cirak_gecelerinEnAz50siniTamamlar', () => {
  const tamam = ZORLUK_TOHUMLARI.filter((t) => oyna(t, 'cirak').bitti === 'gece').length
  assert.ok(tamam >= 100, `çırak ${tamam}/200 gece tamamladı`)
})

/* Spec'in "evre 2'yi geçer" kapısı yapı gereği sağlanır (ilk misafir tükenmez, ikinci 2820'den önce kalkamaz); yerine baskı ölçülür. */
test('bot_rastgele_gecelerinEnCok5iniTamamlar_puaniDuzenlininCeyregininAltinda', () => {
  let tamam = 0
  let rastgele = 0
  let duzenli = 0
  for (const t of ZORLUK_TOHUMLARI) {
    const r = oyna(t, 'rastgele')
    if (r.bitti === 'gece') tamam++
    rastgele += r.puan
    duzenli += oyna(t, 'duzenli').puan
  }
  assert.ok(tamam <= 10, `rastgele ${tamam}/200 gece tamamladı`)
  assert.ok(rastgele * 4 < duzenli, `rastgele ${rastgele} / düzenli ${duzenli}`)
})

test('bot_hareketsiz_sifirPuan_0200denOnceUcMisafirKalkar', () => {
  for (const t of ZORLUK_TOHUMLARI.slice(0, 50)) {
    const sonuc = oyna(t, 'hareketsiz')
    assert.equal(sonuc.puan, 0, `tohum ${t}`)
    assert.equal(sonuc.bitti, 'ucMisafir', `tohum ${t}`)
    assert.ok(sonuc.tik < (EVRELER[3]?.baslangic ?? 0), `tohum ${t}: ${sonuc.tik}`)
  }
})
