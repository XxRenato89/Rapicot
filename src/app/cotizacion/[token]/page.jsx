import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ResponderCotizacion from './ResponderCotizacion'

const ESTADOS = {
  borrador: { label: 'Borrador', color: 'bg-paper-deep text-ink-soft' },
  enviada: { label: 'Enviada', color: 'bg-blue-100 text-blue-700' },
  aceptada: { label: 'Aceptada', color: 'bg-brand-light text-brand' },
  rechazada: { label: 'Rechazada', color: 'bg-red-100 text-red-700' },
}

const formatearPrecio = (n, moneda) => {
  const sym = moneda === 'UF' ? 'UF ' : moneda === 'USD' ? 'US$ ' : '$ '
  return sym + Number(n).toLocaleString('es-CL', { minimumFractionDigits: moneda === 'UF' ? 2 : 0, maximumFractionDigits: moneda === 'UF' ? 2 : 0 })
}

const formatearFecha = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' })
}

export async function generateMetadata({ params }) {
  const { token } = await params
  const supabase = await createClient()
  const { data: c } = await supabase
    .from('cotizaciones')
    .select('numero, empresas!inner(nombre)')
    .eq('token', token)
    .single()

  if (!c) return {}

  return {
    title: `Cotización COT-${String(c.numero).padStart(4, '0')} — ${c.empresas?.nombre || 'Rapicot'}`,
    description: `Cotización profesional de ${c.empresas?.nombre || 'Rapicot'}. Revisa y responde en línea.`,
    robots: { index: false, follow: false },
  }
}

