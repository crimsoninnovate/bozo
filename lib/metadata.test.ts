import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { tr } from '../content/tr/index.ts'
import { en } from '../content/en/index.ts'
import { sayfaMetadata } from './metadata.ts'
import { acilisSpotu } from './menu/sayilar.ts'
import type { MenuBelgesi } from './menu/tipler.ts'
import type { RotaAnahtari } from './site.ts'

const belge = JSON.parse(
  readFileSync(new URL('../content/menu.varsayilan.json', import.meta.url), 'utf8'),
) as MenuBelgesi

const ROTALAR: RotaAnahtari[] = ['ana', 'menu', 'galeri', 'hikaye', 'konum', 'gizlilik']

test('sayfaMetadata_tumRotalarda_sozlukBasligiVeAciklamasiniTasir', () => {
  for (const anahtar of ROTALAR) {
    for (const [dil, s] of [['tr', tr], ['en', en]] as const) {
      const meta = sayfaMetadata(anahtar, dil, belge)
      const aciklama = s.ortak.sayfaMeta[anahtar].aciklama
      assert.equal(meta.title, s.ortak.sayfaMeta[anahtar].baslik)
      assert.equal(meta.description, anahtar === 'menu' ? acilisSpotu(aciklama, belge, dil) : aciklama)
    }
  }
})

test('sayfaMetadata_menuAciklamasi_belgedekiSayilarlaKurulur', () => {
  const b = structuredClone(belge)
  b.ikramlar.urunler = []
  assert.match(String(sayfaMetadata('menu', 'tr', b).description), /Yedi porsiyon, dürümler, bir özel, altı ikram/)
  const enAciklama = String(sayfaMetadata('menu', 'en', belge).description)
  assert.match(enAciklama, /^Seven portions from the fire, wraps, eight on the house/)
})

test('sayfaMetadata_menuAciklamasiSablon_belgesizFirlatir', () => {
  assert.throws(() => sayfaMetadata('menu', 'tr'), /belge/)
})

test('sayfaMetadata_ana_canonicalDilinKendiYoluOlur', () => {
  const trMeta = sayfaMetadata('ana', 'tr')
  assert.equal(trMeta.alternates?.canonical, 'https://cigercibozo.com/')

  const enMeta = sayfaMetadata('ana', 'en')
  assert.equal(enMeta.alternates?.canonical, 'https://cigercibozo.com/en/')
})

test('sayfaMetadata_menu_hreflangUcDiliDeIcerir', () => {
  const meta = sayfaMetadata('menu', 'tr', belge)
  const diller = meta.alternates?.languages as Record<string, string>
  assert.equal(diller.tr, 'https://cigercibozo.com/menu/')
  assert.equal(diller.en, 'https://cigercibozo.com/en/menu/')
  assert.equal(diller['x-default'], 'https://cigercibozo.com/menu/')
})

test('sayfaMetadata_xDefault_herZamanTurkceyeIsaretEder', () => {
  for (const anahtar of ROTALAR) {
    const trMeta = sayfaMetadata(anahtar, 'tr', belge)
    const enMeta = sayfaMetadata(anahtar, 'en', belge)
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

/** `standalone` siteyi kurulabilir uygulama yapıyor ve Android "Uygulamayı yükle" öneriyordu (8 Ekim 2026). */
test('manifest_kurulabilirUygulamaIlanEtmez', () => {
  const manifest = JSON.parse(readFileSync(new URL('../public/site.webmanifest', import.meta.url), 'utf8'))
  assert.equal(manifest.display, 'browser')
  // Next `appleWebApp` verilince `mobile-web-app-capable: yes` basar; ana ekran kısayolu uygulama gibi açılır.
  for (const dil of ['tr', 'en'] as const) {
    const apple = sayfaMetadata('ana', dil).appleWebApp
    assert.ok(apple && typeof apple === 'object' && apple.capable === false)
  }
})
