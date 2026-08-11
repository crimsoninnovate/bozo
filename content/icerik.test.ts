import { test } from 'node:test'
import assert from 'node:assert/strict'
import { tr } from './tr/index.ts'
import { en } from './en/index.ts'
import { isletme } from './isletme.ts'
import { fotograflar } from './fotograflar.ts'
import { ICECEK_YER_TUTUCU_ADEDI, icecekler, ocaktanUrunler, ikramlar } from './urunler.ts'

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
 * Komşu çipleri yön bulma ipucudur, ölçüm değil. "80 m" mesafesi tasarımda
 * geçiyor ama isletmeGercekleri içinde karşılığı yok; işletme sahibi kaldırdı.
 * Tasarım ekran görüntüleri hala eski hali gösterdiği için ileride bir parite
 * turu bunu "eksik" sanıp geri ekleyebilir; bu test o yolu kapatır.
 * Doğrulanmış ölçüler (8 şiş, 4 ciğer, 3 dakika) bu desene takılmaz.
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

test('isletme_bilinmeyenAlanlarNullDur', () => {
  assert.equal(isletme.telefon, null)
  assert.equal(isletme.whatsapp, null)
  assert.equal(isletme.instagram, null)
  assert.equal(isletme.eposta, null)
  assert.equal(isletme.koordinat, null)
  assert.equal(isletme.postaKodu, null)
})

test('isletme_dogrulanmisAlanlarDoludur', () => {
  assert.equal(isletme.ad, 'Ciğerci Bozo')
  assert.equal(isletme.kisaAd, 'Bozo')
  assert.equal(isletme.kategori, 'Urfa usulü ciğerci')
  assert.equal(isletme.cadde, 'Naci Talat Caddesi')
  assert.equal(isletme.sehir, 'Girne')
  assert.equal(isletme.ulke, 'KKTC')
  assert.equal(isletme.sahip, 'Engin Çağlar')
  assert.equal(isletme.alkolServisi, false)
})

/**
 * Bina numarası handoff README'sinde (11 Ağustos 2026) ve dört tasarım
 * dosyasının hepsinde geçer. JSON-LD streetAddress bu alandan kurulur;
 * null kalırsa arama motorlarına eksik adres gider.
 */
test('isletme_binaNoDogrulanmisDegerTasir', () => {
  assert.equal(isletme.binaNo, 'Şht. Özdemir Apt No:4')
})

/**
 * Yapısal veri streetAddress alanını isletme.cadde ve isletme.binaNo üzerinden
 * kurar; görünen adres satırı sözlükten gelir. İkisi ayrışırsa arama motoruna
 * giden adres ile sayfadaki adres çelişir, yerel görünürlük bundan zarar görür.
 */
test('adres_yapisalVeGorunenAyniDegeriTasir', () => {
  assert.equal(`${isletme.cadde}, ${isletme.binaNo}`, tr.ortak.satirlar.adresTamSatir)
})

/** Menü tasarımında üç adlı içeceğin ardında tek kesik yer tutucu vardır. */
test('icecekler_tekYerTutucuSlotuVardir', () => {
  assert.equal(ICECEK_YER_TUTUCU_ADEDI, 1)
})

test('urunler_ocaktanBesUrundur', () => {
  assert.equal(ocaktanUrunler.length, 5)
  assert.deepEqual(
    ocaktanUrunler.map((u) => u.id),
    ['ciger', 'dalak', 'yurek', 'kuzu-sis', 'terbiyesiz-tavuk-sis'],
  )
})

test('ikramlar_fiyatTasimaz', () => {
  assert.equal(ikramlar.length, 2)
  for (const i of ikramlar) assert.equal('fiyat' in i, false)
})

/**
 * Fiyatlar işletmeden gelmedi ve uydurulması yasak. Bu, mekanik güvencesi olmayan
 * tek sert kuraldı: fiyat alanı sayı taşıyan bir sürüm diğer tüm testleri ve
 * tsc'yi temiz geçiyordu. Fiyat geldiğinde bu test bilinçli olarak güncellenir.
 */
test('urunler_hicbirFiyatUydurulmamis', () => {
  for (const u of [...ocaktanUrunler, ...icecekler]) {
    assert.equal(u.fiyat, null, `${u.id} için fiyat işletmeden gelmedi, uydurulamaz`)
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

test('fotograflar_hicbiriHenuzDosyaTasimaz', () => {
  for (const [id, foto] of Object.entries(fotograflar)) {
    assert.equal(foto.dosya, undefined, `${id} için fotoğraf henüz çekilmedi`)
    assert.ok(foto.etiket.length > 0, `${id} için kadraj etiketi boş`)
    assert.ok(foto.etiketEn.length > 0, `${id} için İngilizce kadraj etiketi boş`)
  }
})
