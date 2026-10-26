import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { tr } from './tr/index.ts'
import { en } from './en/index.ts'
import { isletme } from './isletme.ts'
import { fotograflar } from './fotograflar.ts'
import { lakaplar } from './lakaplar.ts'
import { anaSayfaKalemleri } from '../lib/menu/belgeYukle.ts'
import { kalemOlculeri } from '../lib/menu/kalemOlculeri.ts'
import { acilisSpotu, ikramSayisi, sayiYaz } from '../lib/menu/sayilar.ts'
import type { MenuBelgesi } from '../lib/menu/tipler.ts'
import { yorumUrl } from '../lib/site.ts'

/** Fiyatlar, kalemler ve içecekler artık belgede yaşar; bu testler tohum belgeyi okur. */
const belge = JSON.parse(
  readFileSync(new URL('./menu.varsayilan.json', import.meta.url), 'utf8'),
) as MenuBelgesi

/** İç içe nesnenin tüm yaprak yollarını sıralı liste olarak döner. */
function yollar(nesne: unknown, onek = ''): string[] {
  if (typeof nesne !== 'object' || nesne === null) return [onek]
  return Object.entries(nesne)
    .flatMap(([anahtar, deger]) => yollar(deger, onek ? `${onek}.${anahtar}` : anahtar))
    .sort()
}

test('sozluk_trVeEn_ayniAnahtarlariTasir', () => {
  assert.deepEqual(yollar(en), yollar(tr))
})

test('sozluk_hicbirDegerBosDegil', () => {
  const bosOlanlar: string[] = []
  const gez = (nesne: unknown, onek = ''): void => {
    if (typeof nesne === 'string') {
      if (nesne.trim() === '') bosOlanlar.push(onek)
      return
    }
    if (typeof nesne === 'object' && nesne !== null) {
      for (const [k, v] of Object.entries(nesne)) gez(v, onek ? `${onek}.${k}` : k)
    }
  }
  gez(tr)
  gez(en)
  assert.deepEqual(bosOlanlar, [])
})

test('sozluk_emDashIcermez', () => {
  const kirli: string[] = []
  const gez = (nesne: unknown, onek = ''): void => {
    if (typeof nesne === 'string') {
      // U+2014 em dash, kod noktasıyla yazılır: kaynak dosyaya glif gömülmez
      if (nesne.includes('\u2014')) kirli.push(onek)
      return
    }
    if (typeof nesne === 'object' && nesne !== null) {
      for (const [k, v] of Object.entries(nesne)) gez(v, onek ? `${onek}.${k}` : k)
    }
  }
  gez(tr)
  gez(en)
  assert.deepEqual(kirli, [], 'Marka kuralı: em dash kullanılmaz')
})

/**
 * Nüfustaki ad siteden tamamen kalktı (sahibinin kararı, 23 Ağustos 2026); 19
 * Ağustos'tan beri lakabı açıklayan iki cümlede yaşıyordu. Tasarım dosyaları ve
 * metin envanteri o adı hala taşıyor, yani bir parite turu geri ekleyebilir.
 */
test('sozluk_nufustakiAdiIcermez', () => {
  const kirli: string[] = []
  const gez = (nesne: unknown, onek = ''): void => {
    if (typeof nesne === 'string') {
      if (/\bEngin\b/.test(nesne)) kirli.push(onek)
      return
    }
    if (typeof nesne === 'object' && nesne !== null) {
      for (const [k, v] of Object.entries(nesne)) gez(v, onek ? `${onek}.${k}` : k)
    }
  }
  gez(tr)
  gez(en)
  assert.deepEqual(kirli, [], 'Marka kuralı: sahibinin adı sitede yalnız Bozo Çağlar')
})

/**
 * Komşu çipleri yön bulma ipucudur, ölçüm değil. "80 m" mesafesi tasarımda
 * geçiyor ama isletmeGercekleri içinde karşılığı yok; işletme sahibi kaldırdı.
 * Tasarım ekran görüntüleri hala eski hali gösterdiği için ileride bir parite
 * turu bunu "eksik" sanıp geri ekleyebilir; bu test o yolu kapatır.
 * Doğrulanmış ölçüler (10 şiş, 4 ciğer, 3 dakika) bu desene takılmaz.
 */
