import { test } from 'node:test'
import assert from 'node:assert/strict'
import { tr } from '../content/tr/index.ts'
import { en } from '../content/en/index.ts'
import { sayfaMetadata } from './metadata.ts'
import type { RotaAnahtari } from './site.ts'

const ROTALAR: RotaAnahtari[] = ['ana', 'menu', 'galeri', 'hikaye', 'konum', 'gizlilik']

test('sayfaMetadata_tumRotalarda_sozlukBasligiVeAciklamasiniTasir', () => {
  for (const anahtar of ROTALAR) {
    const trMeta = sayfaMetadata(anahtar, 'tr')
    assert.equal(trMeta.title, tr.ortak.sayfaMeta[anahtar].baslik)
    assert.equal(trMeta.description, tr.ortak.sayfaMeta[anahtar].aciklama)

    const enMeta = sayfaMetadata(anahtar, 'en')
    assert.equal(enMeta.title, en.ortak.sayfaMeta[anahtar].baslik)
    assert.equal(enMeta.description, en.ortak.sayfaMeta[anahtar].aciklama)
  }
})

test('sayfaMetadata_ana_canonicalDilinKendiYoluOlur', () => {
  const trMeta = sayfaMetadata('ana', 'tr')
  assert.equal(trMeta.alternates?.canonical, 'https://cigercibozo.com/')

  const enMeta = sayfaMetadata('ana', 'en')
  assert.equal(enMeta.alternates?.canonical, 'https://cigercibozo.com/en/')
})

test('sayfaMetadata_menu_hreflangUcDiliDeIcerir', () => {
  const meta = sayfaMetadata('menu', 'tr')
  const diller = meta.alternates?.languages as Record<string, string>
  assert.equal(diller.tr, 'https://cigercibozo.com/menu/')
  assert.equal(diller.en, 'https://cigercibozo.com/en/menu/')
  assert.equal(diller['x-default'], 'https://cigercibozo.com/menu/')
})

test('sayfaMetadata_xDefault_herZamanTurkceyeIsaretEder', () => {
  for (const anahtar of ROTALAR) {
    const trMeta = sayfaMetadata(anahtar, 'tr')
    const enMeta = sayfaMetadata(anahtar, 'en')
    const trDiller = trMeta.alternates?.languages as Record<string, string>
    const enDiller = enMeta.alternates?.languages as Record<string, string>
    assert.equal(trDiller['x-default'], trDiller.tr)
    assert.equal(enDiller['x-default'], enDiller.tr)
  }
})

test('sayfaMetadata_openGraph_dileGoreLocaleSecer', () => {
  const trMeta = sayfaMetadata('konum', 'tr')
  const enMeta = sayfaMetadata('konum', 'en')
  assert.equal(trMeta.openGraph?.locale, 'tr_TR')
  assert.equal(enMeta.openGraph?.locale, 'en_GB')
})
