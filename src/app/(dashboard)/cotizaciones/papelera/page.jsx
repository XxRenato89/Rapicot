'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { restaurarCotizacion } from '@/lib/actions/cotizaciones'
import { useToast } from '@/components/dashboard/Toast'
import { TableSkeleton } from '@/components/dashboard/Skeleton'

const formatearPrecio = (n) =>
  '$ ' + Number(n).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

const formatearFecha = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function PapeleraPage() {
  const toast = useToast()
  const [cotizaciones, setCotizaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [restaurando, setRestaurando] = useState(null)

  const fetchData = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('cotizaciones')
      .select('id, numero, created_at, deleted_at, estado, total, cliente_id, clientes(nombre)')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false })
    setCotizaciones(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleRestaurar = async (id) => {
    setRestaurando(id)
    const formData = new FormData()
    formData.set('id', id)
    const res = await restaurarCotizacion(formData)
    if (res?.success) {
      toast('Cotización restaurada', 'success')
      fetchData()
    } else {
      toast(res?.error || 'Error al restaurar', 'error')
    }
    setRestaurando(null)
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="mb-6 h-8 w-48 rounded bg-paper-deep animate-pulse" />
        <TableSkeleton rows={3} />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/cotizaciones" className="text-sm text-ink-soft hover:text-ink transition-colors">&larr; Cotizaciones</Link>
          <h1 className="text-2xl font-bold text-ink mt-1">Papelera</h1>
          <p className="text-sm text-ink-soft">
            {cotizaciones.length === 0
              ? 'No hay cotizaciones en la papelera'
              : `${cotizaciones.length} cotizacione${cotizaciones.length !== 1 ? 's' : ''} eliminada${cotizaciones.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {cotizaciones.length === 0 ? (
        <div className="rounded-xl border border-dashed border-paper-deep p-10 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-paper-deep">
            <svg className="h-6 w-6 text-ink-soft" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <p className="text-sm text-ink-soft/60">No hay cotizaciones en la papelera.</p>
          <p className="text-xs text-ink-soft/40 mt-1">Las cotizaciones eliminadas aparecerán aquí.</p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs text-ink-soft uppercase font-medium border-b border-paper-deep">
              <span className="col-span-2">N°</span>
              <span className="col-span-3">Cliente</span>
              <span className="col-span-2">Eliminada</span>
              <span className="col-span-2 text-right">Total</span>
              <span className="col-span-3 text-right">Acción</span>
            </div>
            <div className="divide-y divide-paper-deep">
              {cotizaciones.map((c) => (
                <div key={c.id} className="grid grid-cols-12 gap-2 px-4 py-3.5 text-sm items-center hover:bg-paper-deep/50 transition-colors">
                  <span className="col-span-2 font-medium text-ink">
                    COT-{String(c.numero).padStart(4, '0')}
                  </span>
                  <span className="col-span-3 truncate text-ink-soft">{c.clientes?.nombre}</span>
                  <span className="col-span-2 text-ink-soft">{formatearFecha(c.deleted_at)}</span>
                  <span className="col-span-2 text-right font-medium text-ink">{formatearPrecio(c.total)}</span>
                  <span className="col-span-3 text-right">
                    <button
                      onClick={() => handleRestaurar(c.id)}
                      disabled={restaurando === c.id}
                      className="rounded-xl bg-brand-light px-3 py-1.5 text-xs font-medium text-brand hover:bg-brand-light/70 disabled:opacity-50 transition-colors"
                    >
                      {restaurando === c.id ? '...' : 'Restaurar'}
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile */}
          <div className="sm:hidden space-y-2">
            {cotizaciones.map((c) => (
              <div key={c.id} className="rounded-xl border border-paper-deep bg-white p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-medium text-ink">COT-{String(c.numero).padStart(4, '0')}</span>
                  <button
                    onClick={() => handleRestaurar(c.id)}
                    disabled={restaurando === c.id}
                    className="rounded-lg bg-brand-light px-3 py-1 text-xs font-medium text-brand hover:bg-brand-light/70 disabled:opacity-50 transition-colors"
                  >
                    {restaurando === c.id ? '...' : 'Restaurar'}
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-light text-[10px] font-bold text-brand">
                    {c.clientes?.nombre?.charAt(0) || '?'}
                  </div>
                  <span className="text-sm text-ink-soft">{c.clientes?.nombre}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-ink-soft/60">Elim. {formatearFecha(c.deleted_at)}</span>
                  <span className="font-semibold text-ink">{formatearPrecio(c.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
