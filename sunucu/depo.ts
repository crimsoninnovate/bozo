import type { TaramaSatiri } from '../lib/masa.ts'
import type { MenuBelgesi } from '../lib/menu/tipler.ts'
import type { Kanal } from '../lib/oyun/aktarim.ts'
import type { Bitis, Girdi, Ozet } from '../lib/oyun/tipler.ts'
import type { IslemTuru } from '../lib/yonetim/personel.ts'

/*
 * Depo arabirimi (spec §10 tabloları): `bellekDepo` uç testleri için, `mariaDepo` üretim için.
 * Zamanlar epoch milisaniye; saat dilimi yorumu yalnız `donem.ts`'te yapılır.
 */

export type Jeton = {
  id: string
  tohum: number
  kanal: Kanal
  olusturma: number
  sonaErme: number
  kullanildi: boolean
}

export type Oyuncu = { id: number; takmaAd: string; gizli: boolean }

export type YeniOyuncu = {
  anahtarOzeti: string
  takmaAd: string
  adKatlanmis: string
  onaySurumu: string
  simdi: number
}

export type YeniTur = {
  jetonId: string
  oyuncuId: number
  donem: string
  tohum: number
  puan: number
  ozet: Ozet
  bitti: Bitis
  tik: number
  kanal: Kanal
  supheli: boolean
  girdiler: readonly Girdi[]
  olusturma: number
}

export type Tur = Omit<YeniTur, 'girdiler'> & { id: number; takmaAd: string; girdiler: Girdi[] | null }

/** Sıralama satırı: oyuncunun bir turu; `siralama` her oyuncu için en iyisini döner. */
export type SiraSatiri = {
  turId: number
  oyuncuId: number
  takmaAd: string
  gizli: boolean
  supheli: boolean
  puan: number
  tamKivam: number
  kalkan: number
  olusturma: number
}

export type Donem = { anahtar: string; baslangic: number; bitis: number; kapanis: number | null }

export type YeniKazanan = {
  donem: string
  sira: number
  oyuncuId: number
  takmaAd: string
  puan: number
  kodOzeti: string
  /** Kod türetme sayacı: aynı özet başka dönemden çıkmışsa artar (`isler.ts`). */
  deneme: number
  gecerlilik: number
}

/** `gizli` oyuncunun o anki bayrağı; oyuncu silinmişse silindiği andaki bayrak. */
export type Kazanan = Omit<YeniKazanan, 'oyuncuId'> & {
  id: number
  oyuncuId: number | null
  gizli: boolean
  kullanildi: number | null
}

export type MenuKaynagi = 'panel' | 'geriAl'

/** Admin dışındaki panel hesabı; `oturumSurumu` kapatma ve şifre değişiminde artar, eski anahtarlar düşer. */
export type Personel = {
  id: number
  ad: string
  parolaOzeti: string
  sifreDegismeli: boolean
  kapali: boolean
  oturumSurumu: number
  olusturma: number
  sonGiris: number | null
}

/** `personelId` null: admin (ortamdaki kimlik). `ayrinti` kısa; şifre ya da belge içeriği taşımaz. */
export type Islem = {
  id: number
  personelId: number | null
  ad: string
  tur: IslemTuru
  ayrinti: string
  zaman: number
}