test('sozluk_dogrulanmamisMesafeIddiasiIcermez', () => {
  const mesafeli: string[] = []
  const gez = (nesne: unknown, onek = ''): void => {
    if (typeof nesne === 'string') {
      if (/\d+\s?(m|km|metre|mt)\b/i.test(nesne)) mesafeli.push(`${onek}: ${nesne}`)
      return
    }
    if (typeof nesne === 'object' && nesne !== null) {
      for (const [k, v] of Object.entries(nesne)) gez(v, onek ? `${onek}.${k}` : k)
    }
  }
  gez(tr)
  gez(en)
  assert.deepEqual(mesafeli, [], 'Mesafe iddiası doğrulanmış bir kaynak ister')
})

/**
 * Mobil alt bar 390px'de üç eşit hedef taşır ve tasarım orada kısa etiketi
 * kullanır ("Yol tarifi"), üst bardaki uzun etiketi değil. İkisi tek etikete
 * indirgenirse mobil yerleşim sessizce bozulur, o yüzden fark burada kilitli.
 */
test('cta_mobilYolTarifiEtiketiKisaKalir', () => {
  for (const s of [tr, en]) {
    assert.ok(
      s.ortak.cta.yolTarifiKisa.length < s.ortak.cta.yolTarifiAl.length,
      `${s.ortak.cta.yolTarifiKisa} kısa etiketi ${s.ortak.cta.yolTarifiAl} kadar uzun`,
    )
  }
})

/**
 * İki gezinme bölgesinin adı birbirinden farklı olmak zorunda. Bileşenlerde
 * ikisi de "Site navigasyonu" yazıyordu; aynı adı taşıyan iki landmark, ekran
 * okuyucunun landmark listesinde ayırt edilemez ve adlandırmanın amacı kaybolur.
 */
test('erisim_gezinmeBolgeleriFarkliAdTasir', () => {
  for (const s of [tr, en]) {
    const { anaGezinme, mobilGezinme, hizliEylemler } = s.ortak.erisim
    for (const ad of [anaGezinme, mobilGezinme, hizliEylemler]) assert.ok(ad?.trim(), 'Landmark adı boş olamaz')
    assert.equal(
      new Set([anaGezinme, mobilGezinme, hizliEylemler]).size,
      3,
      'Gezinme landmarkları (ana, çekmece, mobil aksiyon barı) aynı adı taşıyamaz',
    )
  }
})

/**
 * Çekmecenin `role="dialog"` adı, içindeki `<nav>`'ın adıyla aynı olamaz.
 * Aynı olsaydı ekran okuyucu iç içe iki bölgeyi aynı adla duyurur ve
 * adlandırmanın amacı, üstteki gezinme testindeki gibi, kaybolurdu.
 */
test('erisim_cekmeceAdiGezinmeAdlarindanFarkli', () => {
  for (const s of [tr, en]) {
    const { gezinmeCekmecesi, mobilGezinme, anaGezinme } = s.ortak.erisim
    assert.notEqual(gezinmeCekmecesi, mobilGezinme, 'Diyalog ve içindeki nav aynı adı taşıyamaz')
    assert.notEqual(gezinmeCekmecesi, anaGezinme, 'Diyalog ve ana gezinme aynı adı taşıyamaz')
  }
})

/**
 * Sahibi 24 Ağustos 2026'da verdi: Google Maps'te kapıya yakınlaşılmış nokta
 * (20.62z), posta kodunu OSM bağımsız teyit ediyor. `Isletme`'de artık null alan
 * kalmadı; JSON-LD `geo`/`postalCode` ile `yolTarifiUrl()` yön tarifi dalı buna bağlı.
 */
test('isletme_koordinatVePostaKodu_dogrulanmisDegerTasir', () => {
  assert.deepEqual(isletme.koordinat, { enlem: 35.3370065, boylam: 33.3057253 })
  assert.equal(isletme.postaKodu, '99300')
})

