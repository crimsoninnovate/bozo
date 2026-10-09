import { useEffect, useState } from 'react'
import { ONAY_SURUMU, type SiraBilgisi, type TabloYaniti } from '@/lib/oyun/aktarim'
import { api, ApiHatasi, kanalCoz, tekrarDenenebilirMi } from '@/lib/oyun/api'
import {
  anahtarUret,
  enIyiOku,
  enIyiYaz,
  hesapOku,
  hesapSil,
  hesapYaz,
  rehberGorulduMu,
  type Hesap,
} from '@/lib/oyun/defter'
import { gonderimKarari } from '@/lib/oyun/giris'
import type { Girdi, Sonuc } from '@/lib/oyun/tipler'
import { rastgeleTohum } from '@/lib/oyun/tohum'

/*
 * "Önce oyna, sonra kaydet" (spec §7): tur başında jeton, sunucu yoksa çevrimdışı tur; sonuçta
 * katılmış oyuncu kendiliğinden gönderir, katılmamış olan "Bu skoru sıralamaya yaz" ile katılır.
 */
export type Gonderim =
  | { durum: 'cevrimdisi' }
  | { durum: 'bekliyor' }
  | { durum: 'gonderiliyor' }
  | { durum: 'gonderildi'; hafta: SiraBilgisi; buTurEnIyi: boolean }
  | { durum: 'hata' }
  | { durum: 'reddedildi' }

export type Ekran = 'giris' | 'oyun' | 'sonuc' | 'katilim'
export type Tur = { tohum: number; turId: string | null; rehberli: boolean; takmaAd: string | null }
export type Sunucu = 'bakiliyor' | 'var' | 'yok'
type Bekleyen = { turId: string; kayit: readonly Girdi[] }
export type Son = { sonuc: Sonuc; kayit: readonly Girdi[]; turId: string | null; onceki: number | null; yeni: boolean }
export type Kayit = 'tamam' | 'red' | 'hata'

/** Jeton sunucudan; ulaşılamazsa yerel tohumla çevrimdışı tur. */
async function jetonIste(takmaAd: string | null): Promise<Tur> {
  const rehberli = !rehberGorulduMu()
  try {
    const jeton = await api.turAl(kanalCoz(window.location.search))
    return { tohum: jeton.tohum, turId: jeton.turId, rehberli, takmaAd }
  } catch {
    return { tohum: rastgeleTohum(), turId: null, rehberli, takmaAd }
  }
}

/** Giriş ekranı açılınca sıralama ucuna bir kez bakılır: ad alanı yalnız sunucu varken görünür. */
function useSunucu() {
  const [durum, setDurum] = useState<{ sunucu: Sunucu; tablo: TabloYaniti | null }>({ sunucu: 'bakiliyor', tablo: null })
  useEffect(() => {
    let iptal = false
    api.tabloAl().then(
      (tablo) => !iptal && setDurum({ sunucu: 'var', tablo }),
      () => !iptal && setDurum({ sunucu: 'yok', tablo: null }),
    )
    return () => {
      iptal = true
    }
  }, [])
  return durum
}

/** Yanıtı kaybolmuş (yakılmış jeton) gönderim sırayı /ben'den alır; silinmiş hesap düşer. */
async function turuGonder(turId: string, kayit: readonly Girdi[], hesap: Hesap): Promise<Gonderim | 'hesapYok'> {
  try {
    const yanit = await api.turBitir(turId, hesap.anahtar, kayit)
    return { durum: 'gonderildi', hafta: yanit.hafta, buTurEnIyi: yanit.buTurEnIyi }
  } catch (hata) {
    if (!(hata instanceof ApiHatasi)) return { durum: 'hata' }
    if (hata.durum === 401) return 'hesapYok'
    if (hata.kod === 'jetonKullanildi') {
      const ben = await api.benAl(hesap.anahtar).catch(() => null)
      if (ben?.hafta) return { durum: 'gonderildi', hafta: ben.hafta, buTurEnIyi: false }
    }
    return { durum: tekrarDenenebilirMi(hata) ? 'hata' : 'reddedildi' }
  }
}