export type Depo = {
  jetonEkle(jeton: Jeton): Promise<void>
  jetonBul(id: string): Promise<Jeton | null>
  /** Kullanılmamışsa tek adımda kullanılmış yapar ve true döner; yarışta ikinci çağrı false alır. */
  jetonKullan(id: string): Promise<boolean>
  suresiDolanJetonlariSil(simdi: number): Promise<number>

  oyuncuEkle(oyuncu: YeniOyuncu): Promise<Oyuncu | 'adKullanimda'>
  oyuncuBul(anahtarOzeti: string): Promise<Oyuncu | null>
  oyuncuGizle(id: number, gizli: boolean): Promise<boolean>
  oyuncuSil(id: number): Promise<boolean>
  /** Son etkinliği (son tur, yoksa kayıt) sınırdan eski oyuncuları turlarıyla siler. */
  eskiOyunculariSil(oncesi: number): Promise<number>

  turEkle(tur: YeniTur): Promise<number>
  turBul(id: number): Promise<Tur | null>
  /** Dönemde her oyuncunun en iyi turu, spec §6 sırasıyla. */
  siralama(donem: string): Promise<SiraSatiri[]>
  tumZamanlar(adet: number): Promise<SiraSatiri[]>
  /** Dönemdeki turların dokunuş kaydını siler; `korunan` listesindekiler kalır. */
  girdileriKirp(donem: string, korunan: readonly number[]): Promise<number>
  /** Bitişi sınırdan eski dönemlerin bütün dokunuş kayıtlarını siler. */
  eskiGirdileriSil(bitisiOncesi: number): Promise<number>

  donemKaydet(donem: Donem): Promise<void>
  acikDonemler(): Promise<Donem[]>
  donemKapat(anahtar: string, simdi: number): Promise<void>

  kazananEkle(kazanan: YeniKazanan): Promise<number>
  kazananlar(donem: string): Promise<Kazanan[]>
  sonSampiyon(): Promise<Kazanan | null>
  oyuncununOdulu(oyuncuId: number): Promise<Kazanan | null>
  kazananBul(kodOzeti: string): Promise<Kazanan | null>
  kazananKullan(id: number, simdi: number): Promise<boolean>
  kazananlariSil(): Promise<number>

  sayacArtir(gun: string, kanal: Kanal): Promise<void>
  sayaclar(gun: string): Promise<Record<Kanal, number>>

  /** Masa plakası QR okuması, gün ve masa başına bir sayaç; kişiye ait hiçbir şey tutulmaz. */
  taramaArtir(gun: string, masa: number): Promise<void>
  /** Okunmuş her masa için bir satır, masa sırasıyla; `haftaBasi` dahil o günden bu yana. */
  taramaOzeti(bugun: string, haftaBasi: string): Promise<TaramaSatiri[]>

  /** En son yayınlanan menü sürümü; hiç sürüm yoksa null. */
  menuGecerli(): Promise<{ id: number; belge: MenuBelgesi } | null>
  /**
   * Yeni sürüm ekler ve kimliğini döner. `taban` son sürümün kimliği (hiç sürüm yoksa null); güncel
   * değilse hiçbir şey yazılmaz ve null döner. Denetim ve ekleme tek adımdır.
   */
  menuYayinla(
    belge: MenuBelgesi, kaynak: MenuKaynagi, simdi: number, taban: number | null, yazar?: string | null,
  ): Promise<number | null>
  /** En yeniden eskiye, en çok `adet` sürüm (belgesiz özet); `yazar` bu özellikten önceki sürümlerde null. */
  menuSurumleri(adet: number): Promise<{ id: number; olusturma: number; kaynak: MenuKaynagi; yazar: string | null }[]>
  menuSurumBul(id: number): Promise<{ id: number; belge: MenuBelgesi } | null>

  /** Yeni hesap `sifreDegismeli`, `oturumSurumu` 1; ad doluysa 'adKullanimda'. */
  personelEkle(ad: string, parolaOzeti: string, simdi: number): Promise<Personel | 'adKullanimda'>
  personelBul(id: number): Promise<Personel | null>
  personelAdla(ad: string): Promise<Personel | null>
  /** Ada göre sıralı. */
  personelListesi(): Promise<Personel[]>
  /** Özeti ve bayrağı yazar, `oturumSurumu`'nu bir artırır; hesap yoksa null. */
  personelSifreKoy(id: number, parolaOzeti: string, sifreDegismeli: boolean): Promise<Personel | null>
  /** `kapali`'yı yazar, `oturumSurumu`'nu bir artırır; hesap yoksa null. */
  personelKapat(id: number, kapali: boolean): Promise<Personel | null>
  personelGirisKaydet(id: number, simdi: number): Promise<void>

  islemEkle(islem: Omit<Islem, 'id'>): Promise<void>
  /** Yeniden eskiye en çok `adet`; `personelId` verilirse yalnız o hesap (null: yalnız admin). */
  islemler(adet: number, personelId?: number | null): Promise<Islem[]>
  eskiIslemleriSil(oncesi: number): Promise<number>

  kapat(): Promise<void>
}