test('isletme_epostaDogrulanmisDegeriTasir', () => {
  assert.equal(isletme.eposta, 'bozo@cigercibozo.com')
})

// Sahibinin 8 Ekim 2026 Maps linkindeki özellik kimliğinden türetildi; tarayıcıda
// "Ciğerci Bozo" kartını açtığı doğrulandı (IYILESTIRMELER.md > Google Maps kaydı).
test('isletme_googlePlaceId_dogrulanmisDegerTasir', () => {
  assert.equal(isletme.googlePlaceId, 'ChIJHzzKSYdt3hQRN2efWVKQ-sc')
})

// Kullanıcı adı saklanır, tam URL değil: AltBilgi öneki kendisi kurar.
test('isletme_instagram_kullaniciAdiTasirUrlDegil', () => {
  assert.equal(isletme.instagram, 'cigercibozo')
  assert.equal(isletme.instagram?.includes('/'), false)
})

test('isletme_facebookVeTiktok_kullaniciAdiTasirUrlDegil', () => {
  for (const kullanici of [isletme.facebook, isletme.tiktok]) {
    assert.equal(kullanici, 'cigercibozo')
    assert.equal(kullanici?.includes('/') || kullanici?.startsWith('@'), false)
  }
})

test('isletme_googleYorumKodu_adresiDogruKurar', () => {
  assert.equal(yorumUrl(isletme.googleYorumKodu), 'https://g.page/r/CTdnn1lSkPrHEBM/review')
  assert.equal(yorumUrl(null), null)
})

// Telefon ve WhatsApp siteden gizli (sahibi, 19 Ekim 2026); null olunca hiçbir yüzey bağlantı basmaz.
test('isletme_telefonVeWhatsapp_gizliykenNullDur', () => {
  assert.equal(isletme.telefon, null)
  assert.equal(isletme.whatsapp, null)
})

test('isletme_dogrulanmisAlanlarDoludur', () => {
  assert.equal(isletme.ad, 'Ciğerci Bozo')
  assert.equal(isletme.kisaAd, 'Bozo')
  assert.equal(isletme.kategori, 'Urfa usulü ciğerci')
  assert.equal(isletme.cadde, 'Naci Talat Caddesi')
  assert.equal(isletme.sehir, 'Girne')
  assert.equal(isletme.ulke, 'KKTC')
  assert.equal(isletme.sahip, 'Bozo Çağlar')
  assert.equal(isletme.alkolServisi, false)
})

/**
 * Bina numarası handoff README'sinde (11 Ağustos 2026) ve dört tasarım
 * dosyasının hepsinde geçer. JSON-LD streetAddress bu alandan kurulur;
 * null kalırsa arama motorlarına eksik adres gider.
 */
test('isletme_binaNoDogrulanmisDegerTasir', () => {
  assert.equal(isletme.binaNo, 'No:4')
})

/**
 * Yapısal veri streetAddress alanını isletme.cadde ve isletme.binaNo üzerinden
 * kurar; görünen adres satırı sözlükten gelir. İkisi ayrışırsa arama motoruna
 * giden adres ile sayfadaki adres çelişir, yerel görünürlük bundan zarar görür.
 */
test('adres_yapisalVeGorunenAyniDegeriTasir', () => {
  assert.equal(`${isletme.cadde} ${isletme.binaNo}`, tr.ortak.satirlar.adresTamSatir)
})

/**
 * Ana sayfa beş ana kalemde kalır (sahibinin kararı, 13 Ağustos 2026). Karışık
 * ve special kombinasyondur ve yalnız menü sayfasında görünür; bu test ana
 * sayfa bölümünün sessizce büyümesini engeller.
 */
test('urunler_anaSayfaBesKalemdeKalir', () => {
  assert.deepEqual(
    anaSayfaKalemleri(belge, Object.keys(tr.ana.ocakbasi.urunler)).map((k) => k.id),
    ['ciger', 'dalak', 'yurek', 'terbiyesiz-tavuk-sis', 'terbiyeli-kusbasi'],
  )
  assert.deepEqual(Object.keys(en.ana.ocakbasi.urunler).sort(), Object.keys(tr.ana.ocakbasi.urunler).sort())
})

