import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { tr } from './tr/index.ts'
import { en } from './en/index.ts'
import { isletme } from './isletme.ts'
import { fotograflar } from './fotograflar.ts'
import { lakaplar } from './lakaplar.ts'
import { anaUrunler, icecekler, ikramGruplari, ikramlar, menuUrunler, ozelUrun } from './urunler.ts'
import { yarimFiyat } from './isletme.ts'

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
 * Doğrulanmış ölçüler (12 şiş, 4 ciğer, 3 dakika) bu desene takılmaz.
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
    assert.notEqual(
      s.ortak.erisim.anaGezinme,
      s.ortak.erisim.mobilGezinme,
      'İki gezinme landmarkı aynı adı taşıyamaz',
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

// Telefon ve WhatsApp aynı hat. `wa.me` baştaki sıfırı kabul etmez, o yüzden
// depolanan biçim uluslararası olmak zorunda.
test('isletme_telefonVeWhatsapp_ayniUluslararasiHattiTasir', () => {
  assert.equal(isletme.telefon, '+90 533 888 74 24')
  assert.equal(isletme.whatsapp, isletme.telefon)
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
    anaUrunler.map((u) => u.id),
    ['ciger', 'dalak', 'yurek', 'terbiyesiz-tavuk-sis', 'terbiyeli-kusbasi'],
  )
})

test('urunler_menuListesiKarisigiEkler', () => {
  assert.deepEqual(
    menuUrunler.map((u) => u.id),
    [...anaUrunler.map((u) => u.id), 'bozo-karisik'],
  )
})

/**
 * Fiyatlar sahibinden 13 Ağustos 2026'da geldi. Önceki sürümde bu testin işi
 * "hiçbir fiyat uydurulmamış" demekti; artık işi, gelen değerlerin bir
 * yenileme turunda sessizce kaymamasını sağlamak.
 */
test('urunler_fiyatlarIsletmedenGelenDegerleriTasir', () => {
  const beklenen: Record<string, [number, number]> = {
    ciger: [800, 500],
    dalak: [600, 400],
    yurek: [700, 450],
    'terbiyesiz-tavuk-sis': [600, 400],
    'terbiyeli-kusbasi': [850, 550],
    'bozo-karisik': [800, 500],
  }
  for (const urun of menuUrunler) {
    assert.deepEqual([urun.tam, urun.durum], beklenen[urun.id], `${urun.id} fiyatı kaymış`)
  }
  assert.equal(ozelUrun.fiyat, 1000)
})

/**
 * `yarimFiyat` tek sayıda yuvarlar. Bugünkü tam fiyatların hepsi çift, yani
 * yuvarlama hiç çalışmıyor. Tek sayı bir fiyat girilirse yarım porsiyon sessizce
 * yuvarlanmış bir değer basardı; karar insanın olsun diye burada durduruluyor.
 */
test('urunler_tamFiyatlarCiftSayidir', () => {
  for (const urun of menuUrunler) {
    assert.equal(urun.tam === null || urun.tam % 2 === 0, true, `${urun.id} tam fiyatı tek sayı`)
  }
})

test('yarimFiyat_tamPorsiyonunYarisidir', () => {
  assert.equal(yarimFiyat(800), 400)
  assert.equal(yarimFiyat(850), 425)
  assert.equal(yarimFiyat(null), null)
})

test('ikramlar_fiyatTasimaz', () => {
  assert.equal(ikramlar.length, 2)
  for (const i of ikramlar) assert.equal('fiyat' in i, false)
})

/** İçecek fiyatı gelmedi; alan hiç yok, "000 TL" basan bir yol da yok. */
test('icecekler_fiyatAlaniTasimaz', () => {
  for (const i of icecekler) assert.equal('fiyat' in i, false)
})

/**
 * Kimlikler sözlükte karşılığı olmayınca bileşenler derleme sırasında patlıyor.
 * Bu test aynı hatayı testte, iki dil için birden yakalar: bir ürün yeniden
 * adlandırılıp yalnız bir sözlük güncellenirse burada görünür.
 */
test('kimlikler_ikiDildeDeSozluktedir', () => {
  for (const s of [tr, en]) {
    for (const urun of menuUrunler) {
      assert.ok(urun.id in s.menu.ocakbasi.urunler, `${urun.id} menü sözlüğünde yok`)
    }
    for (const urun of anaUrunler) {
      assert.ok(urun.id in s.ana.ocakbasi.urunler, `${urun.id} ana sayfa sözlüğünde yok`)
    }
    for (const icecek of icecekler) {
      assert.ok(icecek.id in s.menu.icecekler.urunler, `${icecek.id} içecek sözlüğünde yok`)
      for (const olcu of icecek.olculer) {
        assert.ok(olcu in s.menu.icecekler.olculer, `${olcu} ölçüsü sözlükte yok`)
      }
    }
    for (const grup of ikramGruplari) {
      assert.ok(grup.id in s.menu.ikramlar.gruplar, `${grup.id} kümesi sözlükte yok`)
      for (const oge of grup.ogeler) {
        assert.ok(oge in s.menu.ikramlar.ogeler, `${oge} ikramı sözlükte yok`)
      }
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
 * İkram sayısı iki dilde üç yerde harfle yazılı (ana sayfa alt notu, menü spotu, menü
 * meta açıklaması). Ana sayfa "iki ikram" diyordu, veri sekiz taşıyordu: iki plakalı ikram
 * sayılmış, üç kümenin altı kalemi sayılmamıştı (sahibinin geri bildirimi, 19 Ağustos 2026).
 */
test('ikram_sayisi_metindekiSayiylaAyni', () => {
  const sayiSozcugu: Record<number, { tr: string; en: string }> = {
    8: { tr: 'sekiz', en: 'eight' },
    9: { tr: 'dokuz', en: 'nine' },
    10: { tr: 'on', en: 'ten' },
  }
  const adet = ikramlar.length + ikramGruplari.reduce((t, g) => t + g.ogeler.length, 0)
  const sozcuk = sayiSozcugu[adet]
  assert.ok(sozcuk, `${adet} ikram için sayı sözcüğü tanımlı değil, bu tabloya ekle`)

  for (const [dil, s, beklenen] of [
    ['tr', tr, sozcuk.tr],
    ['en', en, sozcuk.en],
  ] as const) {
    for (const [ad, metin] of [
      ['ana.ocakbasi.altNot', s.ana.ocakbasi.altNot],
      ['menu.acilis.spot', s.menu.acilis.spot],
      ['sayfaMeta.menu.aciklama', s.ortak.sayfaMeta.menu.aciklama],
    ] as const) {
      assert.ok(metin.toLowerCase().includes(beklenen), `${dil} ${ad}: "${beklenen}" geçmiyor`)
    }
  }
})

/**
 * Ciğer porsiyonu 12 şiş (sahibi, 8 Ekim 2026). Tasarım ve metin-envanteri.json hâlâ 8
 * yazıyor; sayı altı ayrı metinde geçtiği için biri geride kalırsa bu test yakalar.
 */
test('sozluk_cigerPorsiyonu_heryerdeOnIkiSistir', () => {
  for (const s of [tr, en]) {
    assert.equal(s.ana.iddia.sayac1.deger, '12')
    assert.match(s.menu.ocakbasi.cigerSpec.sis, /^12 /)
    assert.match(s.hikaye.usul.olcuSisSayisi, /^12 /)
  }
})
