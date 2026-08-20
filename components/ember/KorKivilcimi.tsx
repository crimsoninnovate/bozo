'use client'

import { useEffect, useRef } from 'react'
import { rafKisitla, useHareketAzaltilmisMi } from '@/lib/hareket'
import stil from './KorKivilcimi.module.css'

type Kivilcim = {
  x: number
  y: number
  hiz: number
  savrulma: number
  faz: number
  kenar: number
  omur: number
  yas: number
  sicak: boolean
}

/**
 * Yoğunluk alana bağlı: dar ekranda az, geniş ekranda çok. Bölen ölçümle
 * seçildi; 26000 ile 390x844'te yalnız 18 tane düşüyordu ve ekranda hiç
 * okunmuyordu. 9000 aynı ekrana 37, 1440x900'e tavan olan 120 tane koyuyor.
 */
// Palet: bakır sıcak nokta, kor gövde. Canvas CSS'i okumaz, o yüzden token'lar
// mount'ta bir kez çözülür; yedekler siyah paletin değerleri. Sabit bırakılamaz:
// kor palete göre değişiyor (siyahta #AD2624, bordoda #C13029) ve literal kalsaydı
// kıvılcımlar palet takasını duymazdı.
const SICAK_YEDEK = 'rgb(209, 158, 102)'
const KOR_YEDEK = 'rgb(173, 38, 36)'

function tokenRengi(ad: string, yedek: string): string {
  if (typeof window === 'undefined') return yedek
  const deger = getComputedStyle(document.documentElement).getPropertyValue(ad).trim()
  return deger || yedek
}

function adet(en: number, boy: number): number {
  return Math.round(Math.min(120, Math.max(30, (en * boy) / 9000)))
}

function yeniKivilcim(en: number, boy: number, ilk: boolean): Kivilcim {
  const omur = 5 + Math.random() * 7
  // Yol ekran boyuna bağlı, hıza değil: 14-40 px/s x 4-10 s en fazla 400px
  // ediyordu ve tohum nesli ölünce hiçbir kıvılcım ekranın üst %60'ına
  // çıkmıyordu (ölçüldü 390 ve 1440, t=8s'den sonra üst üç bantta 0 tane).
  const mesafe = boy * (0.5 + Math.random() * 0.55)
  return {
    // Kıvılcımlar ocağın ortasından çıkar, kenarlara doğru seyrelir.
    x: en * (0.5 + (Math.random() - 0.5) * (0.55 + Math.random() * 0.6)),
    y: ilk ? boy * Math.random() : boy + 10 + Math.random() * 40,
    hiz: mesafe / omur,
    savrulma: 6 + Math.random() * 16,
    faz: Math.random() * Math.PI * 2,
    kenar: Math.random() < 0.55 ? 1 : Math.random() < 0.85 ? 2 : 3,
    omur,
    yas: ilk ? Math.random() * omur : 0,
    // Her beşinci tane tangerine: közün içindeki sıcak nokta.
    sicak: Math.random() < 0.2,
  }
}

/**
 * Ocakbasi yükselen kor kıvılcımları.
 *
 * Sahnenin diğer üç katmanı (kor yatağı, duman, ısı bandı) ekranın dibine yaslı;
 * masaüstünde hero geniş olduğu için okunuyorlar ama dikey mobil ekranda hepsi
 * katlamanın altında kalıyordu. Kıvılcım dikey yükseldiği için ilk ekranın
 * içinden geçer, yani mobilde de görünür (sahibi, 13 Ağustos 2026).
 *
 * Kareler, daire değil: markanın tanesi tavla zarı. `lighter` ile üst üste
 * binen taneler kor gibi toplanır.
 *
 * Canvas kendi döngüsünü kurar, yani `animasyonlar.css`'in
 * `prefers-reduced-motion` kuralı ona ULAŞMAZ; tercih burada elle okunur ve
 * hareket azaltılmışsa döngü hiç başlamaz. Sekme arkaya alındığında da durur.
 */