// Sıra sahibinin fiyat listesinin sırası (8 Ekim 2026).
test('urunler_menuListesiFiyatListesininSirasiniTasir', () => {
  assert.deepEqual(
    belge.kalemler.map((k) => k.id),
    ['ciger', 'dalak', 'yurek', 'terbiyeli-tavuk-sis', 'terbiyesiz-tavuk-sis', 'terbiyeli-kusbasi', 'bozo-karisik'],
  )
})

/**
 * Fiyat listesi sahibinden 8 Ekim 2026'da geldi; 1,5 porsiyon ve 1,5 dürüm 19 Ekim 2026'da
 * kalktı. 24 Ekim 2026 el yazısı listesi dürümü servisle aynı fiyata çekti, kuşbaşı dürümü ekledi.
 */
test('urunler_fiyatlarIsletmedenGelenDegerleriTasir', () => {
  const beklenen: Record<string, Record<string, number>> = {
    ciger: { porsiyon: 690, durum: 690 },
    dalak: { porsiyon: 550, durum: 550 },
    yurek: { porsiyon: 550, durum: 550 },
    'terbiyeli-tavuk-sis': { porsiyon: 550, durum: 550 },
    'terbiyesiz-tavuk-sis': { porsiyon: 550, durum: 550 },
    'terbiyeli-kusbasi': { porsiyon: 850, durum: 850 },
    'bozo-karisik': { porsiyon: 700 },
  }
  for (const kalem of belge.kalemler) {
    assert.deepEqual(kalem.fiyatlar, beklenen[kalem.id], `${kalem.id} fiyatı kaymış`)
  }
  assert.equal(belge.ozel.fiyat, 900)
})

/** Dürüm satırı notsuz basılmaz: sözlükteki "5 şiş" yedeği kalktı, not belgede durur. */
test('kalemler_olcuSatiriOlanHerKalemSisNotuTasir', () => {
  for (const kalem of belge.kalemler) {
    assert.ok(kalem.porsiyonNotu, `${kalem.id} porsiyon notu yok`)
    if (kalem.fiyatlar.durum !== undefined) assert.ok(kalem.durumNotu, `${kalem.id} dürüm notu yok`)
  }
  const ciger = belge.kalemler.find((k) => k.id === 'ciger')
  assert.deepEqual(ciger?.porsiyonNotu, { tr: '10 şiş', en: '10 skewers' })
  assert.deepEqual(ciger?.durumNotu, { tr: '10 şiş', en: '10 skewers' })
})

test('kalemOlculeri_yalnizFiyatiOlanOlculeriMenuSirasiylaDoner', () => {
  const bozo = belge.kalemler.find((k) => k.id === 'bozo-karisik')
  assert.ok(bozo)
  assert.deepEqual(kalemOlculeri(bozo), [
    { olcu: 'porsiyon', fiyat: 700 },
  ])
})

/** Oyun istemcide çalışır, menü belgesini okuyamaz; üç şiş adı sözlükte durur ve belgeyle aynı kalmalı. */
test('oyun_sisAdlari_menuBelgesiyleAyni', () => {
  for (const dil of ['tr', 'en'] as const) {
    for (const id of ['ciger', 'dalak', 'yurek'] as const) {
      const kalem = belge.kalemler.find((k) => k.id === id)
      assert.equal(({ tr, en })[dil].oyun.kalemAdlari[id], kalem?.ad[dil], `${dil} ${id} oyun adı kaymış`)
    }
  }
})

/** Eşlikçi adları (domates, sumaklı soğan) oyun sözlüğünde durur; belgedeki ikram adıyla aynı kalmalı. */
test('oyun_eslikciAdlari_ikramOgeleriyleAyni', () => {
  const oge = (id: string) => belge.ikramlar.gruplar.flatMap((g) => g.ogeler).find((o) => o.id === id)
  for (const dil of ['tr', 'en'] as const) {
    const ad = ({ tr, en })[dil].oyun.kalemAdlari
    assert.equal(ad.domates, oge('domates')?.ad[dil], `${dil} domates oyun adı kaymış`)
    assert.equal(ad.sogan, oge('sumakli')?.ad[dil], `${dil} sogan oyun adı kaymış`)
  }
})

