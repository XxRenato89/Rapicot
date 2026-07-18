'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { duplicarCotizacion } from '@/lib/actions/cotizaciones'
import { useToast } from '@/components/dashboard/Toast'
import { TableSkeleton } from '@/components/dashboard/Skeleton'

const ESTADOS = [
  { value: 'todas', label: 'Todos los estados' },
  { value: 'borrador', label: 'Borrador', color: 'bg-paper-deep text-ink-soft' },
  { value: 'enviada', label: 'Enviada', color: 'bg-blue-100 text-blue-700' },
  { value: 'aceptada', label: 'Aceptada', color: 'bg-brand-light text-brand' },
  { value: 'rechazada', label: 'Rechazada', color: 'bg-red-100 text-red-700' },
]

const formatearPrecio = (n, moneda) => {
  const sym = moneda === 'UF' ? 'UF ' : moneda === 'USD' ? 'US$ ' : '$ '
  return sym + Number(n).toLocaleString('es-CL', { minimumFractionDigits: moneda === 'UF' ? 2 : 0, maximumFractionDigits: moneda === 'UF' ? 2 : 0 })
}

const formatearFecha = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
}

function estaVencida(c) {
  if (!c.fecha_validez) return false
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  return new Date(c.fecha_validez) < hoy && c.estado !== 'aceptada' && c.estado !== 'rechazada'
}

