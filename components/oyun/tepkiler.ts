import { PUAN } from '@/lib/oyun/ayar'
import type { Olay } from '@/lib/oyun/tipler'
import stil from './Saha.module.css'

/*
 * Anlık tepkiler (spec §12), Web Animations API ile: tepki aynı karede başlar,
 * 300 ms'yi geçmez, simülasyona dokunmaz. Hareket azaltılmışta tabloya göre yalnız
 * opaklık kalır; global CSS kuralı WAAPI'ye ulaşmadığı için tercih burada okunur.
 * Olaylar React'in yeniden çizmesinden ÖNCE gelir: hedef öğeler hep DOM'da durur
 * (tabaklar, yanık şiş, rozetler gizli bekler), tezgah kalemi henüz yerindedir.
 */

const ANLIK: KeyframeAnimationOptions = { duration: 120, easing: 'ease-out' }
const EGRI = 'cubic-bezier(0.2, 0.7, 0.2, 1)'
const DONUS: KeyframeAnimationOptions = { duration: 180, easing: 'ease-in-out' }

const hedef = (alan: HTMLElement, h: string) => alan.querySelector<HTMLElement>(`[data-hedef="${h}"]`)
const opaklik = (bas: number, son: number): Keyframe[] => [{ opacity: bas }, { opacity: son }]

/** Dokunma: hedef bastırılır ve yaylanır (ağırlık hissi), dolgu 120 ms; azaltılmışta yalnız dolgu. */
export function dokunus(el: HTMLElement | null, azalt: boolean): void {
  if (!el) return
  el.querySelector<HTMLElement>('[data-dolgu]')?.animate(opaklik(0.85, 0), ANLIK)
  if (azalt) return
  const olcek = (o: number, offset: number): Keyframe => ({ transform: `scale(${o})`, offset })
  el.animate([olcek(1, 0), olcek(0.93, 0.3), olcek(1.04, 0.65), olcek(1, 1)], { duration: 230, easing: 'ease-out' })
}

/** Sınıfı söküp takar: CSS parlaması baştan oynar. Azaltılmışta animasyon yok, taban opaklık 0 kalır. */
function parla(el: HTMLElement | null, sinif: string | undefined): void {
  if (!el || !sinif) return
  el.classList.remove(sinif)
  void el.offsetWidth
  el.classList.add(sinif)
}

