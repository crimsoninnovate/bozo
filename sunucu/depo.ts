import type { Kanal } from '../lib/oyun/aktarim.ts'
import type { Bitis, Girdi, Ozet } from '../lib/oyun/tipler.ts'

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

/** `gizli` oyuncunun o anki bayrağı; oyuncu silinmişse false. */
export type Kazanan = Omit<YeniKazanan, 'oyuncuId'> & {
  id: number
  oyuncuId: number | null
  gizli: boolean
  kullanildi: number | null
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

  kapat(): Promise<void>
}
