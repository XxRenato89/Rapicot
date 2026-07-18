'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function CalificacionesPage() {
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRatings = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('calificaciones_servicio')
      .select('*')
      .order('created_at', { ascending: false })
    setRatings(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchRatings() }, [fetchRatings])

  const total = ratings.length
  const promedio = total > 0
    ? (ratings.reduce((s, r) => s + r.estrellas, 0) / total).toFixed(1)
    : '—'

  const distribucion = [0, 0, 0, 0, 0]
  ratings.forEach(r => { distribucion[r.estrellas - 1]++ })

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        <div className="mb-6 h-8 w-48 rounded bg-paper-deep animate-pulse" />
        <div className="h-48 rounded-xl bg-paper-deep animate-pulse" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Calificaciones del servicio</h1>
        <p className="text-sm text-ink-soft mt-1">
          {total} calificacione{total !== 1 ? 's' : ''} recibida{total !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-paper-deep bg-white p-5">
          <p className="text-xs text-ink-soft font-medium uppercase tracking-wide mb-1">Promedio general</p>
          <p className="text-3xl font-bold text-ink">
            {promedio}
            <span className="text-lg text-ink-soft font-normal"> / 5</span>
          </p>
        </div>
        <div className="rounded-xl border border-paper-deep bg-white p-5">
          <p className="text-xs text-ink-soft font-medium uppercase tracking-wide mb-3">Distribución</p>
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map(star => {
              const count = distribucion[star - 1]
              const pct = total > 0 ? (count / total) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-5 text-right text-ink-soft">{star}</span>
                  <svg className="h-3.5 w-3.5 shrink-0 text-accent" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <div className="flex-1 h-2 rounded-full bg-paper-deep overflow-hidden">
                    <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-right text-ink-soft text-xs">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {total === 0 ? (
        <div className="rounded-xl border border-dashed border-paper-deep p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-light">
            <svg className="h-7 w-7 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <p className="text-sm text-ink-soft/60 mb-1">Aún no hay calificaciones.</p>
          <p className="text-xs text-ink-soft/40">Las respuestas de los usuarios aparecerán aquí automáticamente.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {ratings.map(r => (
            <div key={r.id} className="rounded-xl border border-paper-deep bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} className={`h-4 w-4 ${star <= r.estrellas ? 'text-accent' : 'text-paper-deep'}`} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-ink-soft">
                  {new Date(r.created_at).toLocaleDateString('es-CL', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
              {r.comentario && (
                <p className="text-sm text-ink-soft whitespace-pre-wrap">{r.comentario}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
