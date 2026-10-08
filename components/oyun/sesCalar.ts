import { SESLER, type SesAdi } from '@/lib/oyun/ses'

/*
 * Web Audio sentezi (spec §13): dosya yok, beş ses anında üretilir. Bağlam ilk
 * dokunuşta kurulur; tarayıcı kullanıcı hareketi olmadan ses başlatmaz.
 */

export type SesCalar = { cal: (ad: SesAdi) => void; uyandir: () => void; kapat: () => void }

/** Bir saniyelik beyaz gürültü, bir kez üretilir: cızırtının kaynağı. */
function gurultuTamponu(ctx: AudioContext): AudioBuffer {
  const tampon = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
  const veri = tampon.getChannelData(0)
  for (let i = 0; i < veri.length; i++) veri[i] = Math.random() * 2 - 1
  return tampon
}

function ton(ctx: AudioContext, hz: number, hedef: AudioNode): AudioScheduledSourceNode {
  const osilator = ctx.createOscillator()
  osilator.type = 'triangle'
  osilator.frequency.value = hz
  osilator.connect(hedef)
  return osilator
}

function cizirti(ctx: AudioContext, tampon: AudioBuffer, hz: number, hedef: AudioNode): AudioScheduledSourceNode {
  const kaynak = ctx.createBufferSource()
  kaynak.buffer = tampon
  const suzgec = ctx.createBiquadFilter()
  suzgec.type = 'bandpass'
  suzgec.frequency.value = hz
  suzgec.Q.value = 0.8
  kaynak.connect(suzgec)
  suzgec.connect(hedef)
  return kaynak
}

export function sesCalarKur(): SesCalar | null {
  if (typeof AudioContext === 'undefined') return null
  const ctx = new AudioContext()
  const tampon = gurultuTamponu(ctx)
  // iOS Safari bağlamı yalnız bir dokunuşun içinde açar; `uyandir` oradan çağrılır.
  const uyandir = (): void => {
    if (ctx.state === 'suspended') void ctx.resume()
  }
  const cal = (ad: SesAdi): void => {
    uyandir()
    const ses = SESLER[ad]
    let t = ctx.currentTime
    for (const nota of ses.notalar) {
      const sure = nota.ms / 1000
      const kazanc = ctx.createGain()
      kazanc.gain.setValueAtTime(ses.kazanc, t)
      kazanc.gain.exponentialRampToValueAtTime(0.001, t + sure)
      kazanc.connect(ctx.destination)
      const kaynak = ses.tur === 'ton' ? ton(ctx, nota.hz, kazanc) : cizirti(ctx, tampon, nota.hz, kazanc)
      kaynak.start(t)
      kaynak.stop(t + sure)
      t += sure
    }
  }
  return { cal, uyandir, kapat: () => void ctx.close() }
}
