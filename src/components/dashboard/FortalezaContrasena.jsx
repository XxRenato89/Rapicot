'use client'

import { useMemo } from 'react'
import { calcularFortaleza } from '@/lib/security'

const REQUISITOS = [
  { key: 'len', label: 'Al menos 8 caracteres', test: (p) => p.length >= 8 },
  { key: 'lower', label: 'Una minúscula', test: (p) => /[a-z]/.test(p) },
  { key: 'upper', label: 'Una mayúscula', test: (p) => /[A-Z]/.test(p) },
  { key: 'num', label: 'Un número', test: (p) => /\d/.test(p) },
  { key: 'special', label: 'Un carácter especial (@, #, $, etc.)', test: (p) => /[^a-zA-Z0-9]/.test(p) },
]

export default function FortalezaContrasena({ password }) {
  const fortaleza = useMemo(() => calcularFortaleza(password || ''), [password])

  if (!password) return null

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i <= fortaleza.score ? fortaleza.color : 'bg-paper-deep'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${fortaleza.color.replace('bg-', 'text-')}`}>
        {fortaleza.label}
      </p>
      <ul className="space-y-0.5">
        {REQUISITOS.map((r) => {
          const ok = r.test(password || '')
          return (
            <li key={r.key} className={`flex items-center gap-1.5 text-[11px] ${ok ? 'text-brand' : 'text-ink-soft/50'}`}>
              {ok ? (
                <svg className="h-3 w-3 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 10l3 3 6-6" />
                </svg>
              ) : (
                <svg className="h-3 w-3 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M6 6l8 8M14 6l-8 8" />
                </svg>
              )}
              {r.label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
