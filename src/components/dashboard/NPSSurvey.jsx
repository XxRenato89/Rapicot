'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const STORAGE_KEY = 'rapicot-nps-v1'

export default function NPSSurvey() {
  const [visible, setVisible] = useState(false)
  const [puntaje, setPuntaje] = useState(null)
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'done' || stored === 'skipped') return

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
        .not('deleted_at', 'is', null)

      const cuentaCotizaciones = count ?? 0
      if (cuentaCotizaciones >= 5) { setVisible(true); return }

      const cuentaDias = Math.floor(
        (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)
      )
      if (cuentaDias >= 14) { setVisible(true); return }
    })()
  }, [])

  async function handleEnviar() {
    if (puntaje === null) return
    setEnviando(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('empresa_id')
      .eq('id', user.id)
      .single()

    if (profile?.empresa_id) {
      await supabase.from('encuestas_nps').insert({
        empresa_id: profile.empresa_id,
        puntaje,
        comentario: comentario.trim() || null,
      })
    }

    localStorage.setItem(STORAGE_KEY, 'done')
    setEnviado(true)
    setEnviando(false)
  }

  function handleSkip() {
    localStorage.setItem(STORAGE_KEY, 'skipped')
    setVisible(false)
  }

  if (!visible || enviado) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-fade-in">
        <h2 className="text-lg font-semibold text-ink">
          ¿Qué tan probable es que recomiendes Rapicot a otro dueño de pyme?
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          0 = Nada probable &middot; 10 = Muy probable
        </p>

        <div className="mt-5 flex justify-between gap-1">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              onClick={() => setPuntaje(i)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                puntaje === i
                  ? 'bg-brand text-white'
                  : 'bg-paper-deep text-ink-soft hover:bg-paper-deep/70'
              }`}
            >
              {i}
            </button>
          ))}
        </div>

        <div className="mt-5">
          <label className="mb-1 block text-sm text-ink-soft">
            ¿Algo más que quieras compartir? <span className="text-ink-soft/50">(opcional)</span>
          </label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={3}
            placeholder="Tu opinión nos ayuda a mejorar..."
            className="w-full resize-y rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={handleSkip}
            className="rounded-xl border border-paper-deep px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-deep transition-colors"
          >
            Ahora no
          </button>
          <button
            onClick={handleEnviar}
            disabled={puntaje === null || enviando}
            className="rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-50 transition-colors"
          >
            {enviando ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  )
}
