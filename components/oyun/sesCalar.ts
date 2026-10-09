import { ANA_KAZANC, SESLER, SINIRLAYICI, type Katman, type SesAdi } from '@/lib/oyun/ses'

/*
 * Web Audio sentezi (spec §13): dosya yok, sesler anında üretilir. Bağlam ilk
 * dokunuşta kurulur; tarayıcı kullanıcı hareketi olmadan ses başlatmaz.
 */

export type SesCalar = {
  cal: (ad: SesAdi, perde?: number) => void
  /** Sürekli kor cızırtısının hedef kazancı; 0 susturur. */
  ortam: (seviye: number) => void
  uyandir: () => void
  kapat: () => void
}

/** Bir saniyelik beyaz gürültü, bir kez üretilir: cızırtının ve çevirmenin kaynağı. */
function gurultuTamponu(ctx: AudioContext): AudioBuffer {
  const tampon = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
  const veri = tampon.getChannelData(0)
  for (let i = 0; i < veri.length; i++) veri[i] = Math.random() * 2 - 1
  return tampon
}

/** Anlık patlama, kısa yükseliş, üstel sönüş: tıkırtısız bir zarf. */
/**
 * İki saniyelik döngü: kısık tıslama ve rastgele çıtırtılar (yağın közde patlaması). Döngü sınırı duyulmasın
 * diye çıtırtılar başa ve sona yakın düşmez.
 */
function korTamponu(ctx: AudioContext): AudioBuffer {
  const tampon = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
  const veri = tampon.getChannelData(0)
  for (let i = 0; i < veri.length; i++) veri[i] = (Math.random() * 2 - 1) * 0.35
  const uzunluk = Math.round(ctx.sampleRate * 0.004)
  for (let n = 0; n < 50; n++) {
    const bas = Math.floor(uzunluk + Math.random() * (veri.length - 3 * uzunluk))
    const guc = 0.4 + Math.random() * 0.6
    for (let i = 0; i < uzunluk; i++) veri[bas + i] = (veri[bas + i] ?? 0) + (Math.random() * 2 - 1) * guc * (1 - i / uzunluk)
  }
  return tampon
}

/** Kor döngüsü bir kez kurulur, kazancı 0'dan başlar; `ortam` yalnız kazancı yumuşakça kaydırır. */
function ortamKur(ctx: AudioContext, hedef: AudioNode): (seviye: number) => void {
  let kazanc: GainNode | null = null
  return (seviye) => {
    if (!kazanc) {
      if (seviye === 0) return
      const kaynak = ctx.createBufferSource()
      kaynak.buffer = korTamponu(ctx)
      kaynak.loop = true
      const suzgec = ctx.createBiquadFilter()
      suzgec.type = 'highpass'
      suzgec.frequency.value = 2200
      kazanc = ctx.createGain()
      kazanc.gain.value = 0
      kaynak.connect(suzgec).connect(kazanc).connect(hedef)
      kaynak.start()
    }
    kazanc.gain.setTargetAtTime(seviye, ctx.currentTime, 0.25)
  }
}

function zarf(ctx: AudioContext, k: Katman, t: number, hedef: AudioNode): GainNode {
  const kazanc = ctx.createGain()
  kazanc.gain.setValueAtTime(0.0001, t)
  kazanc.gain.linearRampToValueAtTime(k.kazanc, t + 0.004)
  kazanc.gain.exponentialRampToValueAtTime(0.001, t + k.ms / 1000)
  kazanc.connect(hedef)
  return kazanc
}

function frekansKaydir(param: AudioParam, k: Katman, t: number): void {
  param.setValueAtTime(k.hz, t)
  if (k.hzSon) param.exponentialRampToValueAtTime(k.hzSon, t + k.ms / 1000)
}

function katmanKur(ctx: AudioContext, tampon: AudioBuffer, k: Katman, hedef: AudioNode): void {
  const t = ctx.currentTime + (k.gecikme ?? 0) / 1000
  const cikis = zarf(ctx, k, t, hedef)
  let kaynak: AudioScheduledSourceNode
  if (k.tur === 'ton') {
    const osilator = ctx.createOscillator()
    osilator.type = k.dalga ?? 'sine'
    frekansKaydir(osilator.frequency, k, t)
    osilator.connect(cikis)
    kaynak = osilator
  } else {
    const gurultu = ctx.createBufferSource()
    gurultu.buffer = tampon
    const suzgec = ctx.createBiquadFilter()
    suzgec.type = k.suzgec ?? 'bandpass'
    suzgec.Q.value = 0.8
    frekansKaydir(suzgec.frequency, k, t)
    gurultu.connect(suzgec)
    suzgec.connect(cikis)
    kaynak = gurultu
  }
  kaynak.start(t)
  kaynak.stop(t + k.ms / 1000 + 0.02)
}

export function sesCalarKur(): SesCalar | null {
  if (typeof AudioContext === 'undefined') return null
  const ctx = new AudioContext()
  const tampon = gurultuTamponu(ctx)
  // Üst üste binen sesler kırpılmasın: ana kazanç, sonra sınırlayıcı (`SINIRLAYICI`).
  const sikistirici = ctx.createDynamicsCompressor()
  for (const [ad, deger] of Object.entries(SINIRLAYICI)) sikistirici[ad as keyof typeof SINIRLAYICI].value = deger
  sikistirici.connect(ctx.destination)
  const ana = ctx.createGain()
  ana.gain.value = ANA_KAZANC
  ana.connect(sikistirici)
  // iOS Safari bağlamı yalnız bir dokunuşun içinde açar; `uyandir` oradan çağrılır.
  const uyandir = (): void => {
    if (ctx.state === 'suspended') void ctx.resume()
  }
  const cal = (ad: SesAdi, perde = 1): void => {
    uyandir()
    for (const k of SESLER[ad]) {
      const katman = k.tur === 'ton' && perde !== 1 ? { ...k, hz: k.hz * perde, hzSon: k.hzSon && k.hzSon * perde } : k
      katmanKur(ctx, tampon, katman, ana)
    }
  }
  return { cal, ortam: ortamKur(ctx, ana), uyandir, kapat: () => void ctx.close() }
}