/** Hesap ve gönderim durumu. Depolama yalnız tarayıcıda: ilk çizim sunucu çıktısıyla aynı kalır. */
function useGonderim() {
  const [hesap, setHesap] = useState<Hesap | null>(null)
  const [gonderim, setGonderim] = useState<Gonderim>({ durum: 'cevrimdisi' })
  useEffect(() => setHesap(hesapOku()), [])

  const gonder = async (turId: string, kayit: readonly Girdi[], kimin: Hesap) => {
    setGonderim({ durum: 'gonderiliyor' })
    const sonuc = await turuGonder(turId, kayit, kimin)
    if (sonuc !== 'hesapYok') return setGonderim(sonuc)
    hesapSil()
    setHesap(null)
    setGonderim({ durum: 'bekliyor' })
  }

  /** Katılım: anahtar üretilir, sunucuya kayıt, tarayıcıya yazım; sonra bekleyen tur gönderilir. */
  const kaydet = async (takmaAd: string, bekleyen: Bekleyen | null): Promise<Kayit> => {
    const anahtar = anahtarUret()
    try {
      await api.oyuncuOl(takmaAd, anahtar, ONAY_SURUMU)
    } catch (hata) {
      return hata instanceof ApiHatasi && hata.durum === 422 ? 'red' : 'hata'
    }
    const yeniHesap = { anahtar, takmaAd }
    hesapYaz(yeniHesap)
    setHesap(yeniHesap)
    if (bekleyen) void gonder(bekleyen.turId, bekleyen.kayit, yeniHesap)
    return 'tamam'
  }

  return { hesap, gonderim, setGonderim, gonder, kaydet }
}

export function useOyunAkisi() {
  const [ekran, setEkran] = useState<Ekran>('giris')
  const [tur, setTur] = useState<Tur | null>(null)
  const [son, setSon] = useState<Son | null>(null)
  const [bekliyor, setBekliyor] = useState(false)
  const { hesap, gonderim, setGonderim, gonder, kaydet } = useGonderim()
  const { sunucu, tablo } = useSunucu()

  const basla = async (takmaAd: string | null) => {
    if (bekliyor) return
    setBekliyor(true)
    const yeniTur = await jetonIste(takmaAd)
    setBekliyor(false)
    setTur(yeniTur)
    setEkran('oyun')
  }

  const bitir = (sonuc: Sonuc, kayit: readonly Girdi[]) => {
    const onceki = enIyiOku()
    const yeni = enIyiYaz(sonuc.puan)
    const turId = tur?.turId ?? null
    setSon({ sonuc, kayit, turId, onceki, yeni })
    setEkran('sonuc')
    switch (gonderimKarari(turId, hesap, tur?.takmaAd ?? null)) {
      case 'cevrimdisi':
        return setGonderim({ durum: 'cevrimdisi' })
      case 'sor':
        return setGonderim({ durum: 'bekliyor' })
      case 'gonder':
        return void gonder(turId as string, kayit, hesap as Hesap)
      case 'kaydet':
        return void kaydetVeGonder(tur?.takmaAd as string, turId as string, kayit)
    }
  }

  /** Giriş ekranındaki ad: hesabı açıp turu gönderir; ad reddedilir ya da ağ düşerse sonuç ekranındaki düğmeye döner. */
  const kaydetVeGonder = async (takmaAd: string, turId: string, kayit: readonly Girdi[]) => {
    setGonderim({ durum: 'gonderiliyor' })
    if ((await kaydet(takmaAd, { turId, kayit })) !== 'tamam') setGonderim({ durum: 'bekliyor' })
  }

  return {
    ekran, tur, son, gonderim, hesap, bekliyor, sunucu, tablo, basla, bitir,
    kaydet: async (takmaAd: string) => {
      const sonuc = await kaydet(takmaAd, son?.turId ? { turId: son.turId, kayit: son.kayit } : null)
      if (sonuc === 'tamam') setEkran('sonuc')
      return sonuc
    },
    tekrarDene: () => {
      if (son?.turId && hesap) void gonder(son.turId, son.kayit, hesap)
    },
    katil: () => setEkran('katilim'),
    vazgec: () => setEkran('sonuc'),
    cik: () => setEkran('giris'),
  }
}
