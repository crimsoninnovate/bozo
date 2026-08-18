import { BolumBasligi } from '@/components/ui/BolumBasligi'
import { sozluk, type Dil, type Sozluk } from '@/content'
import { isletme } from '@/content/isletme'
import { lakaplar } from '@/content/lakaplar'
import type { Lakap as LakapKaydi } from '@/content/types'
import stil from './Lakap.module.css'

type Props = { dil: Dil }

/** Sıfatın açıklaması yalnız `tur: 'lakap'` kayıtlarında var. */
function notMetni(s: Sozluk, id: string): string | undefined {
  const kayit: Record<string, string | undefined> = s.hikaye.lakap.notlar
  return kayit[id]
}

function Ciftler({ dil, kayitlar }: { dil: Dil; kayitlar: LakapKaydi[] }) {
  const s = sozluk(dil)
  return (
    <dl className={stil.ciftler}>
      {kayitlar.map((kayit) => {
        const not = notMetni(s, kayit.id)
        return (
          <div key={kayit.id} className={stil.cift}>
            <dt className={stil.ad}>{kayit.ad}</dt>
            <dd className={stil.lakapAdi}>
              {kayit.lakap}
              {not && <span className={stil.not}>{not}</span>}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

/**
 * Lakap bölümü: kuralın kendisi, iki mekanizma ve sahibinin kendi cümlesi. Tasarımda
 * yok, kaynağı sahibinin 19 Ağustos 2026 tarihli anlatımı (docs/surec/IYILESTIRMELER.md).
 *
 * Kapanış gerçek bir alıntı, o yüzden `NotBlogu` değil `<blockquote>`: imzayı `<footer>`
 * taşır ve ad `isletme.sahip`ten gelir, metne ikinci kez yazılmaz.
 */
export function Lakap({ dil }: Props) {
  const l = sozluk(dil).hikaye.lakap
  const gruplar = [
    { etiket: l.kisaltmaEtiketi, not: l.kisaltmaNotu, tur: 'kisaltma' as const },
    { etiket: l.lakapEtiketi, not: l.lakapNotu, tur: 'lakap' as const },
  ]

  return (
    <section className={stil.bolum}>
      <BolumBasligi olcek="orta" baslik={l.baslik} />
      <p className={stil.giris}>{l.giris}</p>

      <div className={stil.kutular}>
        {gruplar.map((grup) => (
          <div key={grup.tur} className={stil.kutu}>
            <h3 className={stil.etiket}>{grup.etiket}</h3>
            <p className={stil.etiketNotu}>{grup.not}</p>
            <Ciftler dil={dil} kayitlar={lakaplar.filter((k) => k.tur === grup.tur)} />
          </div>
        ))}
      </div>

      <p className={stil.tanim}>{l.tanim}</p>

      <blockquote className={stil.kapanis}>
        <p className={stil.kapanisMetni}>{l.kapanis}</p>
        <footer className={stil.imza}>{isletme.sahip}</footer>
      </blockquote>
    </section>
  )
}
