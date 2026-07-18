'use client'

import { useEffect, useState, useCallback } from 'react'
import { useActionState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createProducto, updateProducto } from '@/lib/actions/productos'
import { useToast } from '@/components/dashboard/Toast'
import { TableSkeleton } from '@/components/dashboard/Skeleton'
import ImportadorMasivo from '@/components/dashboard/ImportadorMasivo'

const UNIDADES_SUGERIDAS = ['unidad', 'hora', 'm2', 'metro', 'kg', 'litro', 'día', 'mes', 'caja', 'paquete']

const precioFormateado = (n) =>
  '$ ' + Number(n).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

function FormularioProducto({ producto, onClose, toast }) {
  const action = producto ? updateProducto : createProducto
  const [state, formAction, pending] = useActionState(action, undefined)

  useEffect(() => {
    if (state?.success) {
      toast(producto ? 'Producto actualizado' : 'Producto creado', 'success')
      onClose()
    }
  }, [state, onClose, toast, producto])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 pt-6 sm:pt-10 px-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl mt-10 sm:mt-0" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">{producto ? 'Editar producto' : 'Nuevo producto'}</h2>
          <button onClick={onClose} className="text-ink-soft hover:text-ink text-xl leading-none">&times;</button>
        </div>

        {state?.error && (
          <p className="mb-4 rounded-lg bg-accent-light p-3 text-sm text-accent">{state.error}</p>
        )}

        <form action={formAction} className="space-y-3">
          {producto && <input type="hidden" name="id" value={producto.id} />}

          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-ink mb-1">Nombre *</label>
            <input id="nombre" name="nombre" type="text" required
              defaultValue={producto?.nombre ?? ''}
              className="w-full rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20" />
            {state?.errors?.nombre && <p className="mt-1 text-xs text-red-500">{state.errors.nombre}</p>}
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-ink mb-1">Descripción</label>
            <textarea id="descripcion" name="descripcion" rows={2}
              defaultValue={producto?.descripcion ?? ''}
              className="w-full rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="precio_unitario" className="block text-sm font-medium text-ink mb-1">Precio unitario *</label>
              <input id="precio_unitario" name="precio_unitario" type="number" step="0.01" min="0" required
                defaultValue={producto?.precio_unitario ?? ''}
                className="w-full rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20" />
              {state?.errors?.precio_unitario && <p className="mt-1 text-xs text-red-500">{state.errors.precio_unitario}</p>}
            </div>
            <div>
              <label htmlFor="unidad" className="block text-sm font-medium text-ink mb-1">Unidad de medida *</label>
              <input id="unidad" name="unidad" type="text" list="unidades-sugeridas" required
                defaultValue={producto?.unidad ?? 'unidad'}
                className="w-full rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20" />
              <datalist id="unidades-sugeridas">
                {UNIDADES_SUGERIDAS.map((u) => <option key={u} value={u} />)}
              </datalist>
              {state?.errors?.unidad && <p className="mt-1 text-xs text-red-500">{state.errors.unidad}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="rounded-xl border border-paper-deep px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-deep transition-colors">Cancelar</button>
            <button type="submit" disabled={pending}
              className="rounded-xl bg-brand px-4 py-2.5 text-sm text-white hover:bg-brand-hover disabled:opacity-50 transition-colors">
              {pending ? 'Guardando...' : producto ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteConfirm({ producto, onConfirm, onCancel }) {
  const [confirmText, setConfirmText] = useState('')
  const canDelete = confirmText === 'ELIMINAR'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4" onClick={onCancel}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-ink mt-3 mb-1">Eliminar producto</h2>
        <p className="text-sm text-ink-soft mb-4">
          Esta acción no se puede deshacer. Se eliminará permanentemente <strong>{producto.nombre}</strong> del catálogo.
        </p>
        <div className="mb-4">
          <label className="block text-xs text-ink-soft mb-1">Escribe <strong>ELIMINAR</strong> para confirmar</label>
          <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)}
            className="w-full rounded-xl border border-red-200 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors" />
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel}
            className="rounded-xl border border-paper-deep px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-deep transition-colors">Cancelar</button>
          <button onClick={() => onConfirm(producto)} disabled={!canDelete}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm text-white hover:bg-red-700 disabled:opacity-50 transition-colors">Eliminar</button>
        </div>
      </div>
    </div>
  )
}

export default function CatalogoPage() {
  const toast = useToast()
  const [productos, setProductos] = useState([])
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchProductos = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('productos')
      .select('id, nombre, descripcion, precio_unitario, unidad')
      .order('nombre', { ascending: true })
    setProductos(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchProductos() }, [fetchProductos])

  const filtered = search
    ? productos.filter((p) => p.nombre.toLowerCase().includes(search.toLowerCase()))
    : productos

  const handleDelete = async (producto) => {
    const supabase = createClient()
    const { error } = await supabase.from('productos').delete().eq('id', producto.id)
    if (error) {
      toast(error.message, 'error')
    } else {
      toast('Producto eliminado', 'success')
    }
    setDeleting(null)
    fetchProductos()
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Catálogo</h1>
          <p className="text-sm text-ink-soft">{productos.length} producto{productos.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowImport(true)}
            className="rounded-xl border border-paper-deep px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-deep transition-colors">
            Importar desde Excel/CSV
          </button>
          <button onClick={() => { setEditing(null); setShowForm(true) }}
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors">
            + Nuevo producto
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input type="search" placeholder="Buscar producto por nombre..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-paper-deep bg-paper pl-10 pr-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20" />
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={4} />
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-paper-deep p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-light">
            <svg className="h-7 w-7 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          {search ? (
            <>
              <p className="text-sm text-ink-soft/60 mb-1">No encontramos productos con ese nombre.</p>
              <p className="text-xs text-ink-soft/40">Prueba con otro término o revisa tu catálogo.</p>
            </>
          ) : (
            <>
              <p className="text-sm text-ink-soft/60 mb-1">Todavía no tienes productos en tu catálogo.</p>
              <p className="text-xs text-ink-soft/40 mb-4">Agrega tus productos o servicios y selecciónalos al crear una cotización en segundos.</p>
              <button onClick={() => { setEditing(null); setShowForm(true) }}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors">
                + Agregar primer producto
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-1.5">
          {filtered.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl border border-paper-deep bg-white p-4 hover:bg-paper-deep transition-colors group">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-light text-xs font-bold text-brand">
                    {p.nombre.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-medium text-ink truncate">{p.nombre}</p>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft pl-10">
                  <span className="font-medium text-ink">{precioFormateado(p.precio_unitario)}</span>
                  <span className="text-ink-soft/60">/ {p.unidad}</span>
                  {p.descripcion && <span className="truncate max-w-xs">{p.descripcion}</span>}
                </div>
              </div>
              <div className="flex gap-1 ml-3 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditing(p); setShowForm(true) }}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand hover:bg-brand-light transition-colors">Editar</button>
                <button onClick={() => setDeleting(p)}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <FormularioProducto
          producto={editing}
          toast={toast}
          onClose={() => { setShowForm(false); setEditing(null); fetchProductos() }}
        />
      )}

      {deleting && (
        <DeleteConfirm
          producto={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}

      {showImport && (
        <ImportadorMasivo
          tipo="catalogo"
          onClose={() => setShowImport(false)}
          onComplete={() => fetchProductos()}
        />
      )}
    </div>
  )
}
