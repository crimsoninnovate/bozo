import { SESLER, type Katman, type SesAdi } from '@/lib/oyun/ses'

/*
 * Web Audio sentezi (spec §13): dosya yok, sesler anında üretilir. Bağlam ilk
 * dokunuşta kurulur; tarayıcı kullanıcı hareketi olmadan ses başlatmaz.
 */

export type SesCalar = { cal: (ad: SesAdi) => void; uyandir: () => void; kapat: () => void }

/** Bir saniyelik beyaz gürültü, bir kez üretilir: cızırtının ve çevirmenin kaynağı. */
function gurultuTamponu(ctx: AudioContext): AudioBuffer {
  const tampon = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
  const veri = tampon.getChannelData(0)
  for (let i = 0; i < veri.length; i++) veri[i] = Math.random() * 2 - 1
  return tampon
}

/** Anlık patlama, kısa yükseliş, üstel sönüş: tıkırtısız bir zarf. */
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
  // Üst üste binen sesler kırpılmasın: ortak sıkıştırıcı.
  const sikistirici = ctx.createDynamicsCompressor()
  sikistirici.connect(ctx.destination)
  // iOS Safari bağlamı yalnız bir dokunuşun içinde açar; `uyandir` oradan çağrılır.
  const uyandir = (): void => {
    if (ctx.state === 'suspended') void ctx.resume()
  }
  const cal = (ad: SesAdi): void => {
    uyandir()
    for (const katman of SESLER[ad]) katmanKur(ctx, tampon, katman, sikistirici)
  }
  return { cal, uyandir, kapat: () => void ctx.close() }
}
