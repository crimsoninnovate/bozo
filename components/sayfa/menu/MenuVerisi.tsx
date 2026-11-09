'use client'

import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { API_KOKU } from '@/lib/oyun/api'
import { canliMenuGetir, menuKarar } from '@/lib/menu/canli'
import type { MenuBelgesi } from '@/lib/menu/tipler'
import stil from './MenuVerisi.module.css'

const BEKLEME_SINIRI_MS = 1500
const ZAMAN_ASIMI_MS = 4000

const MenuBaglami = createContext<MenuBelgesi | null>(null)
// Fotoğraflar canlı belgeyle değişmez: değişiklik "Siteyi Güncelle" ile gelir, boş yuva sonradan dolup kaymasın.
const FotoBaglami = createContext<Pick<MenuBelgesi, 'fotograflar'> | null>(null)

/** Fiyatlar canlı belge gelene ya da 1500 ms dolana kadar gizlenir; SSR HTML'inde hep görünür. */
export function MenuVerisiSaglayici({ baz, children }: { baz: MenuBelgesi; children: ReactNode }) {
  const [menu, setMenu] = useState(baz)
  const [bekliyor, setBekliyor] = useState(false)
  const fotoBelgesi = useMemo(() => ({ fotograflar: baz.fotograflar }), [baz])

  useLayoutEffect(() => setBekliyor(true), [])

  useEffect(() => {
    const sinir = setTimeout(() => setBekliyor(false), BEKLEME_SINIRI_MS)
    let iptal = false
    void canliMenuGetir(API_KOKU, fetch, ZAMAN_ASIMI_MS, baz).then((yanit) => {
      if (iptal) return
      setMenu(menuKarar(baz, yanit))
      setBekliyor(false)
    })
    return () => {
      iptal = true
      clearTimeout(sinir)
    }
  }, [baz])

  return (
    <MenuBaglami.Provider value={menu}>
      <FotoBaglami.Provider value={fotoBelgesi}>
        <div className={stil.sarmal} data-bekliyor={bekliyor}>
          {children}
        </div>
      </FotoBaglami.Provider>
    </MenuBaglami.Provider>
  )
}

export function useMenu(): MenuBelgesi {
  const menu = useContext(MenuBaglami)
  if (!menu) throw new Error('useMenu MenuVerisiSaglayici disinda cagrildi')
  return menu
}

/** Derleme zamanı belgesinin fotoğraf atamaları; canlı belge gelse de aynı kalır. */
export function useMenuFotograflari(): Pick<MenuBelgesi, 'fotograflar'> {
  const belge = useContext(FotoBaglami)
  if (!belge) throw new Error('useMenuFotograflari MenuVerisiSaglayici disinda cagrildi')
  return belge
}
