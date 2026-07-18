'use client'

import { useState } from 'react'
import { responderCotizacion } from '@/lib/actions/cotizaciones'

export default function ResponderCotizacion({ token }) {
  const [estado, setEstado] = useState('idle')

  async function handleClick(respuesta) {
    setEstado('loading')
    const formData = new FormData()
    formData.set('token', token)
    formData.set('respuesta', respuesta)
    const res = await responderCotizacion(formData)
    if (res?.success) {
      setEstado(res.respuesta)
    } else {
      setEstado('error')
      setTimeout(() => setEstado('idle'), 3000)
    }
  }

  if (estado === 'error') {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-700">
          Hubo un problema al registrar tu respuesta. Intenta de nuevo.
        </p>
      </div>
    )
  }

  if (estado === 'aceptada') {
    return (
      <div className="rounded-2xl border border-brand-light bg-brand-light/30 p-6 text-center animate-fade-in">
        <div className="mb-2 flex justify-center">
          <svg className="h-10 w-10 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-ink">¡Cotización aceptada!</p>
        <p className="mt-1 text-sm text-ink-soft">
          Gracias por confirmar. El equipo de la empresa recibió tu respuesta.
        </p>
      </div>
    )
  }

  if (estado === 'rechazada') {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center animate-fade-in">
        <div className="mb-2 flex justify-center">
          <svg className="h-10 w-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-ink">Cotización rechazada</p>
        <p className="mt-1 text-sm text-ink-soft">
          La empresa será notificada de tu decisión.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-paper-deep bg-white p-6">
      <p className="mb-4 text-center text-sm text-ink-soft">
        ¿Qué te parece esta cotización?
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => handleClick('aceptada')}
          disabled={estado === 'loading'}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-hover disabled:opacity-50 transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 10l3 3 6-6" />
          </svg>
          {estado === 'loading' ? 'Enviando...' : 'Aceptar cotización'}
        </button>
        <button
          onClick={() => handleClick('rechazada')}
          disabled={estado === 'loading'}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-paper-deep px-6 py-3 text-sm font-medium text-ink-soft hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6l8 8M14 6l-8 8" />
          </svg>
          Rechazar
        </button>
      </div>
    </div>
  )
}