/** Rozet mühür gibi basılır; azaltılmışta belirir. */
export function muhurBas(el: HTMLElement, azalt: boolean): void {
  const kareler = azalt
    ? opaklik(0, 1)
    : [{ transform: 'scale(1.7)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }]
  el.animate(kareler, { duration: 220, easing: EGRI })
}

/** "+150" ya da fiş ödemesi yükselir; azaltılmışta yerinde belirip söner. */
function ucanRakam(el: HTMLElement | null, metin: string, azalt: boolean): void {
  if (!el) return
  const rakam = document.createElement('span')
  rakam.className = stil.ucanRakam ?? ''
  rakam.textContent = metin
  el.append(rakam)
  const kareler: Keyframe[] = azalt
    ? [{ opacity: 0 }, { opacity: 1, offset: 0.2 }, { opacity: 1, offset: 0.75 }, { opacity: 0 }]
    : [
        { opacity: 0, transform: 'translate(-50%, 0)' },
        { opacity: 1, offset: 0.2 },
        { opacity: 0, transform: 'translate(-50%, -28px)' },
      ]
  const kaldir = () => rakam.remove()
  rakam.animate(kareler, { duration: 700, easing: 'ease-out' }).finished.then(kaldir, kaldir)
}

/** İkram tabakları sırayla iner, lebeni önce; azaltılmışta çapraz geçiş. */
function tabaklarIner(sofra: HTMLElement | null, azalt: boolean): void {
  sofra?.querySelectorAll<HTMLElement>('[data-tabak]').forEach((tabak, i) => {
    const kareler = azalt
      ? opaklik(0, 1)
      : [
          { opacity: 0, transform: 'translateY(-10px) scale(1.3)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ]
    tabak.animate(kareler, { duration: 200, delay: i * 70, easing: 'ease-out', fill: 'backwards' })
  })
}

/** 180 ms dönüş ve çevrilen yüzde küçük kıvılcım; azaltılmışta yüz anında değişir (CSS). */
function cevir(yuva: HTMLElement | null, azalt: boolean): void {
  if (!yuva || azalt) return
  yuva.querySelector('[data-sis]')?.animate([{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(180deg)' }], DONUS)
  const kivilcim = [
    { opacity: 1, transform: 'translateY(0)' },
    { opacity: 0, transform: 'translateY(-14px)' },
  ]
  yuva.querySelector('[data-kivilcim]')?.animate(kivilcim, { duration: 220, easing: 'ease-out' })
}

function titre(): void {
  if ('vibrate' in navigator) navigator.vibrate(12)
}

/** Şiş tezgahtan sofraya kavisle uçar (250 ms), tabak oturur; azaltılmışta çapraz geçiş. */
function servisUcusu(alan: HTMLElement, sofra: HTMLElement | null, urun: string, azalt: boolean): void {
  const kalem = alan.querySelector<HTMLElement>(`[data-tezgah] [data-urun="${urun}"] svg`)
  if (!sofra || !kalem) return
  const fis = sofra.querySelector<HTMLElement>('[data-fis]')
  if (azalt) {
    fis?.animate(opaklik(0.2, 1), { duration: 250, easing: 'ease-out' })
    return
  }
  const hayalet = kalem.cloneNode(true) as SVGElement
  hayalet.setAttribute('class', stil.hayalet ?? '')
  const a = kalem.getBoundingClientRect()
  const b = sofra.getBoundingClientRect()
  hayalet.style.left = `${a.left}px`
  hayalet.style.top = `${a.top}px`
  document.body.append(hayalet)
  const dx = b.left + b.width / 2 - a.left - a.width / 2
  const dy = b.top + b.height / 2 - a.top - a.height / 2
  const kavis = [
    { transform: 'translate(0, 0) scale(1)' },
    { transform: `translate(${dx / 2}px, ${Math.min(dy / 2, 0) - 36}px) scale(1.25)`, offset: 0.5 },
    { transform: `translate(${dx}px, ${dy}px) scale(0.9)` },
  ]
  const kaldir = () => hayalet.remove()
  hayalet.animate(kavis, { duration: 250, easing: 'ease-in-out' }).finished.then(kaldir, kaldir)
  const oturma = [{ transform: 'scale(1)' }, { transform: 'scale(1.12)', offset: 0.5 }, { transform: 'scale(1)' }]
  fis?.animate(oturma, { duration: 160, delay: 250, easing: 'ease-out' })
}

/** Halka söner, sofra kararıp kaybolur, boş sofra geri gelir; hepsi opaklık. */
function kalkis(sofra: HTMLElement | null): void {
  if (!sofra) return
  const kareler = [{ opacity: 1 }, { opacity: 0.15, offset: 0.5 }, { opacity: 1 }]
  sofra.animate(kareler, { duration: 600, easing: 'ease-in-out' })
  sofra.querySelector('[data-kalkti]')?.animate(opaklik(1, 0), { duration: 700, easing: 'ease-in' })
}

/** Raf sallanır (spec §3); azaltılmışta yalnız dolu parlaması. */
function salla(el: HTMLElement | null, azalt: boolean): void {
  parla(el, stil.dolu)
  if (!el || azalt) return
  const x = (px: number) => ({ transform: `translateX(${px}px)` })
  el.animate([x(0), x(-3), x(3), x(-2), x(0)], { duration: 250, easing: 'ease-out' })
}

function porsiyonRozeti(alan: HTMLElement, azalt: boolean): void {
  const kareler = [
    { opacity: 0, transform: azalt ? 'none' : 'scale(1.7)' },
    { opacity: 1, transform: 'scale(1)', offset: 0.15 },
    { opacity: 1, offset: 0.8 },
    { opacity: 0 },
  ]
  alan.querySelector('[data-rozet="porsiyon"]')?.animate(kareler, { duration: 1800, easing: EGRI })
}

/** Son saat: sahne `--gece`ye geçer, 900 ms; iki modda da opaklık, yani azaltılmışta aynı. */
function sonSaat(alan: HTMLElement): void {
  const secenek: KeyframeAnimationOptions = { duration: 900, easing: 'ease-out', fill: 'forwards' }
  alan.querySelector('[data-gece]')?.animate(opaklik(0, 1), secenek)
}

function yanik(yuva: HTMLElement | null): void {
  yuva?.querySelector('[data-yanik]')?.animate(opaklik(1, 0), { duration: 700, easing: 'ease-in' })
}

function olayaTepki(alan: HTMLElement, olay: Olay, azalt: boolean): void {
  switch (olay.tur) {
    case 'sofraKuruldu':
      return tabaklarIner(hedef(alan, `s${olay.sofra}`), azalt)
    case 'sisCevrildi':
      return cevir(hedef(alan, `o${olay.yuva}`), azalt)
    case 'sisAlindi': {
      const yuva = hedef(alan, `o${olay.yuva}`)
      parla(yuva, stil[olay.kalite])
      if (olay.kalite !== 'tam') return
      ucanRakam(yuva, `+${PUAN.tamKivam}`, azalt)
      return titre()
    }
    case 'sisYandi':
      return yanik(hedef(alan, `o${olay.yuva}`))
    case 'servis':
      return servisUcusu(alan, hedef(alan, `s${olay.sofra}`), olay.urun, azalt)
    case 'fisTamam':
      parla(hedef(alan, `s${olay.sofra}`), stil.odedi)
      return ucanRakam(hedef(alan, `s${olay.sofra}`), `+${olay.odeme}`, azalt)
    case 'sofraKalkti':
      return olay.odedi ? undefined : kalkis(hedef(alan, `s${olay.sofra}`))
    case 'rafDolu':
      return salla(hedef(alan, olay.urun), azalt)
    case 'tezgahDolu':
      return parla(alan.querySelector<HTMLElement>('[data-tezgah]'), stil.dolu)
    case 'porsiyon':
      return porsiyonRozeti(alan, azalt)
    case 'evre':
      return olay.evre === 4 ? sonSaat(alan) : undefined
    default:
      return undefined
  }
}

export function olaylaraTepki(alan: HTMLElement, olaylar: readonly Olay[], azalt: boolean): void {
  for (const olay of olaylar) olayaTepki(alan, olay, azalt)
}
