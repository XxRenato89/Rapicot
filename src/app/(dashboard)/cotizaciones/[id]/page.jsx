'use client'

import { useEffect, useState, useCallback, use } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { actualizarEstado, duplicarCotizacion, eliminarCotizacion } from '@/lib/actions/cotizaciones'
import { generarPDF, descargarPDF, blobPDF } from '@/lib/pdf/generarPDF'
import { useToast } from '@/components/dashboard/Toast'

const ESTADOS = [
  { value: 'borrador', label: 'Borrador', color: 'bg-paper-deep text-ink-soft' },
  { value: 'enviada', label: 'Enviada', color: 'bg-blue-100 text-blue-700' },
  { value: 'aceptada', label: 'Aceptada', color: 'bg-brand-light text-brand' },
  { value: 'rechazada', label: 'Rechazada', color: 'bg-red-100 text-red-700' },
]

const formatearPrecio = (n) =>
  '$ ' + Number(n).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

const formatearFecha = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function CotizacionDetallePage({ params }) {
  const toast = useToast()
  const { id } = use(params)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [estado, setEstado] = useState('')
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [sharing, setSharing] = useState(null)
  const [confirmEnviar, setConfirmEnviar] = useState(false)
  const [confirmEliminar, setConfirmEliminar] = useState(false)

  const fetchData = useCallback(async () => {
    const supabase = createClient()
    const { data: cotizacion } = await supabase
      .from('cotizaciones')
      .select('*, clientes(*), empresas!inner(*)')
      .eq('id', id)
      .single()

    if (cotizacion) {
      const { data: items } = await supabase
        .from('cotizacion_items')
        .select('*')
        .eq('cotizacion_id', id)
        .order('created_at')
      setData({ ...cotizacion, items: items ?? [] })
      setEstado(cotizacion.estado)
    }
    setLoading(false)
  }, [id])

  useEffect(() => { fetchData() }, [fetchData])

  const handleEstadoChange = async (e) => {
    const nuevo = e.target.value
    const formData = new FormData()
    formData.set('id', id)
    formData.set('estado', nuevo)
    const res = await actualizarEstado(formData)
    if (res?.success) {
      setEstado(nuevo)
      const label = ESTADOS.find((e) => e.value === nuevo)?.label
      if (nuevo === 'aceptada') {
        toast('¡Cotización aceptada!', 'celebration')
      } else {
        toast(`Estado actualizado a "${label}"`, 'success')
      }
    } else {
      toast(res?.error || 'Error al actualizar estado', 'error')
    }
  }

  const handleDownloadPDF = async () => {
    if (!data) return
    setPdfGenerating(true)
    try {
      const doc = await generarPDF({
        cotizacion: data,
        empresa: data.empresas,
        cliente: data.clientes,
        items: data.items,
      })
      const num = `COT-${String(data.numero).padStart(4, '0')}`
      descargarPDF(doc, `${num}.pdf`)
      toast('PDF descargado', 'success')
    } catch (e) {
      toast('Error al generar el PDF', 'error')
    }
    setPdfGenerating(false)
  }

  const subirPDF = async () => {
    const doc = await generarPDF({
      cotizacion: data,
      empresa: data.empresas,
      cliente: data.clientes,
      items: data.items,
    })
    const blob = await blobPDF(doc)
    const path = `${data.empresas.id}/${data.id}.pdf`
    const supabase = createClient()
    const { error } = await supabase.storage.from('cotizaciones-pdf').upload(path, blob, {
      contentType: 'application/pdf',
      upsert: true,
    })
    if (error) throw error
    const { data: urlData } = supabase.storage.from('cotizaciones-pdf').getPublicUrl(path)
    return urlData.publicUrl
  }

  const marcarEnviada = async () => {
    if (estado === 'borrador') {
      const formData = new FormData()
      formData.set('id', id)
      formData.set('estado', 'enviada')
      const res = await actualizarEstado(formData)
      if (res?.success) setEstado('enviada')
    }
  }

  const handleWhatsApp = async () => {
    if (!data || !data.clientes?.telefono) return
    if (estado === 'borrador') {
      setConfirmEnviar('whatsapp')
      return
    }
    await doWhatsApp()
  }

  const doWhatsApp = async () => {
    setConfirmEnviar(null)
    setSharing('whatsapp')
    try {
      await subirPDF()
      await marcarEnviada()
      const num = `COT-${String(data.numero).padStart(4, '0')}`
      const link = `${location.origin}/cotizacion/${data.token}`
      const msg = encodeURIComponent(
        `Hola ${data.clientes.nombre}, te comparto nuestra cotización ${num} por un total de ${formatearPrecio(data.total)}.\n\nPuedes revisarla, aceptarla o rechazarla en línea aquí: ${link}`
      )
      const tel = data.clientes.telefono.replace(/\D/g, '')
      window.open(`https://wa.me/${tel}?text=${msg}`, '_blank')
      toast('Cotización enviada por WhatsApp', 'success')
    } catch (e) {
      toast('Error al compartir por WhatsApp', 'error')
    }
    setSharing(null)
  }

  const handleEmail = async () => {
    if (!data || !data.clientes?.email) return
    if (estado === 'borrador') {
      setConfirmEnviar('email')
      return
    }
    await doEmail()
  }

  const doEmail = async () => {
    setConfirmEnviar(null)
    setSharing('email')
    try {
      await subirPDF()
      await marcarEnviada()
      const num = `COT-${String(data.numero).padStart(4, '0')}`
      const link = `${location.origin}/cotizacion/${data.token}`
      const subject = encodeURIComponent(`Cotización ${num} - ${data.empresas.nombre}`)
      const body = encodeURIComponent(
        `Hola ${data.clientes.nombre},\n\nTe compartimos nuestra cotización ${num} por un total de ${formatearPrecio(data.total)}.\n\nPuedes revisarla y responderla en línea aquí: ${link}\n\n${data.notas ? `\n${data.notas}` : ''}\n\nSaludos,\n${data.empresas.nombre}`
      )
      window.open(`mailto:${data.clientes.email}?subject=${subject}&body=${body}`, '_blank')
      toast('Cotización enviada por correo', 'success')
    } catch (e) {
      toast('Error al enviar por correo', 'error')
    }
    setSharing(null)
  }

  const handleDuplicar = async () => {
    const formData = new FormData()
    formData.set('id', id)
    const res = await duplicarCotizacion(formData)
    if (res?.success) {
      toast('Cotización duplicada', 'success')
      window.location.href = `/cotizaciones/${res.id}`
    } else {
      toast(res?.error || 'Error al duplicar', 'error')
    }
  }

  const handleEliminar = async () => {
    const formData = new FormData()
    formData.set('id', id)
    const res = await eliminarCotizacion(formData)
    if (res?.success) {
      toast('Cotización eliminada', 'success')
      window.location.href = '/cotizaciones'
    } else {
      toast(res?.error || 'Error al eliminar', 'error')
    }
    setConfirmEliminar(false)
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        <div className="mb-6 h-8 w-48 rounded bg-paper-deep animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="h-32 rounded-xl bg-paper-deep animate-pulse" />
          <div className="h-32 rounded-xl bg-paper-deep animate-pulse" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-xl bg-paper-deep animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!data) return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto text-center py-20">
      <p className="text-ink-soft/60">Cotización no encontrada</p>
      <Link href="/cotizaciones" className="mt-2 inline-block text-sm text-brand hover:underline">Volver a cotizaciones</Link>
    </div>
  )

  const c = data
  const empresa = c.empresas
  const cliente = c.clientes
  const items = c.items
  const numPadded = `COT-${String(c.numero).padStart(4, '0')}`

  const subtotal = items.reduce((s, i) => s + Number(i.cantidad) * Number(i.precio_unitario), 0)
  const descuentoItems = items.reduce((s, i) => s + Number(i.descuento), 0)
  const neto = subtotal - descuentoItems
  const iva = neto * 0.19
  const total = neto + iva

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto animate-fade-in">
      {/* Confirmación enviar */}
      {confirmEnviar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4" onClick={() => setConfirmEnviar(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-ink mb-2">Enviar cotización</h2>
            <p className="text-sm text-ink-soft mb-1">
              Esta cotización está en borrador. Al compartirla se marcará automáticamente como <strong>Enviada</strong>.
            </p>
            <p className="text-sm text-ink-soft mb-4">¿Quieres continuar?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmEnviar(null)}
                className="rounded-xl border border-paper-deep px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-deep transition-colors">Cancelar</button>
              <button onClick={confirmEnviar === 'whatsapp' ? doWhatsApp : doEmail}
                className="rounded-xl bg-accent px-4 py-2.5 text-sm text-white hover:bg-accent-hover transition-colors">
                Enviar y marcar como enviada
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmación eliminar */}
      {confirmEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4" onClick={() => setConfirmEliminar(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-ink mb-2">Eliminar cotización</h2>
            <p className="text-sm text-ink-soft mb-4">
              La cotización se moverá a la papelera. Podrás restaurarla después si es necesario.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmEliminar(false)}
                className="rounded-xl border border-paper-deep px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-deep transition-colors">Cancelar</button>
              <button onClick={handleEliminar}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm text-white hover:bg-red-700 transition-colors">
                Mover a papelera
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Encabezado */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Link href="/cotizaciones" className="text-sm text-ink-soft hover:text-ink transition-colors">&larr; Cotizaciones</Link>
          <h1 className="text-2xl font-bold text-ink mt-1">{numPadded}</h1>
          <p className="text-sm text-ink-soft mt-0.5">{formatearFecha(c.created_at)}</p>
          {c.fecha_validez && (
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-xs text-ink-soft/60">Válida hasta:</span>
              <span className="text-xs font-medium text-ink">{formatearFecha(c.fecha_validez)}</span>
              {new Date(c.fecha_validez) < new Date(new Date().toDateString()) && c.estado !== 'aceptada' && c.estado !== 'rechazada' && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">Vencida</span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleDownloadPDF} disabled={pdfGenerating}
            className="inline-flex items-center gap-1.5 rounded-xl border border-paper-deep bg-white px-4 py-2.5 text-sm font-medium text-ink hover:bg-paper-deep disabled:opacity-50 transition-colors">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {pdfGenerating ? 'Generando...' : 'PDF'}
          </button>
          {cliente?.telefono && (
            <button onClick={handleWhatsApp} disabled={sharing === 'whatsapp'}
              className="inline-flex items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              {sharing === 'whatsapp' ? 'Compartiendo...' : 'WhatsApp'}
            </button>
          )}
          {cliente?.email && (
            <button onClick={handleEmail} disabled={sharing === 'email'}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {sharing === 'email' ? 'Enviando...' : 'Correo'}
            </button>
          )}
          <button onClick={handleDuplicar}
            className="inline-flex items-center gap-1.5 rounded-xl border border-paper-deep bg-white px-4 py-2.5 text-sm font-medium text-ink hover:bg-paper-deep transition-colors">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Duplicar
          </button>
          <button onClick={() => setConfirmEliminar(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar
          </button>
        </div>
      </div>

      {/* Empresa + Cliente */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-paper-deep bg-white p-5">
          <p className="text-xs text-ink-soft uppercase tracking-wide font-medium mb-2">Empresa</p>
          <p className="font-medium text-ink">{empresa.nombre}</p>
          {empresa.rut && <p className="text-sm text-ink-soft mt-0.5">{empresa.rut}</p>}
          {empresa.direccion && <p className="text-sm text-ink-soft mt-0.5">{empresa.direccion}</p>}
          {(empresa.telefono || empresa.email) && (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
              {empresa.telefono && <span>{empresa.telefono}</span>}
              {empresa.email && <span>{empresa.email}</span>}
            </div>
          )}
        </div>
        <div className="rounded-xl border border-paper-deep bg-white p-5">
          <p className="text-xs text-ink-soft uppercase tracking-wide font-medium mb-2">Cliente</p>
          <p className="font-medium text-ink">{cliente.nombre}</p>
          {cliente.rut && <p className="text-sm text-ink-soft mt-0.5">RUT: {cliente.rut}</p>}
          {cliente.direccion && <p className="text-sm text-ink-soft mt-0.5">{cliente.direccion}</p>}
          {(cliente.email || cliente.telefono) && (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
              {cliente.email && <span>{cliente.email}</span>}
              {cliente.telefono && <span>{cliente.telefono}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Estado */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm text-ink-soft">Estado:</span>
        <select value={estado} onChange={handleEstadoChange}
          className="rounded-xl border border-paper-deep bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors">
          {ESTADOS.map((e) => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>
        {(() => {
          const est = ESTADOS.find((e) => e.value === estado)
          return est ? <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${est.color}`}>{est.label}</span> : null
        })()}
      </div>

      {/* Items */}
      <div className="mb-6">
        <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2 text-xs text-ink-soft uppercase font-medium border-b border-paper-deep">
          <span className="col-span-1">Cant</span>
          <span className="col-span-4">Descripción</span>
          <span className="col-span-2 text-right">P. Unitario</span>
          <span className="col-span-2 text-right">Descuento</span>
          <span className="col-span-3 text-right">Total</span>
        </div>
        <div className="space-y-1 mt-1">
          {items.map((it) => (
            <div key={it.id} className="grid grid-cols-2 sm:grid-cols-12 gap-1 sm:gap-2 rounded-xl border border-paper-deep bg-white p-3.5 sm:px-4 sm:py-3 text-sm hover:bg-paper-deep/50 transition-colors">
              <span className="sm:col-span-1 text-ink-soft">{it.cantidad}</span>
              <span className="sm:col-span-4 font-medium text-ink truncate">{it.descripcion}</span>
              <span className="sm:col-span-2 text-right text-ink-soft">{formatearPrecio(it.precio_unitario)}</span>
              <span className="sm:col-span-2 text-right text-red-600">{it.descuento > 0 ? `-${formatearPrecio(it.descuento)}` : '-'}</span>
              <span className="sm:col-span-3 text-right font-medium text-ink">{formatearPrecio(it.total)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Totales */}
      <div className="mb-6 flex flex-col items-end">
        <div className="w-full max-w-xs space-y-1.5 text-sm">
          <div className="flex justify-between text-ink-soft">
            <span>Subtotal</span><span>{formatearPrecio(subtotal)}</span>
          </div>
          {descuentoItems > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Descuento</span><span>-{formatearPrecio(descuentoItems)}</span>
            </div>
          )}
          <div className="flex justify-between text-ink-soft">
            <span>IVA 19%</span><span>{formatearPrecio(iva)}</span>
          </div>
          <div className="flex justify-between border-t border-paper-deep pt-2 font-bold text-base text-ink">
            <span>Total</span><span>{formatearPrecio(c.total)}</span>
          </div>
        </div>
      </div>

      {/* Notas */}
      {c.notas && (
        <div className="rounded-xl border border-paper-deep bg-white p-5 mb-6">
          <p className="text-xs text-ink-soft uppercase tracking-wide font-medium mb-2">Notas / Condiciones</p>
          <p className="text-sm whitespace-pre-wrap text-ink-soft">{c.notas}</p>
        </div>
      )}

      <Link href="/cotizaciones" className="text-sm text-ink-soft hover:text-ink transition-colors">&larr; Volver a cotizaciones</Link>
    </div>
  )
}
