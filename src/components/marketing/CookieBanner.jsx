'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'rapicot-cookies-v1'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== 'accepted') setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-paper-deep bg-paper p-4 shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <p className="text-sm text-ink-soft">
          Este sitio usa cookies propias para su funcionamiento. Si sigues navegando,
          aceptas su uso.{' '}
          <Link href="/cookies" className="font-medium text-brand underline hover:no-underline">
            Más información
          </Link>
        </p>
        <button
          onClick={accept}
          className="shrink-0 rounded-full bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-brand-hover"
        >
          Aceptar
        </button>
      </div>
    </div>
  )
}
