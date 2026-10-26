'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { sozluk, type Dil } from '@/content'
import { canliDuyuruGetir } from '@/lib/menu/canli'
import { canliOturumu, duyuruKarari, metinOzeti } from '@/lib/menu/duyuru'
import type { Duyuru } from '@/lib/menu/tipler'
import { API_KOKU } from '@/lib/oyun/api'
import stil from './DuyuruBandi.module.css'

const ZAMAN_ASIMI_MS = 4000
const KAPATMA_ANAHTARI = 'bozo.duyuruKapali'

/** Tam sayfa yüklemesinde boş başlar; istemci gezintisinde ilk canlı sonucu taşır. */
const oturum = canliOturumu()

type Props = {
  dil: Dil
  /** Derleme anında seçilmiş duyuru: SSR HTML'i ile ilk istemci boyaması aynıdır. Belgeden yalnız bu girer. */
  baz: Duyuru
}

/** Kapatılmış duyurunun özeti; özel gezinmede depolama hata verirse "kapatılmamış" sayılır. */
function kapatilmisOzet(): string | null {
  try {
    return sessionStorage.getItem(KAPATMA_ANAHTARI)
  } catch (hata) {
    console.warn('duyuru kapatma durumu okunamadi', hata)
    return null
  }
}

function kapatmayiYaz(ozet: string): void {
  try {
    sessionStorage.setItem(KAPATMA_ANAHTARI, ozet)
  } catch (hata) {
    console.warn('duyuru kapatma durumu yazilamadi', hata)
  }
}

/**
 * Üst barın altındaki canlı duyuru bandı. Sayfa derlenmiş duyuruyla basılır; tarayıcıda belge bir kez
 * çekilir (menü sağlayıcısıyla aynı istek, bkz. `canliDuyuruGetir`) ve bant açılır, kapanır ya da metni değişir.
 * Kapatma oturum boyudur ve metnin özetine bağlıdır: yeni metin bandı yeniden açar.
 */
export function DuyuruBandi({ dil, baz }: Props) {
  const s = sozluk(dil)
  // Önbellek boşken (SSR, hidrasyon) tam olarak `baz`: sunucu HTML'iyle aynı.
  const [duyuru, setDuyuru] = useState(() =>
    oturum.duyuru() === null ? baz : duyuruKarari(baz, oturum.duyuru(), new Date()),
  )
  const [kapatilan, setKapatilan] = useState<string | null>(() =>
    oturum.duyuru() === null ? null : kapatilmisOzet(),
  )

  useLayoutEffect(() => setKapatilan(kapatilmisOzet()), [])

  useEffect(() => {
    if (!oturum.getirmeli()) return
    let iptal = false
    void canliDuyuruGetir(API_KOKU, fetch, ZAMAN_ASIMI_MS).then((canli) => {
      oturum.kaydet(canli)
      if (!iptal) setDuyuru(duyuruKarari(baz, canli, new Date()))
    })
    return () => {
      iptal = true
    }
  }, [baz])

  const metin = duyuru.metin[dil]
  const acik = duyuru.aktif && kapatilan !== metinOzeti(duyuru)

  return (
    <div className={stil.sarmal} data-acik={acik} inert={!acik}>
      <div className={stil.ic}>
        {metin !== '' && (
          <div className={stil.bant} role="status">
            <p className={stil.metin} lang={dil}>
              {metin}
            </p>
            <button
              type="button"
              className={stil.kapat}
              aria-label={s.ortak.erisim.duyuruKapat}
              onClick={() => {
                kapatmayiYaz(metinOzeti(duyuru))
                setKapatilan(metinOzeti(duyuru))
              }}
            >
              {s.ortak.duyuru.kapat}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
