'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { crearCotizacion } from '@/lib/actions/cotizaciones'

const formatearPrecio = (n) =>
  '$ ' + Number(n).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

let itemIdCounter = 0
const nuevoItem = () => ({
  id: ++itemIdCounter,
  producto_id: null,
  descripcion: '',
  cantidad: 1,
  precio_unitario: 0,
  descuentoTipo: '$',
  descuentoInput: '',
  descuento: 0,
})

function BuscadorProducto({ item, productos, onUpdate }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(item.descripcion || '')
  const ref = useRef(null)

  const filtered = query
    ? productos.filter((p) => p.nombre.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : productos.slice(0, 6)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = (p) => {
    onUpdate(item.id, 'producto_id', p.id)
    onUpdate(item.id, 'descripcion', p.nombre)
    onUpdate(item.id, 'precio_unitario', p.precio_unitario)
    setQuery(p.nombre)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          onUpdate(item.id, 'descripcion', e.target.value)
          onUpdate(item.id, 'producto_id', null)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder="Producto o descripción..."
        className="w-full rounded-lg border border-paper-deep bg-paper px-2.5 py-1.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
      {open && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-auto rounded-lg border border-paper-deep bg-white shadow-lg">
          {filtered.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => select(p)}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-brand-light transition-colors"
            >
              <span className="font-medium text-ink truncate">{p.nombre}</span>
              <span className="shrink-0 text-xs text-ink-soft ml-2">
                {formatearPrecio(p.precio_unitario)} / {p.unidad}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ItemRow({ item, productos, onUpdate, onRemove }) {
  const totalItem = item.cantidad * item.precio_unitario - item.descuento

  const handleDiscountInput = (value) => {
    const num = Number(value) || 0
    if (item.descuentoTipo === '%') {
      const base = item.cantidad * item.precio_unitario
      const desc = base * (num / 100)
      onUpdate(item.id, 'descuentoInput', value)
      onUpdate(item.id, 'descuento', Math.round(desc * 100) / 100)
    } else {
      onUpdate(item.id, 'descuentoInput', value)
      onUpdate(item.id, 'descuento', num)
    }
  }

  const toggleDiscountType = () => {
    const nuevo = item.descuentoTipo === '%' ? '$' : '%'
    onUpdate(item.id, 'descuentoTipo', nuevo)
    onUpdate(item.id, 'descuentoInput', '')
    onUpdate(item.id, 'descuento', 0)
  }

  return (
    <div className="rounded-xl border border-paper-deep bg-white p-3 sm:p-4">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-12 sm:gap-3">
        <div className="sm:col-span-5">
          <label className="mb-1 block text-xs text-ink-soft sm:hidden">Producto</label>
          <BuscadorProducto item={item} productos={productos} onUpdate={onUpdate} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-ink-soft sm:hidden">Cantidad</label>
          <input
            type="number" step="0.01" min="0.01"
            value={item.cantidad}
            onChange={(e) => {
              const val = Math.max(0.01, Number(e.target.value) || 0.01)
              onUpdate(item.id, 'cantidad', val)
              if (item.descuentoTipo === '%') handleDiscountInput(item.descuentoInput)
            }}
            className="w-full rounded-lg border border-paper-deep bg-paper px-2.5 py-1.5 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-ink-soft sm:hidden">Precio unitario</label>
          <input
            type="number" step="1" min="0"
            value={item.precio_unitario}
            onChange={(e) => {
              const val = Math.max(0, Number(e.target.value) || 0)
              onUpdate(item.id, 'precio_unitario', val)
              if (item.descuentoTipo === '%') handleDiscountInput(item.descuentoInput)
            }}
            className="w-full rounded-lg border border-paper-deep bg-paper px-2.5 py-1.5 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-ink-soft sm:hidden">Descuento</label>
          <div className="flex">
            <input
              type="number" step="1" min="0"
              value={item.descuentoInput}
              onChange={(e) => handleDiscountInput(e.target.value)}
              placeholder={item.descuentoTipo === '%' ? '%' : '$'}
              className="flex-1 rounded-l-lg border border-paper-deep bg-paper px-2.5 py-1.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <button
              type="button"
              onClick={toggleDiscountType}
              className="rounded-r-lg border border-l-0 border-paper-deep bg-paper-deep px-2 text-xs font-medium text-ink-soft hover:bg-paper-deep/70 transition-colors"
            >
              {item.descuentoTipo}
            </button>
          </div>
        </div>
        <div className="hidden sm:flex sm:col-span-1 items-center justify-end gap-1">
          <span className="text-sm font-medium text-ink">{formatearPrecio(totalItem)}</span>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="ml-1 flex h-6 w-6 items-center justify-center rounded text-ink-soft hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="flex items-center justify-between sm:hidden pt-1">
          <span className="text-sm font-medium text-ink">Total: {formatearPrecio(totalItem)}</span>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-sm text-red-600 hover:underline"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function NuevaCotizacionPage() {
  const router = useRouter()
  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [clienteId, setClienteId] = useState('')
  const [items, setItems] = useState([])
  const [notas, setNotas] = useState('')
  const [fechaValidez, setFechaValidez] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    const supabase = createClient()
    const [cliRes, prodRes] = await Promise.all([
      supabase.from('clientes').select('id, nombre, rut').order('nombre'),
      supabase.from('productos').select('id, nombre, precio_unitario, unidad').order('nombre'),
    ])
    setClientes(cliRes.data ?? [])
    setProductos(prodRes.data ?? [])
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const updateItem = (id, field, value) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)))
  }

  const addItem = () => setItems((prev) => [...prev, nuevoItem()])

  const removeItem = (id) => setItems((prev) => prev.filter((it) => it.id !== id))

  const subtotal = items.reduce((s, i) => s + i.cantidad * i.precio_unitario, 0)
  const descuentoTotal = items.reduce((s, i) => s + i.descuento, 0)
  const neto = subtotal - descuentoTotal
  const iva = neto * 0.19
  const total = neto + iva

  const handleSave = async () => {
    if (!clienteId) { setError('Selecciona un cliente'); return }
    if (items.length === 0) { setError('Agrega al menos un item'); return }

    const emptyDesc = items.some((i) => !i.descripcion.trim())
    if (emptyDesc) { setError('Completa la descripción de todos los items'); return }

    setSaving(true)
    setError('')

    const res = await crearCotizacion({
      cliente_id: clienteId,
      items: items.map((i) => ({
        producto_id: i.producto_id,
        descripcion: i.descripcion,
        cantidad: i.cantidad,
        precio_unitario: i.precio_unitario,
        descuento: i.descuento,
      })),
      notas,
      fecha_validez: fechaValidez || null,
    })

    if (res.error) {
      setError(res.error)
      setSaving(false)
    } else if (res.id) {
      router.push(`/cotizaciones/${res.id}`)
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/cotizaciones" className="text-sm text-ink-soft hover:text-ink transition-colors">&larr; Cotizaciones</Link>
            <h1 className="text-2xl font-bold text-ink mt-1">Nueva cotización</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover disabled:opacity-50 transition-colors"
          >
            {saving ? 'Guardando...' : 'Guardar borrador'}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-accent-light p-3 text-sm text-accent">{error}</div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Client selector */}
            <div className="rounded-xl border border-paper-deep bg-white p-4">
              <label className="mb-1.5 block text-sm font-medium text-ink">Cliente</label>
              {clientes.length === 0 ? (
                <div className="rounded-lg bg-paper p-3 text-sm text-ink-soft">
                  Aún no tienes clientes.{' '}
                  <Link href="/clientes" className="text-brand hover:underline">Crear cliente</Link>
                </div>
              ) : (
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                >
                  <option value="">Seleccionar cliente...</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}{c.rut ? ` (${c.rut})` : ''}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Items */}
            <div className="rounded-xl border border-paper-deep bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-medium text-ink">Items</h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="rounded-lg bg-brand-light px-3 py-1.5 text-xs font-medium text-brand hover:bg-brand-light/70 transition-colors"
                >
                  + Agregar item
                </button>
              </div>

              {items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-paper-deep p-8 text-center text-sm text-ink-soft/60">
                  <div className="mb-2 flex justify-center">
                    <svg className="h-8 w-8 text-ink-soft/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  Agrega productos desde tu catálogo o escribe una descripción libre.
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Desktop column headers */}
                  <div className="hidden sm:grid sm:grid-cols-12 sm:gap-3 px-1 text-xs text-ink-soft">
                    <span className="col-span-5">Producto</span>
                    <span className="col-span-2">Cantidad</span>
                    <span className="col-span-2">P. Unitario</span>
                    <span className="col-span-2">Descuento</span>
                    <span className="col-span-1 text-right">Total</span>
                  </div>
                  {items.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      productos={productos}
                      onUpdate={updateItem}
                      onRemove={removeItem}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={addItem}
                    className="mt-1 w-full rounded-lg border border-dashed border-paper-deep py-2.5 text-sm text-ink-soft hover:bg-paper-deep transition-colors"
                  >
                    + Agregar otro item
                  </button>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="rounded-xl border border-paper-deep bg-white p-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Notas / Condiciones</label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  rows={3}
                  placeholder="Plazos de entrega, forma de pago, garantía..."
                  className="w-full rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Fecha de validez</label>
                <input
                  type="date"
                  value={fechaValidez}
                  onChange={(e) => setFechaValidez(e.target.value)}
                  className="w-full rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
                <p className="mt-1 text-xs text-ink-soft">Opcional. Si se define, la cotización se marcará como vencida al pasar esta fecha.</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-xl border border-paper-deep bg-white p-5">
                <h2 className="text-sm font-medium text-ink mb-4">Resumen</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-ink-soft">
                    <span>Subtotal</span>
                    <span>{formatearPrecio(subtotal)}</span>
                  </div>
                  {descuentoTotal > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Descuento</span>
                      <span>-{formatearPrecio(descuentoTotal)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-ink-soft">
                    <span>IVA 19%</span>
                    <span>{formatearPrecio(iva)}</span>
                  </div>
                  <div className="flex justify-between border-t border-paper-deep pt-2 text-base font-bold text-ink">
                    <span>Total</span>
                    <span>{formatearPrecio(total)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-paper-deep bg-white p-4">
                <h2 className="text-sm font-medium text-ink mb-2">¿Listo?</h2>
                <p className="text-xs text-ink-soft mb-4">
                  La cotización se guardará como borrador. Podrás descargar el PDF, compartirla y cambiar el estado después.
                </p>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Guardando...' : 'Guardar borrador'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
