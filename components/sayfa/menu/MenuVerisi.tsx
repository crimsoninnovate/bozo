'use client'

import { createContext, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { API_KOKU } from '@/lib/oyun/api'
import { canliMenuGetir, menuKarar } from '@/lib/menu/canli'
import type { MenuBelgesi } from '@/lib/menu/tipler'
import stil from './MenuVerisi.module.css'

const BEKLEME_SINIRI_MS = 1500
const ZAMAN_ASIMI_MS = 4000

const MenuBaglami = createContext<MenuBelgesi | null>(null)

/** Fiyatlar canlı belge gelene ya da 1500 ms dolana kadar gizlenir; SSR HTML'inde hep görünür. */
export function MenuVerisiSaglayici({ baz, children }: { baz: MenuBelgesi; children: ReactNode }) {
  const [menu, setMenu] = useState(baz)
  const [bekliyor, setBekliyor] = useState(false)

  useLayoutEffect(() => setBekliyor(true), [])

  useEffect(() => {
    const sinir = setTimeout(() => setBekliyor(false), BEKLEME_SINIRI_MS)
    let iptal = false
    void canliMenuGetir(API_KOKU, fetch, ZAMAN_ASIMI_MS).then((yanit) => {
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
      <div className={stil.sarmal} data-bekliyor={bekliyor}>
        {children}
      </div>
    </MenuBaglami.Provider>
  )
}

export function useMenu(): MenuBelgesi {
  const menu = useContext(MenuBaglami)
  if (!menu) throw new Error('useMenu MenuVerisiSaglayici disinda cagrildi')
  return menu
}
