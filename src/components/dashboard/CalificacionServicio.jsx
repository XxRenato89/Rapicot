'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const STORAGE_KEY = 'rapicot-calificacion-v1'

export default function CalificacionServicio() {
  const [visible, setVisible] = useState(false)
  const [estrellas, setEstrellas] = useState(null)
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [step, setStep] = useState('survey')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.status === 'done') return
        if (parsed.status === 'skipped' && parsed.timestamp) {
          const daysPassed = Math.floor((Date.now() - parsed.timestamp) / (1000 * 60 * 60 * 24))
          if (daysPassed < 30) return
        }
      } catch {
        // ignore
      }
    }

    const supabase = createClient()
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('empresa_id')
        .eq('id', user.id)
        .single()
      if (!profile?.empresa_id) return

      const { count } = await supabase
        .from('cotizaciones')
        .select('id', { count: 'exact', head: true })
        .eq('empresa_id', profile.empresa_id)

      const total = count ?? 0
      if (total >= 5) { setVisible(true); return }

      const dias = Math.floor(
        (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)
      )
      if (dias >= 14) { setVisible(true) }
    })()
  }, [])

  async function handleEnviar() {
    if (estrellas === null) return
    setEnviando(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setEnviando(false); return }

    const { data: profile } = await supabase
      .from('profiles')
      .select('empresa_id')
      .eq('id', user.id)
      .single()

    if (profile?.empresa_id) {
      const { error } = await supabase.from('calificaciones_servicio').insert({
        empresa_id: profile.empresa_id,
        estrellas,
        comentario: comentario.trim() || null,
      })
      if (error) {
        console.warn('No se pudo guardar la calificación:', error.message)
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: 'done' }))
    setEnviando(false)
    setStep(estrellas >= 4 ? 'invite' : 'thankyou')
  }

  function handleSkip() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: 'skipped', timestamp: Date.now() }))
    setVisible(false)
  }

  function handleClose() {
    setVisible(false)
  }

  if (!visible) return null

  if (step === 'thankyou') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-fade-in text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-brand">
            <svg className="h-6 w-6" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 10l3 3 6-6" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-ink">Gracias por tu feedback</h2>
          <p className="mt-2 text-sm text-ink-soft">
            Tomamos muy en serio cada opinión para mejorar Rapicot. Agradecemos el tiempo que te tomaste en compartirla.
          </p>
          <button onClick={handleClose}
            className="mt-5 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-hover transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    )
  }

  if (step === 'invite') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-fade-in text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-brand">
            <svg className="h-6 w-6" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-6a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-ink">Nos alegra que te guste Rapicot</h2>
          <p className="mt-2 text-sm text-ink-soft">
            ¿Te animas a dejarnos una reseña pública? Tu opinión ayuda a otros dueños de pyme a encontrar herramientas que simplifican su día a día.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <button onClick={handleClose}
              className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-hover transition-colors">
              Lo haré más tarde
            </button>
            <button onClick={handleClose}
              className="rounded-xl border border-paper-deep px-5 py-2.5 text-sm text-ink-soft hover:bg-paper-deep transition-colors">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-fade-in">
        <h2 className="text-lg font-semibold text-ink">¿Qué te ha parecido Rapicot hasta ahora?</h2>
        <p className="mt-1 text-sm text-ink-soft">Tu opinión sincera nos ayuda a mejorar.</p>

        <div className="mt-5 flex justify-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setEstrellas(star)}
              className={`h-10 w-10 rounded-lg flex items-center justify-center transition-colors ${
                star <= estrellas
                  ? 'text-accent'
                  : 'text-paper-deep hover:text-accent/50'
              }`}
            >
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill={star <= estrellas ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>

        {estrellas !== null && (
          <p className="mt-2 text-center text-xs text-ink-soft">
            {estrellas === 1 ? '1 estrella' : `${estrellas} estrellas`}
          </p>
        )}

        <div className="mt-5">
          <label className="mb-1 block text-sm text-ink-soft">
            Cuéntanos qué mejorarías o qué te ha gustado <span className="text-ink-soft/50">(opcional)</span>
          </label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={3}
            placeholder="Tu opinión nos ayuda a crecer..."
            className="w-full resize-y rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button onClick={handleSkip}
            className="rounded-xl border border-paper-deep px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-deep transition-colors">
            Ahora no
          </button>
          <button onClick={handleEnviar} disabled={estrellas === null || enviando}
            className="rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-50 transition-colors">
            {enviando ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  )
}