test('sozluk_ikramMetinleri_belgedeYasar', () => {
  for (const s of [tr, en]) assert.equal('ikramlar' in s.menu, false)
})

test('ikramlar_fiyatTasimaz', () => {
  assert.equal(belge.ikramlar.urunler.length, 2)
  for (const i of belge.ikramlar.urunler) assert.equal('fiyat' in i, false)
})

/** Fiyat listesinde olmayan içecekler menüden kalktı (sahibi, 8 Ekim 2026). */
test('icecekler_fiyatlarIsletmedenGelenDegerleriTasir', () => {
  const ozet = Object.fromEntries(
    belge.icecekler.map((i) => [i.id, Object.fromEntries(i.olculer.map((o) => [o.ad.tr, o.fiyat]))]),
  )
  assert.deepEqual(ozet, {
    kola: { Kutu: 60, Şişe: 70 },
    kolaZero: { Kutu: 60, Şişe: 70 },
    fanta: { Kutu: 60 },
    cappy: { Kutu: 60 },
    ayran: { Büyük: 40, Küçük: 30, 'Açık Yayık': 50 },
    su: { Pet: 25, Cam: 50 },
  })
})

/**
 * Kimlikler sözlükte karşılığı olmayınca bileşenler derleme sırasında patlıyor.
 * Bu test aynı hatayı testte, iki dil için birden yakalar: ana sayfa sözlüğü belgede
 * olmayan bir kalemi gösteremez.
 */
test('kimlikler_ikiDildeDeSozluktedir', () => {
  for (const s of [tr, en]) {
    const belgeKimlikleri = new Set(belge.kalemler.map((k) => k.id))
    for (const id of Object.keys(s.ana.ocakbasi.urunler)) {
      assert.ok(belgeKimlikleri.has(id), `${id} ana sayfa sözlüğünde var, menü belgesinde yok`)
    }
  }
})

/**
 * Kadraj etiketi fotoğrafçıya hangi kareyi çekeceğini söyleyen tek şeydir.
 * İki kayıt aynı etiketi taşırsa çekim listesinde ayırt edilemez hale gelir;
 * "tane yakın çekimi" ile yatay kardeşini ayıran da tam olarak bu etikettir.
 */
test('fotograflar_herKadrajBenzersizEtiketTasir', () => {
  const kareler = Object.values(fotograflar)
  const etiketler = kareler.map((f) => f.etiket)
  const etiketlerEn = kareler.map((f) => f.etiketEn)
  assert.equal(new Set(etiketler).size, etiketler.length, 'İki kare aynı kadraj etiketini taşıyamaz')
  assert.equal(new Set(etiketlerEn).size, etiketlerEn.length, 'İki kare aynı İngilizce etiketi taşıyamaz')
})

/**
 * 20 Ağustos 2026'ya kadar bu test "hiçbiri dosya taşımaz" diyordu; ilk iki kare
 * gelince amacı değişti. Artık iki şeyi birden tutuyor: kadraj etiketleri hep
 * dolu (dosya gelince `alt` olarak ağaçta kalıyorlar) ve `dosya` yazılmışsa o
 * dosya `public/` altında GERÇEKTEN var. İkincisi olmasaydı bir yazım hatası
 * sessizce kırık görsel basardı; statik export'ta bunu yakalayan başka bir şey yok.
 */
test('fotograflar_etiketDolu_veYazilanDosyaDiskteVar', () => {
  const kok = new URL('../public', import.meta.url)
  for (const [id, foto] of Object.entries(fotograflar)) {
    assert.ok(foto.etiket.length > 0, `${id} için kadraj etiketi boş`)
    assert.ok(foto.etiketEn.length > 0, `${id} için İngilizce kadraj etiketi boş`)
    if (foto.dosya === undefined) continue
    assert.ok(foto.dosya.startsWith('/foto/'), `${id} dosyası /foto/ altında değil: ${foto.dosya}`)
    assert.ok(
      existsSync(new URL(`.${foto.dosya}`, `${kok.href}/`)),
      `${id} için ${foto.dosya} public/ altında yok`,
    )
  }
})