function descargarCSV(filtradas, clientes) {
  const headers = ['N°', 'Cliente', 'Fecha', 'Estado', 'Total']
  const rows = filtradas.map((c) => {
    const cli = clientes.find((cl) => cl.id === c.cliente_id)
    return [
      `COT-${String(c.numero).padStart(4, '0')}`,
      cli?.nombre || '',
      formatearFecha(c.created_at),
      ESTADOS.find((e) => e.value === c.estado)?.label || c.estado,
      formatearPrecio(c.total, c.moneda || 'CLP'),
    ]
  })
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `cotizaciones_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function CotizacionesPage() {
  const toast = useToast()
  const [cotizaciones, setCotizaciones] = useState([])
  const [clientes, setClientes] = useState([])
  const [empresa, setEmpresa] = useState(null)
  const [filtroEstado, setFiltroEstado] = useState('todas')
  const [filtroCliente, setFiltroCliente] = useState('todos')
  const [loading, setLoading] = useState(true)
  const [duplicando, setDuplicando] = useState(null)

  const fetchData = useCallback(async () => {
    const supabase = createClient()
    const [cotRes, cliRes, empRes] = await Promise.all([
      supabase
        .from('cotizaciones')
        .select('id, numero, created_at, estado, total, cliente_id, fecha_validez, clientes(nombre)')
        .is('deleted_at', null)
        .order('created_at', { ascending: false }),
      supabase.from('clientes').select('id, nombre').order('nombre'),
      supabase.from('empresas').select('moneda').single().maybeSingle(),
    ])
    setCotizaciones(cotRes.data ?? [])
    setClientes(cliRes.data ?? [])
    setEmpresa(empRes.data ?? { moneda: 'CLP' })
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const filtradas = cotizaciones.filter((c) => {
    if (filtroEstado !== 'todas' && c.estado !== filtroEstado) return false
    if (filtroCliente !== 'todos' && c.cliente_id !== filtroCliente) return false
    return true
  })

  const moneda = empresa?.moneda || 'CLP'

  const mesActual = new Date().getMonth()
  const anioActual = new Date().getFullYear()
  const cotizacionesMes = cotizaciones.filter((c) => {
    const d = new Date(c.created_at)
    return d.getMonth() === mesActual && d.getFullYear() === anioActual
  })
  const totalMes = cotizacionesMes.reduce((s, c) => s + Number(c.total), 0)
  const conteoEstados = {
    borrador: cotizaciones.filter((c) => c.estado === 'borrador').length,
    enviada: cotizaciones.filter((c) => c.estado === 'enviada').length,
    aceptada: cotizaciones.filter((c) => c.estado === 'aceptada').length,
    rechazada: cotizaciones.filter((c) => c.estado === 'rechazada').length,
  }
  const tasaAceptacion = conteoEstados.enviada > 0
    ? Math.round((conteoEstados.aceptada / (conteoEstados.enviada + conteoEstados.aceptada)) * 100)
    : 0

  const handleDuplicar = async (id) => {
    setDuplicando(id)
    const formData = new FormData()
    formData.set('id', id)
    const res = await duplicarCotizacion(formData)
    if (res?.success) {
      toast('Cotización duplicada', 'success')
      fetchData()
    } else {
      toast(res?.error || 'Error al duplicar', 'error')
    }
    setDuplicando(null)
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
        <div className="mb-6 h-8 w-48 rounded bg-paper-deep animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {[1,2,3,4,5].map((i) => <div key={i} className="h-20 rounded-xl bg-paper-deep animate-pulse" />)}
        </div>
        <TableSkeleton rows={5} />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Cotizaciones</h1>
          <p className="text-sm text-ink-soft">{cotizaciones.length} cotizacione{cotizaciones.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/cotizaciones/papelera"
            className="rounded-xl border border-paper-deep px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-deep transition-colors"
          >
            Papelera
          </Link>
          <button
            onClick={() => descargarCSV(filtradas, clientes)}
            className="rounded-xl border border-paper-deep px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-deep transition-colors"
          >
            Exportar CSV
          </button>
          <Link
            href="/cotizaciones/nueva"
            className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            + Crear cotización
          </Link>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <div className="rounded-xl border border-paper-deep bg-white p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs text-ink-soft font-medium uppercase tracking-wide">Total mes</p>
          <p className="text-sm sm:text-lg font-bold text-ink mt-0.5 truncate">{formatearPrecio(totalMes, moneda)}</p>
        </div>
        <div className="rounded-xl border border-paper-deep bg-white p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs text-ink-soft font-medium uppercase tracking-wide">Borrador</p>
          <p className="text-sm sm:text-lg font-bold text-ink-soft mt-0.5">{conteoEstados.borrador}</p>
        </div>
        <div className="rounded-xl border border-paper-deep bg-white p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs text-ink-soft font-medium uppercase tracking-wide">Enviadas</p>
          <p className="text-sm sm:text-lg font-bold text-blue-700 mt-0.5">{conteoEstados.enviada}</p>
        </div>
        <div className="rounded-xl border border-paper-deep bg-white p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs text-ink-soft font-medium uppercase tracking-wide">Aceptadas</p>
          <p className="text-sm sm:text-lg font-bold text-brand mt-0.5">{conteoEstados.aceptada}</p>
        </div>
        <div className="rounded-xl border border-paper-deep bg-white p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs text-ink-soft font-medium uppercase tracking-wide">Tasa acept.</p>
          <p className="text-sm sm:text-lg font-bold text-ink mt-0.5">{tasaAceptacion}%</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full rounded-xl border border-paper-deep bg-paper pl-10 pr-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20 appearance-none"
          >
            <option value="todas">Todos los estados</option>
            {ESTADOS.slice(1).map((e) => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
        </div>
        <select
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
          className="rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          <option value="todos">Todos los clientes</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      {filtradas.length === 0 ? (
        <div className="rounded-xl border border-dashed border-paper-deep p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-light">
            <svg className="h-7 w-7 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          {cotizaciones.length === 0 ? (
            <>
              <p className="text-sm text-ink-soft/60 mb-1">Aún no has creado ninguna cotización.</p>
              <p className="text-xs text-ink-soft/40 mb-4">En 5 minutos tienes tu primer PDF profesional listo para enviar.</p>
              <Link href="/cotizaciones/nueva"
                className="inline-block rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors">
                + Crear primera cotización
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm text-ink-soft/60 mb-1">No hay cotizaciones con esos filtros.</p>
              <p className="text-xs text-ink-soft/40">Prueba cambiando el estado o el cliente seleccionado.</p>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs text-ink-soft uppercase font-medium border-b border-paper-deep">
              <span className="col-span-2">N°</span>
              <span className="col-span-3">Cliente</span>
              <span className="col-span-2">Fecha</span>
              <span className="col-span-2 text-right">Total</span>
              <span className="col-span-3 text-right">Estado</span>
            </div>
            <div className="divide-y divide-paper-deep">
              {filtradas.map((c) => {
                const est = ESTADOS.find((e) => e.value === c.estado)
                const vencida = estaVencida(c)
                return (
                  <div key={c.id} className="group relative">
                    <Link
                      href={`/cotizaciones/${c.id}`}
                      className={`grid grid-cols-12 gap-2 px-4 py-3.5 text-sm hover:bg-paper-deep items-center transition-colors ${vencida ? 'opacity-70' : ''}`}
                    >
                      <span className="col-span-2 font-medium text-ink flex items-center gap-1.5">
                        {vencida && (
                          <span className="inline-block h-2 w-2 rounded-full bg-red-500" title="Vencida" />
                        )}
                        COT-{String(c.numero).padStart(4, '0')}
                      </span>
                      <span className="col-span-3 truncate text-ink">{c.clientes?.nombre}</span>
                      <span className="col-span-2 text-ink-soft">{formatearFecha(c.created_at)}</span>
                      <span className="col-span-2 text-right font-medium text-ink">{formatearPrecio(c.total, moneda)}</span>
                      <span className="col-span-3 text-right flex items-center justify-end gap-2">
                        {vencida && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Vencida</span>
                        )}
                        {est && (
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${est.color}`}>
                            {est.label}
                          </span>
                        )}
                      </span>
                    </Link>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1">
                      <button
                        onClick={(e) => { e.preventDefault(); handleDuplicar(c.id) }}
                        disabled={duplicando === c.id}
                        className="rounded-lg border border-paper-deep bg-white px-2 py-1 text-xs text-ink-soft hover:bg-paper-deep disabled:opacity-50 transition-colors"
                      >
                        {duplicando === c.id ? '...' : 'Duplicar'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-2">
            {filtradas.map((c) => {
              const est = ESTADOS.find((e) => e.value === c.estado)
              const vencida = estaVencida(c)
              return (
                <div key={c.id} className="relative">
                  <Link
                    href={`/cotizaciones/${c.id}`}
                    className={`block rounded-xl border border-paper-deep bg-white p-4 hover:bg-paper-deep transition-colors ${vencida ? 'opacity-70' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-ink flex items-center gap-1.5">
                        {vencida && <span className="inline-block h-2 w-2 rounded-full bg-red-500" />}
                        COT-{String(c.numero).padStart(4, '0')}
                      </span>
                      <div className="flex items-center gap-1">
                        {vencida && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">Vencida</span>}
                        {est && <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${est.color}`}>{est.label}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-light text-[10px] font-bold text-brand">
                        {c.clientes?.nombre?.charAt(0) || '?'}
                      </div>
                      <span className="text-sm text-ink-soft">{c.clientes?.nombre}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-ink-soft/60">{formatearFecha(c.created_at)}</span>
                      <span className="font-semibold text-ink">{formatearPrecio(c.total, moneda)}</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleDuplicar(c.id)}
                    disabled={duplicando === c.id}
                    className="mt-1 w-full rounded-lg border border-dashed border-paper-deep py-1.5 text-xs text-ink-soft hover:bg-paper-deep disabled:opacity-50 transition-colors"
                  >
                    {duplicando === c.id ? 'Duplicando...' : '+ Duplicar'}
                  </button>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