export function KorKivilcimi() {
  const tuvalRef = useRef<HTMLCanvasElement>(null)
  const azalt = useHareketAzaltilmisMi()

  useEffect(() => {
    const tuval = tuvalRef.current
    const ctx = tuval?.getContext('2d')
    if (!tuval || !ctx) return
    if (azalt) {
      // Oturum içinde açıldıysa döngü zaten sökülmüştür; son kare silinir.
      ctx.clearRect(0, 0, tuval.width, tuval.height)
      return
    }

    const sicakRenk = tokenRengi('--bakir', SICAK_YEDEK)
    const korRenk = tokenRengi('--kor', KOR_YEDEK)

    let en = 0
    let boy = 0
    let sonOran = 0
    let taneler: Kivilcim[] = []

    const olcekle = () => {
      const oran = Math.min(2, window.devicePixelRatio || 1)
      const yeniEn = tuval.clientWidth
      const yeniBoy = tuval.clientHeight
      // Mobil tarayıcıda adres çubuğu kayarken resize saniyede onlarca kez atar ve
      // ölçü çoğu kez hiç değişmez. Ölçüldü: her çağrı 120 taneyi baştan üretir ve
      // bitmap'i sıfırlar (1440x900 @DPR2'de 19,8 MiB).
      if (yeniEn === en && yeniBoy === boy && oran === sonOran) return
      en = yeniEn
      boy = yeniBoy
      sonOran = oran
      tuval.width = Math.round(en * oran)
      tuval.height = Math.round(boy * oran)
      ctx.setTransform(oran, 0, 0, oran, 0, 0)
      taneler = Array.from({ length: adet(en, boy) }, () => yeniKivilcim(en, boy, true))
    }
    olcekle()

    let kare = 0
    let onceki = performance.now()

    const ciz = (simdi: number) => {
      const dt = Math.min(0.05, (simdi - onceki) / 1000)
      onceki = simdi
      ctx.clearRect(0, 0, en, boy)
      ctx.globalCompositeOperation = 'lighter'

      for (let i = 0; i < taneler.length; i++) {
        const t = taneler[i]
        if (!t) continue
        t.yas += dt
        if (t.yas >= t.omur || t.y < -20) {
          taneler[i] = yeniKivilcim(en, boy, false)
          continue
        }
        t.y -= t.hiz * dt
        const ilerleme = t.yas / t.omur
        // Yükseldikçe soğur: opaklık önce açılır, sonra söner.
        const parlaklik = Math.sin(Math.PI * ilerleme) ** 1.4
        const x = t.x + Math.sin(t.faz + t.yas * 1.6) * t.savrulma
        // Sabit renk + globalAlpha: kare başına 240 rgba dizesi kurmak döngünün
        // maliyetinin dörtte üçüydü (ölçüldü 0.21 > 0.06 ms/kare); görüntü aynı.
        ctx.fillStyle = t.sicak ? sicakRenk : korRenk
        // Hale: çekirdeğin üç katı, çok soluk. `lighter` ile üst üste binince
        // tek tek taneler yerine közün toplam parıltısı okunuyor.
        ctx.globalAlpha = 0.16 * parlaklik
        ctx.fillRect(x - t.kenar, t.y - t.kenar, t.kenar * 3, t.kenar * 3)
        ctx.globalAlpha = 0.95 * parlaklik
        ctx.fillRect(x, t.y, t.kenar, t.kenar)
      }
      ctx.globalAlpha = 1

      kare = requestAnimationFrame(ciz)
    }
    kare = requestAnimationFrame(ciz)

    const gorunurluk = () => {
      cancelAnimationFrame(kare)
      if (!document.hidden) {
        onceki = performance.now()
        kare = requestAnimationFrame(ciz)
      }
    }
    document.addEventListener('visibilitychange', gorunurluk)
    const olcekleKisitli = rafKisitla(olcekle)
    window.addEventListener('resize', olcekleKisitli, { passive: true })

    return () => {
      cancelAnimationFrame(kare)
      document.removeEventListener('visibilitychange', gorunurluk)
      window.removeEventListener('resize', olcekleKisitli)
    }
  }, [azalt])

  return <canvas ref={tuvalRef} className={stil.tuval} aria-hidden="true" />
}
