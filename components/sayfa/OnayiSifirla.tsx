'use client'

import { onaySifirla } from '@/lib/onay'
import stil from './GizlilikSayfasi.module.css'

type Props = { etiket: string }

/** Gizlilik sayfasında onayı geri alma düğmesi; yenileme yüklenmiş GA etiketini de bırakır. */
export function OnayiSifirla({ etiket }: Props) {
  return (
    <button
      type="button"
      className={stil.sifirla}
      onClick={() => {
        onaySifirla()
        window.location.reload()
      }}
    >
      {etiket}
    </button>
  )
}
