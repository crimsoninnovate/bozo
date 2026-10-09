import { GECE_OPAKLIGI } from '@/lib/oyun/gorsel'
import { eldeKaynagi } from '@/lib/oyun/surukle'
import type { Elde, Olay } from '@/lib/oyun/tipler'
import stil from './Saha.module.css'

/*
 * Anlık tepkiler (spec §12), Web Animations API ile: tepki aynı karede başlar,
 * 300 ms'yi geçmez, simülasyona dokunmaz. Hareket azaltılmışta tabloya göre yalnız
 * opaklık kalır; global CSS kuralı WAAPI'ye ulaşmadığı için tercih burada okunur.
 * Olaylar React'in yeniden çizmesinden ÖNCE gelir: hedef öğeler hep DOM'da durur
 * (paralar gizli bekler, yanık şiş, rozetler); uçuş kopya üstünde oynar.
 */

const ANLIK: KeyframeAnimationOptions = { duration: 120, easing: 'ease-out' }
const EGRI = 'cubic-bezier(0.2, 0.7, 0.2, 1)'

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

/** Kombo bozulunca rozet sarsılıp düşer ve yerine oturur; azaltılmışta söner ve belirir. */
export function komboKirildi(el: HTMLElement, azalt: boolean): void {
  const kareler = azalt
    ? [{ opacity: 1 }, { opacity: 0.3 }, { opacity: 1 }]
    : [
        { transform: 'none', opacity: 1 },
        { transform: 'translateX(-4px) rotate(-10deg)', offset: 0.2 },
        { transform: 'translate(3px, 6px) rotate(8deg)', opacity: 0.4, offset: 0.5 },
        { transform: 'none', opacity: 1 },
      ]
  el.animate(kareler, { duration: 420, easing: 'ease-out' })
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

const puanEl = (alan: HTMLElement) => alan.querySelector<HTMLElement>('[data-ciz="puan"]')

/** Kısa vuruş: büyür ve yaylanarak döner (kazanç anı). Azaltılmışta yok; parlama ve rakam yeter. */
function vur(el: HTMLElement | null, olcek: number, azalt: boolean): void {
  if (!el || azalt) return
  const kare = (o: number, offset: number): Keyframe => ({ transform: `scale(${o})`, offset })
  el.animate([kare(1, 0), kare(olcek, 0.35), kare(1, 1)], { duration: 220, easing: 'ease-out' })
}

/** Bahşiş rakamı paradan HUD puanına yay çizerek uçar, varınca puan vurur (sebep ile sonuç bağlanır). */
function puanaUc(alan: HTMLElement, kaynakEl: HTMLElement | null, metin: string): void {
  const puan = puanEl(alan)
  if (!kaynakEl || !puan) return
  const rakam = document.createElement('span')
  rakam.className = stil.ucanRakam ?? ''
  rakam.textContent = metin
  const k = alan.getBoundingClientRect()
  const a = kaynakEl.getBoundingClientRect()
  const b = puan.getBoundingClientRect()
  rakam.style.left = `${a.left + a.width / 2 - k.left}px`
  rakam.style.top = `${a.top - k.top}px`
  alan.append(rakam)
  const dx = b.left + b.width / 2 - a.left - a.width / 2
  const dy = b.top + b.height / 2 - a.top
  const yer = (x: number, y: number, o: number) => `translate(calc(-50% + ${x}px), ${y}px) scale(${o})`
  const kareler: Keyframe[] = [
    { transform: yer(0, 0, 1), opacity: 0 },
    { transform: yer(dx * 0.3, Math.min(dy, 0) - 36, 1.15), opacity: 1, offset: 0.3 },
    { transform: yer(dx, dy, 0.7), opacity: 0.9 },
  ]
  const bitir = () => {
    rakam.remove()
    vur(puan, 1.2, false)
  }
  rakam.animate(kareler, { duration: 560, easing: 'ease-in' }).finished.then(bitir, () => rakam.remove())
}

function titre(): void {
  if ('vibrate' in navigator) navigator.vibrate(12)
}

/** Halka söner, misafir kararıp kaybolur, boş yer geri gelir; hepsi opaklık. */
function kalkis(yer: HTMLElement | null): void {
  if (!yer) return
  const kareler = [{ opacity: 1 }, { opacity: 0.15, offset: 0.5 }, { opacity: 1 }]
  yer.animate(kareler, { duration: 600, easing: 'ease-in-out' })
  yer.querySelector('[data-kalkti]')?.animate(opaklik(1, 0), { duration: 700, easing: 'ease-in' })
}

/** Raf sallanır (spec §3); azaltılmışta yalnız dolu parlaması. */
function salla(el: HTMLElement | null, azalt: boolean): void {
  parla(el, stil.dolu)
  if (!el || azalt) return
  const x = (px: number) => ({ transform: `translateX(${px}px)` })
  el.animate([x(0), x(-3), x(3), x(-2), x(0)], { duration: 250, easing: 'ease-out' })
}

/** Gece her evrede biraz koyulaşır, son saatte tam `--gece`; 900 ms opaklık, azaltılmışta aynı. */
function geceIlerle(alan: HTMLElement, evre: number): void {
  const gece = alan.querySelector<HTMLElement>('[data-gece]')
  if (!gece) return
  const simdiki = Number(getComputedStyle(gece).opacity)
  for (const a of gece.getAnimations()) a.cancel()
  const secenek: KeyframeAnimationOptions = { duration: 900, easing: 'ease-out', fill: 'forwards' }
  gece.animate(opaklik(simdiki, GECE_OPAKLIGI[evre] ?? 1), secenek)
}

/** Teslim: bakır kıvılcımlar misafirden saçılır; azaltılmışta yok. */
function patlat(el: HTMLElement | null, azalt: boolean): void {
  if (!el || azalt) return
  for (let i = 0; i < 8; i++) {
    const parca = document.createElement('span')
    parca.className = stil.parca ?? ''
    el.append(parca)
    const aci = (i / 8) * 2 * Math.PI
    const uzaklik = i % 2 === 0 ? 34 : 24
    const son = `translate(calc(-50% + ${Math.cos(aci) * uzaklik}px), calc(-50% + ${Math.sin(aci) * uzaklik}px)) scale(0.3)`
    const kareler = [{ transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }, { transform: son, opacity: 0 }]
    const kaldir = () => parca.remove()
    parca.animate(kareler, { duration: 520, easing: EGRI }).finished.then(kaldir, kaldir)
  }
}

function yanik(yuva: HTMLElement | null): void {
  yuva?.querySelector('[data-yanik]')?.animate(opaklik(1, 0), { duration: 700, easing: 'ease-in' })
}

const kaynak = (alan: HTMLElement, el: Exclude<Elde, null>): HTMLElement | null => hedef(alan, eldeKaynagi(el) ?? '')

/** Sürüklenen öğe 180 ms'de yerine döner; azaltılmışta anlık. Yalnız girdi vermeyen ya da reddedilen bırakışta. */
export function yerineDon(tasinan: HTMLElement | null, azalt: boolean): void {
  if (!tasinan) return
  const simdiki = tasinan.style.transform
  tasinan.style.transform = ''
  tasinan.removeAttribute('data-tasinan')
  if (azalt || !simdiki) return
  tasinan.animate([{ transform: simdiki }, { transform: 'none' }], { duration: 180, easing: 'ease-out' })
}

/**
 * Uçuş: kaynaktaki `[data-tasinir]` kopyalanır (React aynı karede aslını değiştirir), köke eklenir,
 * 220 ms'de hedefin ortasına uçar ve silinir; azaltılmışta anında. Dokun-dokun yolunun "nereye gitti"si.
 * Sürüklenen öğe uçmaz: `data-suruklendi` köke yazılır ve burada tüketilir (Görev 14).
 */
export function ucus(alan: HTMLElement, kaynak: HTMLElement | null, hedef: HTMLElement | null, azalt: boolean): void {
  const asil = kaynak?.querySelector<HTMLElement>('[data-tasinir]')
  const suruklendi = alan.getAttribute('data-suruklendi')
  if (suruklendi !== null) {
    alan.removeAttribute('data-suruklendi')
    // Bayrak yalnız taze bırakışa aittir: sim girdiyi reddettiyse eski bayrak sonraki dokunuşun uçuşunu yutmasın.
    if (performance.now() - Number(suruklendi) < 400) return
  }
  if (!asil || !hedef || azalt) return
  const kopya = asil.cloneNode(true) as HTMLElement
  kopya.removeAttribute('data-tasinir')
  kopya.removeAttribute('data-elde')
  kopya.setAttribute('data-ucus', '')
  kopya.setAttribute('class', stil.hayalet ?? '')
  const a = asil.getBoundingClientRect()
  const b = hedef.getBoundingClientRect()
  const k = alan.getBoundingClientRect()
  kopya.style.left = `${a.left - k.left}px`
  kopya.style.top = `${a.top - k.top}px`
  kopya.style.width = `${a.width}px`
  kopya.style.height = `${a.height}px`
  alan.append(kopya)
  const dx = b.left + b.width / 2 - a.left - a.width / 2
  const dy = b.top + b.height / 2 - a.top - a.height / 2
  const kaldir = () => kopya.remove()
  kopya
    .animate([{ transform: 'translate(0, 0)' }, { transform: `translate(${dx}px, ${dy}px) scale(0.9)`, opacity: 0.6 }], { duration: 220, easing: EGRI })
    .finished.then(kaldir, kaldir)
}

/** Para belirir: zıplayarak; azaltılmışta yalnız opaklık. */
function paraBelir(para: HTMLElement | null, azalt: boolean): void {
  if (!para) return
  const kareler = azalt
    ? opaklik(0, 1)
    : [{ opacity: 0, transform: 'translateY(-14px) scale(1.3)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }]
  para.animate(kareler, { duration: 260, easing: EGRI })
}

function olayaTepki(alan: HTMLElement, olay: Olay, azalt: boolean): void {
  switch (olay.tur) {
    case 'tutuldu': {
      if (olay.el.tur !== 'sis') return
      const yuva = hedef(alan, `o${olay.el.yuva}`)
      parla(yuva, stil[olay.el.kalite])
      if (olay.el.kalite !== 'tam') return undefined
      vur(yuva, 1.12, azalt)
      return titre()
    }
    case 'tabagaKondu':
      ucus(alan, kaynak(alan, olay.el), hedef(alan, `t${olay.no}`), azalt)
      return parla(hedef(alan, `t${olay.no}`), stil.iyi)
    case 'tabakDolu':
      return salla(hedef(alan, `t${olay.no}`), azalt)
    case 'sisErken':
      return salla(hedef(alan, `o${olay.yuva}`), azalt)
    case 'sisYandi':
      return yanik(hedef(alan, `o${olay.yuva}`))
    case 'teslim':
      ucus(alan, hedef(alan, `t${olay.no}`), hedef(alan, `m${olay.yer}`), azalt)
      parla(hedef(alan, `m${olay.yer}`), stil.odedi)
      patlat(hedef(alan, `m${olay.yer}`), azalt)
      vur(puanEl(alan), 1.2, azalt)
      return ucanRakam(hedef(alan, `m${olay.yer}`), `+${olay.hesap}`, azalt)
    case 'yanlisTabak':
      return salla(hedef(alan, `m${olay.yer}`), azalt)
    case 'paraDustu':
      return paraBelir(hedef(alan, `p${olay.yer}`), azalt)
    case 'bahsisAlindi':
      return azalt
        ? ucanRakam(hedef(alan, `p${olay.yer}`), `+${olay.tutar}`, azalt)
        : puanaUc(alan, hedef(alan, `p${olay.yer}`), `+${olay.tutar}`)
    case 'copeGitti':
      ucus(alan, kaynak(alan, olay.el), hedef(alan, 'cop'), azalt)
      return salla(hedef(alan, 'cop'), azalt)
    case 'misafirKalkti':
      return olay.odedi ? undefined : kalkis(hedef(alan, `m${olay.yer}`))
    case 'rafDolu':
      return salla(hedef(alan, olay.urun), azalt)
    case 'evre':
      return geceIlerle(alan, olay.evre)
    default:
      return undefined
  }
}

export function olaylaraTepki(alan: HTMLElement, olaylar: readonly Olay[], azalt: boolean): void {
  for (const olay of olaylar) olayaTepki(alan, olay, azalt)
}
