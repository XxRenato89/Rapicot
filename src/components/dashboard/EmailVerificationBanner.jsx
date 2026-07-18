'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { reenviarVerificacion } from '@/lib/actions/auth'

export default function EmailVerificationBanner() {
  const [visible, setVisible] = useState(false)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && !user.email_confirmed_at) {
        setVisible(true)
      }
    })
  }, [])

  async function handleResend() {
    setSending(true)
    setMessage('')
    const res = await reenviarVerificacion()
    if (res?.success) {
      setMessage('Correo reenviado. Revisa tu bandeja de entrada.')
    } else {
      setMessage(res?.error || 'Error al reenviar')
    }
    setSending(false)
  }

  if (!visible) return null

  return (
    <div className="border-b border-brand-light bg-brand-light/50 px-4 py-2.5 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-brand">
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>Confirma tu email para activar tu cuenta.</span>
        </div>
        <button
          onClick={handleResend}
          disabled={sending}
          className="shrink-0 rounded-full bg-brand px-4 py-1.5 text-xs font-medium text-white hover:bg-brand-hover disabled:opacity-50 transition-colors"
        >
          {sending ? 'Enviando...' : 'Reenviar correo'}
        </button>
      </div>
      {message && (
        <div className="mx-auto mt-1 max-w-5xl text-xs text-brand">{message}</div>
      )}
    </div>
  )
}