/**
 * Galeri metni kare sayısını harfle yazar ve aynı sayı iki dilde dört yerde geçer
 * (spot ve meta description). Manifest 16'dan 17'ye çıktığında dördü de "on altı"
 * kaldı ve misafire yanlış sayı gösterildi; bu test o kaymayı bir daha bırakmaz.
 */
test('galeri_kareSayisi_metindekiSayiylaAyni', () => {
  const sayiSozcugu: Record<number, { tr: string; en: string }> = {
    16: { tr: 'on altı', en: 'Sixteen' },
    17: { tr: 'on yedi', en: 'Seventeen' },
    18: { tr: 'on sekiz', en: 'Eighteen' },
  }
  const adet = Object.keys(fotograflar).length
  const sozcuk = sayiSozcugu[adet]
  assert.ok(sozcuk, `${adet} kare için sayı sözcüğü tanımlı değil, bu tabloya ekle`)

  for (const [dil, s, beklenen] of [
    ['tr', tr, sozcuk.tr],
    ['en', en, sozcuk.en],
  ] as const) {
    for (const [ad, metin] of [
      ['galeri.altMetin', s.galeri.altMetin],
      ['sayfaMeta.galeri.aciklama', s.ortak.sayfaMeta.galeri.aciklama],
    ] as const) {
      assert.ok(
        metin.toLowerCase().includes(beklenen.toLowerCase()),
        `${dil}.${ad} "${beklenen}" demiyor, manifestte ${adet} kare var: ${metin}`,
      )
    }
  }
})

/**
 * Lakap örnekleri tek dosyada (adlar çevrilmez); yalnız sıfatın açıklaması sözlükte.
 * Bir kayıt eklenip notu unutulursa çift, açıklamasız basılır.
 */
test('lakaplar_kimlikler_benzersizdir', () => {
  const kimlikler = lakaplar.map((l) => l.id)
  assert.equal(new Set(kimlikler).size, kimlikler.length)
})

test('lakaplar_sifatliOlanlarin_notuIkiDildeVar', () => {
  for (const kayit of lakaplar.filter((l) => l.tur === 'lakap')) {
    for (const s of [tr, en]) {
      const notlar: Record<string, string | undefined> = s.hikaye.lakap.notlar
      assert.equal(typeof notlar[kayit.id], 'string', kayit.id)
    }
  }
})

/** Kısaltmanın açıklaması yok: sıfat taşımıyor, kural giriş paragrafında anlatılıyor. */
test('lakaplar_kisaltmalarin_notuYoktur', () => {
  const kisaltmalar = new Set(lakaplar.filter((l) => l.tur === 'kisaltma').map((l) => l.id))
  for (const s of [tr, en]) {
    for (const kimlik of Object.keys(s.hikaye.lakap.notlar)) {
      assert.equal(kisaltmalar.has(kimlik), false, kimlik)
    }
  }
})

/**
 * Ana sayfanın alt notu (statik, panelden bağımsız) ikram sayısını harfle yazar; seed sekiz taşır.
 * Menü spotu ve meta açıklaması şablon, sayı belgeden gelir (aşağıdaki iki test).
 */
test('ikram_sayisi_anaSayfaAltNotuylaAyni', () => {
  const adet = ikramSayisi(belge)
  for (const dil of ['tr', 'en'] as const) {
    const metin = ({ tr, en })[dil].ana.ocakbasi.altNot
    const sozcuk = sayiYaz(adet, dil)
    assert.ok(metin.toLowerCase().includes(sozcuk), `${dil} ana.ocakbasi.altNot: "${sozcuk}" geçmiyor`)
  }
})

/**
 * Ciğer porsiyonu 10 şiş (sahibi, 19 Ekim 2026). Tasarım ve metin-envanteri.json hâlâ 8
 * yazıyor; sayı altı ayrı metinde geçtiği için biri geride kalırsa bu test yakalar.
 */
