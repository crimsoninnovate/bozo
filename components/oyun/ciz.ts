import { AYRAN_TIK, SOGUMA_TIK, TUR_TIK } from '@/lib/oyun/ayar'
import type { Duyuru } from '@/lib/oyun/duyuru'
import { kivilcimYogunlugu, korYogunlugu, pismeOrani, sabirDurumu, yanmaOrani } from '@/lib/oyun/gorsel'
import { oyunSaati, sisGorunumu } from '@/lib/oyun/gosterim'
import { komboCarpani } from '@/lib/oyun/puan'
import type { Hedef, Oyun } from '@/lib/oyun/tipler'
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

/** Bir çizim öğesinin bu karedeki değeri; `data-ciz` adına göre. */
function ogeyiCiz(el: HTMLElement, oyun: Oyun, azalt: boolean): void {
  const no = Number(el.dataset.no)
  const sofra = oyun.sofralar[no]
  const kalem = oyun.tezgah[no]
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
      const oran = sofra ? sofra.sabir / sofra.toplamSabir : 0
      degiskenYaz(el, '--oran', oran)
      return nitelikYaz(el, 'sabir', sabirDurumu(oran))
    }
    case 'ocak':
      return ocagiCiz(el, oyun, no)
    case 'soguma':
      return degiskenYaz(el, '--oran', kalem ? 1 - kalem.bekleme / SOGUMA_TIK : 0)
    case 'ayran':
      return degiskenYaz(el, '--oran', oyun.ayran === null ? 0 : 1 - oyun.ayran / AYRAN_TIK)
    case 'kor':
      return degiskenYaz(el, '--kor-yogunluk', korYogunlugu(oyun.kombo))
    case 'kivilcim':
      return degiskenYaz(el, '--oran', kivilcimYogunlugu(oyun))
  }
}

/** Bütün `data-ciz` öğeleri, ipucu halkası ve evre niteliği. */
export function sahayiCiz(alan: HTMLElement, oyun: Oyun, ipucu: Hedef | null, azalt: boolean): void {
  for (const el of alan.querySelectorAll<HTMLElement>('[data-ciz]')) ogeyiCiz(el, oyun, azalt)
  for (const el of alan.querySelectorAll<HTMLElement>('[data-hedef]')) {
    el.toggleAttribute('data-ipucu', el.dataset.hedef === ipucu)
  }
  nitelikYaz(alan, 'evre', String(oyun.evre))
}

/** Canlı bölgeye bu karenin duyurusu; metin sözlükten, `{puan}` ödemeyle değişir. */
export function duyuruYaz(alan: HTMLElement, duyuru: Duyuru | null, metinler: Record<Duyuru['anahtar'], string>): void {
  if (!duyuru) return
  const bolge = alan.querySelector<HTMLElement>('[data-duyuru]')
  if (!bolge) return
  bolge.textContent = metinler[duyuru.anahtar].replace('{puan}', String(duyuru.puan ?? ''))
}
