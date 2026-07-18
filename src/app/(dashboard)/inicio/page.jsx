'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import CalificacionServicio from '@/components/dashboard/CalificacionServicio'

const CHK_STORAGE_KEY = 'rapicot-checklist-dismissed'

const formatearPrecio = (n) =>
  '$ ' + Number(n).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

const formatearFecha = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function DashboardHome() {
  const [data, setData] = useState(null)
  const [onboarding, setOnboarding] = useState({ logo: false, clientes: false, cotizaciones: false })
  const [checklistDismissed, setChecklistDismissed] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data: profile } = await supabase
      .from('profiles')
      .select('empresa_id')
      .eq('id', user.id)
      .single()

    if (!profile?.empresa_id) { setLoading(false); return }

    const empresaId = profile.empresa_id

    const [cotRes, cliCount, prodCount, empRes] = await Promise.all([
      supabase
        .from('cotizaciones')
        .select('id, numero, created_at, estado, total, cliente_id, clientes(nombre)')
        .eq('empresa_id', empresaId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.from('clientes').select('id', { count: 'exact', head: true }).eq('empresa_id', empresaId),
      supabase.from('productos').select('id', { count: 'exact', head: true }).eq('empresa_id', empresaId),
      supabase.from('empresas').select('logo_url').eq('id', empresaId).single(),
    ])

    const cotizaciones = cotRes.data ?? []
    const totalClientes = cliCount?.length ?? 0
    const totalProductos = prodCount?.length ?? 0
    const totalCotizaciones = cotizaciones.length

    setData({
      cotizaciones,
      totalClientes,
      totalProductos,
      totalCotizaciones,
      enviadas: cotizaciones.filter((c) => c.estado === 'enviada').length,
      aceptadas: cotizaciones.filter((c) => c.estado === 'aceptada').length,
    })

    setOnboarding({
      logo: !!empRes.data?.logo_url,
      clientes: totalClientes > 0,
      cotizaciones: totalCotizaciones > 0,
    })

    const dismissed = localStorage.getItem(CHK_STORAGE_KEY)
    if (dismissed === 'true') setChecklistDismissed(true)

    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  function dismissChecklist() {
    localStorage.setItem(CHK_STORAGE_KEY, 'true')
    setChecklistDismissed(true)
  }

  const pasos = [
    {
      key: 'logo',
      label: 'Completa los datos de tu empresa',
      desc: 'Agrega tu logo, RUT y dirección para que aparezcan en tus cotizaciones.',
      href: '/perfil',
      done: onboarding.logo,
    },
    {
      key: 'clientes',
      label: 'Agrega tu primer cliente',
      desc: 'Registra los datos de tus clientes para no tener que escribirlos cada vez.',
      href: '/clientes',
      done: onboarding.clientes,
    },
    {
      key: 'cotizaciones',
      label: 'Crea tu primera cotización',
      desc: 'Selecciona un cliente, agrega productos y genera tu primer PDF profesional.',
      href: '/cotizaciones/nueva',
      done: onboarding.cotizaciones,
    },
  ]

  const todosCompletos = pasos.every((p) => p.done)
  const mostrarChecklist = !checklistDismissed && !todosCompletos && !loading

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
        <div className="mb-8 h-8 w-48 rounded bg-paper-deep animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-paper-deep bg-white p-5">
              <div className="mb-2 h-4 w-20 rounded bg-paper-deep animate-pulse" />
              <div className="h-8 w-16 rounded bg-paper-deep animate-pulse" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-paper-deep bg-white p-5">
          <div className="mb-4 h-5 w-32 rounded bg-paper-deep animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-lg bg-paper-deep animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const STATS = [
    { label: 'Cotizaciones', value: data?.totalCotizaciones ?? 0 },
    { label: 'Enviadas', value: data?.enviadas ?? 0 },
    { label: 'Aceptadas', value: data?.aceptadas ?? 0 },
    { label: 'Clientes', value: data?.totalClientes ?? 0 },
  ]

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto animate-fade-in">
      <CalificacionServicio />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Panel principal</h1>
          <p className="text-sm text-ink-soft mt-1">Resumen de tu actividad</p>
        </div>
        <Link
          href="/cotizaciones/nueva"
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
        >
          + Nueva cotización
        </Link>
      </div>

      {/* Onboarding Checklist */}
      {mostrarChecklist && (
        <div className="mb-8 rounded-2xl border border-brand-light bg-brand-light/30 p-5 sm:p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-ink">¡Bienvenido a Rapicot!</h2>
              <p className="mt-0.5 text-sm text-ink-soft">
                Completa estos pasos para empezar a cotizar como profesional.
              </p>
            </div>
            <button
              onClick={dismissChecklist}
              className="text-ink-soft hover:text-ink transition-colors"
              title="Cerrar"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M6 6l8 8M14 6l-8 8" />
              </svg>
            </button>
          </div>
          <div className="space-y-3">
            {pasos.map((paso, i) => (
              <Link
                key={paso.key}
                href={paso.href}
                className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${
                  paso.done
                    ? 'border-brand-light/50 bg-white/60'
                    : 'border-paper-deep bg-white hover:border-brand-light'
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    paso.done
                      ? 'bg-brand text-white'
                      : 'bg-paper-deep text-ink-soft'
                  }`}
                >
                  {paso.done ? (
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 10l3 3 6-6" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${paso.done ? 'text-ink-soft line-through' : 'text-ink'}`}>
                    {paso.label}
                  </p>
                  {!paso.done && <p className="mt-0.5 text-xs text-ink-soft">{paso.desc}</p>}
                </div>
                {!paso.done && (
                  <span className="text-xs font-medium text-brand shrink-0">Ir &rarr;</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-paper-deep bg-white p-5 hover:shadow-sm transition-shadow">
            <p className="text-xs text-ink-soft font-medium uppercase tracking-wide mb-2">{s.label}</p>
            <p className="text-2xl font-bold text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-paper-deep bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-ink">Últimas cotizaciones</h2>
            <Link href="/cotizaciones" className="text-xs text-brand hover:underline">Ver todas</Link>
          </div>
          {data?.cotizaciones?.length === 0 ? (
            <div className="rounded-lg border border-dashed border-paper-deep p-6 text-center">
              <p className="text-sm text-ink-soft/60">Aún no hay cotizaciones</p>
              <Link href="/cotizaciones/nueva" className="mt-2 inline-block text-sm text-brand hover:underline">
                Crear la primera
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {data?.cotizaciones?.map((c) => (
                <Link
                  key={c.id}
                  href={`/cotizaciones/${c.id}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-paper-deep transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink truncate">
                      COT-{String(c.numero).padStart(4, '0')}
                    </p>
                    <p className="text-xs text-ink-soft truncate">
                      {c.clientes?.nombre} &middot; {formatearFecha(c.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span className="text-sm font-medium text-ink">{formatearPrecio(c.total)}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      c.estado === 'borrador' ? 'bg-paper-deep text-ink-soft' :
                      c.estado === 'enviada' ? 'bg-blue-100 text-blue-700' :
                      c.estado === 'aceptada' ? 'bg-brand-light text-brand' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {c.estado.charAt(0).toUpperCase() + c.estado.slice(1)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-paper-deep bg-white p-5">
          <h2 className="text-sm font-semibold text-ink mb-4">Acciones rápidas</h2>
          <div className="grid grid-cols-1 gap-2">
            <Link href="/cotizaciones/nueva"
              className="flex items-center gap-3 rounded-lg border border-paper-deep p-3 hover:bg-paper-deep transition-colors">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-light text-accent">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 4v16m8-8H4" /></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-ink">Nueva cotización</p>
                <p className="text-xs text-ink-soft">Crea y envía una cotización en minutos</p>
              </div>
            </Link>
            <Link href="/clientes"
              className="flex items-center gap-3 rounded-lg border border-paper-deep p-3 hover:bg-paper-deep transition-colors">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-light text-brand">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-ink">Nuevo cliente</p>
                <p className="text-xs text-ink-soft">Agrega un cliente al sistema</p>
              </div>
            </Link>
            <Link href="/catalogo"
              className="flex items-center gap-3 rounded-lg border border-paper-deep p-3 hover:bg-paper-deep transition-colors">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-light text-brand">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-ink">Nuevo producto</p>
                <p className="text-xs text-ink-soft">Agrega productos al catálogo</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