test('sozluk_cigerPorsiyonu_heryerdeOnSistir', () => {
  for (const s of [tr, en]) {
    assert.equal(s.ana.iddia.sayac1.deger, '10')
    assert.match(s.menu.ocakbasi.cigerSpec.sis, /^10 /)
    assert.match(s.hikaye.usul.olcuSisSayisi, /^10 /)
  }
})

/** Menü spotu ve meta açıklaması sayı yer tutucuları taşır; kalem ve ikram sayısı belgeden gelir. */
test('menu_sayilar_metinlerBelgedekiSayilaraUyar', () => {
  const kopya = (adet: number): MenuBelgesi => {
    const b = structuredClone(belge)
    const ilk = b.kalemler[0]
    assert.ok(ilk)
    b.kalemler = Array.from({ length: adet }, (_, n) => ({ ...ilk, id: `k${n}` }))
    return b
  }
  for (const adet of [6, 7, 8]) {
    for (const [dil, s, birim] of [['tr', tr, 'porsiyon'], ['en', en, 'portions']] as const) {
      for (const [ad, sablon] of [
        ['menu.acilis.spot', s.menu.acilis.spot],
        ['sayfaMeta.menu.aciklama', s.ortak.sayfaMeta.menu.aciklama],
      ] as const) {
        assert.ok(sablon.includes('{kalem}') && sablon.includes('{ikram}'), `${dil} ${ad}: yer tutucu yok`)
        const metin = acilisSpotu(sablon, kopya(adet), dil).toLowerCase()
        const beklenen = `${sayiYaz(adet, dil)} ${birim}`
        assert.ok(metin.includes(beklenen), `${dil} ${ad}: "${beklenen}" geçmiyor: ${metin}`)
        assert.ok(metin.includes(sayiYaz(ikramSayisi(belge), dil)), `${dil} ${ad}: ikram sayısı geçmiyor`)
      }
    }
  }
})

/** Sözlüğün bütün metin yapraklarını yoluyla birlikte döner. */
function metinler(nesne: unknown, onek = ''): [string, string][] {
  if (typeof nesne === 'string') return [[onek, nesne]]
  if (typeof nesne !== 'object' || nesne === null) return []
  return Object.entries(nesne).flatMap(([k, v]) => metinler(v, onek ? `${onek}.${k}` : k))
}

/**
 * Yarım porsiyon 8 Ekim 2026 fiyat listesiyle kalktı. Menü değişti ama ana sayfanın
 * fiyat bloğu "yarım porsiyon tam fiyatın yarısıdır" demeye devam etti ve yayına çıktı.
 */
test('sozluk_kalkmisYarimPorsiyonaDegimez', () => {
  const kirli = [...metinler(tr), ...metinler(en)].filter(([, m]) => /(?<!\p{L})(yarım|half)(?!\p{L})/iu.test(m))
  assert.deepEqual(kirli, [])
})

/** Saat aralığı kuralı: `10:00 - 05:00`. "between 05:00 and 10:00" İngilizcede üç yere sızmıştı. */
test('sozluk_saatAraligiTireyleYazilir', () => {
  const kirli = [...metinler(tr), ...metinler(en)].filter(([, m]) =>
    /\d{2}:\d{2}\s+(and|to|ile|ila)\s+\d{2}:\d{2}/i.test(m),
  )
  assert.deepEqual(kirli, [])
})

/** Gizlilik sayfası bandın düğmelerini adıyla anıyor; düğme adı değişirse metin yok bir düğmeyi tarif eder. */
test('gizlilik_bantDugmeleriniGuncelAdlariylaAnar', () => {
  for (const s of [tr, en]) {
    assert.ok(s.gizlilik.dayanakMetni.includes(`"${s.ortak.cerez.kabul}"`), s.gizlilik.dayanakMetni)
    assert.ok(s.gizlilik.geriAlmaMetni.includes(`"${s.ortak.cerez.ret}"`), s.gizlilik.geriAlmaMetni)
  }
})