export default async function CotizacionPublicaPage({ params }) {
  const { token } = await params
  const supabase = await createClient()

  const { data: c } = await supabase
    .from('cotizaciones')
    .select('*, empresas(*), clientes(*)')
    .eq('token', token)
    .single()

  if (!c) notFound()

  const { data: items } = await supabase
    .from('cotizacion_items')
    .select('*')
    .eq('cotizacion_id', c.id)
    .order('created_at')

  const empresa = c.empresas
  const cliente = c.clientes
  const itemsList = items ?? []
  const numPadded = `COT-${String(c.numero).padStart(4, '0')}`
  const moneda = empresa?.moneda || 'CLP'
  const est = ESTADOS[c.estado] || ESTADOS.enviada

  const subtotal = itemsList.reduce((s, i) => s + Number(i.cantidad) * Number(i.precio_unitario), 0)
  const descuentoItems = itemsList.reduce((s, i) => s + Number(i.descuento), 0)
  const neto = subtotal - descuentoItems
  const iva = neto * 0.19
  const total = neto + iva

  const puedeResponder = c.estado === 'enviada' && !c.respondida_at

  return (
    <div className="min-h-full bg-paper">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Logo + Empresa */}
        <div className="mb-8 text-center">
          {empresa.logo_url ? (
            <img
              src={empresa.logo_url}
              alt={empresa.nombre}
              className="mx-auto mb-4 h-14 w-auto object-contain"
            />
          ) : (
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand text-xl font-bold text-white">
              {empresa.nombre?.charAt(0)?.toUpperCase() || 'E'}
            </div>
          )}
          <h1 className="font-display text-2xl tracking-tight sm:text-3xl">{empresa.nombre}</h1>
          <div className="mt-1 text-sm text-ink-soft">
            {empresa.rut && <span className="mr-3">{empresa.rut}</span>}
            {empresa.direccion && <span className="mr-3">{empresa.direccion}</span>}
            {empresa.telefono && <span className="mr-3">{empresa.telefono}</span>}
            {empresa.email && <span>{empresa.email}</span>}
          </div>
        </div>

        {/* Cotización header */}
        <div className="mb-6 rounded-2xl border border-paper-deep bg-white p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-ink">{numPadded}</h2>
              <p className="mt-1 text-sm text-ink-soft">Fecha: {formatearFecha(c.created_at)}</p>
              {c.fecha_validez && (
                <p className="text-sm text-ink-soft">Válida hasta: {formatearFecha(c.fecha_validez)}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {c.respondida_at ? (
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${est.color}`}>
                  {est.label}
                </span>
              ) : (
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${est.color}`}>
                  {est.label}
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-paper-deep pt-4">
            <p className="text-xs text-ink-soft uppercase tracking-wide font-medium mb-1">Cliente</p>
            <p className="font-medium text-ink">{cliente.nombre}</p>
            {cliente.rut && <p className="text-sm text-ink-soft">RUT: {cliente.rut}</p>}
            {cliente.direccion && <p className="text-sm text-ink-soft">{cliente.direccion}</p>}
            {(cliente.email || cliente.telefono) && (
              <div className="mt-1 flex flex-wrap gap-3 text-sm text-ink-soft">
                {cliente.email && <span>{cliente.email}</span>}
                {cliente.telefono && <span>{cliente.telefono}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-paper-deep bg-white">
          <div className="hidden sm:grid grid-cols-12 gap-2 px-5 py-3 text-xs text-ink-soft uppercase font-medium border-b border-paper-deep bg-paper">
            <span className="col-span-1">Cant.</span>
            <span className="col-span-5">Descripción</span>
            <span className="col-span-2 text-right">P. Unitario</span>
            <span className="col-span-2 text-right">Descuento</span>
            <span className="col-span-2 text-right">Total</span>
          </div>
          <div className="divide-y divide-paper-deep">
            {itemsList.map((it) => (
              <div key={it.id} className="grid grid-cols-2 sm:grid-cols-12 gap-1 sm:gap-2 px-5 py-3.5 text-sm hover:bg-paper/50 transition-colors">
                <span className="sm:col-span-1 text-ink-soft">{it.cantidad}</span>
                <span className="sm:col-span-5 font-medium text-ink">{it.descripcion}</span>
                <span className="sm:col-span-2 text-right text-ink-soft">{formatearPrecio(it.precio_unitario, moneda)}</span>
                <span className="sm:col-span-2 text-right text-red-600">{it.descuento > 0 ? `-${formatearPrecio(it.descuento, moneda)}` : '-'}</span>
                <span className="sm:col-span-2 text-right font-medium text-ink">{formatearPrecio(it.total, moneda)}</span>
              </div>
            ))}
          </div>

          {/* Totales */}
          <div className="border-t border-paper-deep bg-paper px-5 py-4">
            <div className="ml-auto max-w-xs space-y-1.5 text-sm">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span><span>{formatearPrecio(subtotal, moneda)}</span>
              </div>
              {descuentoItems > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Descuento</span><span>-{formatearPrecio(descuentoItems, moneda)}</span>
                </div>
              )}
              <div className="flex justify-between text-ink-soft">
                <span>IVA 19%</span><span>{formatearPrecio(iva, moneda)}</span>
              </div>
              <div className="flex justify-between border-t border-paper-deep pt-2 text-base font-bold text-ink">
                <span>Total</span><span>{formatearPrecio(c.total || total, moneda)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notas */}
        {c.notas && (
          <div className="mb-6 rounded-2xl border border-paper-deep bg-white p-5">
            <p className="text-xs text-ink-soft uppercase tracking-wide font-medium mb-2">Notas / Condiciones</p>
            <p className="text-sm whitespace-pre-wrap text-ink-soft">{c.notas}</p>
          </div>
        )}

        {/* Respuesta del cliente */}
        {c.respondida_at ? (
          <div className={`rounded-2xl border p-6 text-center ${
            c.estado === 'aceptada'
              ? 'border-brand-light bg-brand-light/30'
              : 'border-red-100 bg-red-50'
          }`}>
            <div className="mb-2 flex justify-center">
              {c.estado === 'aceptada' ? (
                <svg className="h-10 w-10 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="h-10 w-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <p className="text-lg font-semibold text-ink">
              Cotización {c.estado === 'aceptada' ? 'aceptada' : 'rechazada'}
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Respondida el {formatearFecha(c.respondida_at)}.
            </p>
          </div>
        ) : puedeResponder ? (
          <ResponderCotizacion token={token} />
        ) : null}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-ink-soft/40">
          {empresa.nombre} &middot; Cotización generada con Rapicot
        </div>
      </div>
    </div>
  )
}
