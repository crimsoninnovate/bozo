'use client'

import { useEffect, useState } from 'react'
import { sozluk, type Dil } from '@/content'
import { yol } from '@/lib/site'
import { onayOku, onayYaz, type OnayDurumu } from '@/lib/onay'
import { Olcumleme } from './Olcumleme'
import stil from './CerezOnayi.module.css'

type Props = { dil: Dil }

/**
 * Çerez onay bandı ve ölçümün kapısı. İkisi TEK bileşende, çünkü ölçüm onayın
 * sonucudur: `Olcumleme` yalnız durum "kabul" iken basılır, yani GA4 etiketi
 * onaysız DOM'a hiç girmez.
 *
 * KKTC 89/2007 Madde 11(2)(A) gereği opt-in: karar verilmemişken de ölçüm yok.
 * Tüzük Madde 5(7) bilgilendirme ile onayı ayırıyor, o yüzden bant kısa kalır ve
 * ayrıntı için gizlilik sayfasına bağlanır.
 */
export function CerezOnayi({ dil }: Props) {
  const s = sozluk(dil)
  // Sunucuda ve ilk boyamada "karar-yok": bant yalnız istemcide, localStorage
  // okunduktan sonra belirir. Aksi halde kabul etmiş kullanıcı da onu görürdü.
  const [durum, setDurum] = useState<OnayDurumu>('karar-yok')
  const [okundu, setOkundu] = useState(false)

  useEffect(() => {
    setDurum(onayOku())
    setOkundu(true)
  }, [])

  const karar = (yeni: 'kabul' | 'ret') => {
    onayYaz(yeni)
    setDurum(yeni)
  }

  return (
    <>
      {durum === 'kabul' && <Olcumleme />}

      {okundu && durum === 'karar-yok' && (
        <div className={stil.bant} role="dialog" aria-label={s.ortak.cerez.etiket}>
          <p className={stil.metin}>
            {s.ortak.cerez.metin}{' '}
            <a className={stil.detay} href={yol('gizlilik', dil)}>
              {s.ortak.cerez.detay}
            </a>
          </p>
          <div className={stil.dugmeler}>
            <button type="button" className={stil.ret} onClick={() => karar('ret')}>
              {s.ortak.cerez.ret}
            </button>
            <button type="button" className={stil.kabul} onClick={() => karar('kabul')}>
              {s.ortak.cerez.kabul}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
