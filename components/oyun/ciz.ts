import { TUR_TIK } from '@/lib/oyun/ayar'
import type { Duyuru } from '@/lib/oyun/duyuru'
import { kivilcimYogunlugu, korYogunlugu, paraOrani, pismeOrani, sabirDurumu, yanmaOrani } from '@/lib/oyun/gorsel'
import { oyunSaati, sisGorunumu } from '@/lib/oyun/gosterim'
import { doldur } from '@/lib/metin'
import { komboCarpani } from '@/lib/oyun/puan'
import type { Kalem, Oyun } from '@/lib/oyun/tipler'
import type { Metin } from './Serit'
import { muhurBas } from './tepkiler'

/*
 * Her karede değişen değerler DOM'a buradan yazılır (spec §10): React'e uğramaz.
 * Her yazım korumalı: değer aynıysa stile dokunulmaz, 120 Hz ekranda boş kare
 * yazmaz; ölçüldü, korumasız `--oran` yazımı her karede stil yeniden hesaplatıyordu.
 */

const sonDegerler = new WeakMap<HTMLElement, Record<string, string>>()

export function degiskenYaz(el: HTMLElement, ad: string, deger: number): void {
  const yeni = deger.toFixed(3)
  const kayit = sonDegerler.get(el) ?? {}
  if (kayit[ad] === yeni) return
  kayit[ad] = yeni
  sonDegerler.set(el, kayit)
  el.style.setProperty(ad, yeni)
}

export function metinYaz(el: HTMLElement | null, metin: string): void {
  if (el && el.textContent !== metin) el.textContent = metin
}

function nitelikYaz(el: HTMLElement, ad: string, deger: string): void {
  if (el.dataset[ad] !== deger) el.dataset[ad] = deger
}

/** Çarpan değişince rakam yazılır; yükseldiyse rozet mühür gibi basılır (spec §12). */
function komboYaz(el: HTMLElement, kombo: number, azalt: boolean): void {
  const carpan = komboCarpani(kombo)
  const onceki = Number(el.dataset.carpan ?? 1)
  if (carpan === onceki) return
  el.dataset.carpan = String(carpan)
  metinYaz(el.querySelector<HTMLElement>('[data-kombo]'), `×${carpan}`)
  if (carpan > onceki) muhurBas(el, azalt)
}

function ocagiCiz(el: HTMLElement, oyun: Oyun, no: number): void {
  const sis = oyun.ocak[no]
  if (!sis) {
    // Boşalan yuva son şişin rayını taşımasın.
    nitelikYaz(el, 'gorunum', 'bos')
    degiskenYaz(el, '--oran', 0)
    degiskenYaz(el, '--pisme', 0)
    return degiskenYaz(el, '--yanma', 0)
  }
  nitelikYaz(el, 'gorunum', sisGorunumu(sis))
  degiskenYaz(el, '--oran', sis.gecen / (sis.pisme + sis.pencere))
  degiskenYaz(el, '--pisme', pismeOrani(sis))
  degiskenYaz(el, '--yanma', yanmaOrani(sis))
}

/** Düğme adının durum parçası: yalnız değişince yazılır (ekran okuyucu her tikte yeniden okumasın). */
function durumMetni(el: HTMLElement, oyun: Oyun, no: number, metin: Metin): void {
  if (el.dataset.ciz === 'ocakMetni') {
    const sis = oyun.ocak[no]
    const elde = oyun.el?.tur === 'sis' && oyun.el.yuva === no
    return metinYaz(el, elde ? metin.durum.elde : sis ? metin.durum[sis.gecen < sis.pisme ? 'pisiyor' : 'hazir'] : '')
  }
  const yer = oyun.misafirler[no]
  const yuzde = yer ? Math.round((yer.sabir / yer.toplamSabir) * 10) * 10 : 0
  metinYaz(el, yer && yer.kalkis === null ? doldur(metin.durum.sabir, { yuzde }) : '')
}

/** Bir çizim öğesinin bu karedeki değeri; `data-ciz` adına göre. */
function ogeyiCiz(el: HTMLElement, oyun: Oyun, azalt: boolean, metin: Metin): void {
  const no = Number(el.dataset.no)
  switch (el.dataset.ciz) {
    case 'saat':
      return metinYaz(el, oyunSaati(oyun.tik))
    case 'gece':
      return degiskenYaz(el, '--oran', oyun.tik / TUR_TIK)
    case 'puan':
      return metinYaz(el, String(oyun.puan))
    case 'kombo':
      return komboYaz(el, oyun.kombo, azalt)
    case 'sabir': {
      const yer = oyun.misafirler[no]
      const oran = yer ? yer.sabir / yer.toplamSabir : 0
      degiskenYaz(el, '--oran', oran)
      return nitelikYaz(el, 'sabir', sabirDurumu(oran))
    }
    case 'sabirMetni':
    case 'ocakMetni':
      return durumMetni(el, oyun, no, metin)
    case 'ocak':
      return ocagiCiz(el, oyun, no)
    case 'para':
      return degiskenYaz(el, '--oran', paraOrani(oyun.paralar[no] ?? null))
    case 'kor':
      return degiskenYaz(el, '--kor-yogunluk', korYogunlugu(oyun.kombo))
    case 'kivilcim':
      return degiskenYaz(el, '--oran', kivilcimYogunlugu(oyun))
  }
}

/** Bütün `data-ciz` öğeleri ve evre niteliği. */
export function sahayiCiz(alan: HTMLElement, oyun: Oyun, azalt: boolean, metin: Metin): void {
  for (const el of alan.querySelectorAll<HTMLElement>('[data-ciz]')) ogeyiCiz(el, oyun, azalt, metin)
  nitelikYaz(alan, 'evre', String(oyun.evre))
}

/** Canlı bölgeye bu karenin duyurusu; metin sözlükten, yer tutucular olaydan. */
export function duyuruYaz(alan: HTMLElement, duyuru: Duyuru | null, metin: Metin, ad: (k: Kalem) => string): void {
  if (!duyuru) return
  const bolge = alan.querySelector<HTMLElement>('[data-duyuru]')
  if (!bolge) return
  const degerler = { puan: duyuru.puan ?? '', no: duyuru.no ?? '', urun: duyuru.urun ? ad(duyuru.urun) : '' }
  bolge.textContent = doldur(metin.duyuru[duyuru.anahtar], degerler)
}
