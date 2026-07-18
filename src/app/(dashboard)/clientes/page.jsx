'use client'

import { useEffect, useState, useCallback } from 'react'
import { useActionState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createCliente, updateCliente } from '@/lib/actions/clientes'
import { useToast } from '@/components/dashboard/Toast'
import { TableSkeleton } from '@/components/dashboard/Skeleton'
import ImportadorMasivo from '@/components/dashboard/ImportadorMasivo'

function FormularioCliente({ cliente, onClose, toast }) {
  const action = cliente ? updateCliente : createCliente
  const [state, formAction, pending] = useActionState(action, undefined)

  useEffect(() => {
    if (state?.success) {
      toast(cliente ? 'Cliente actualizado' : 'Cliente creado', 'success')
      onClose()
    }
  }, [state, onClose, toast, cliente])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 pt-6 sm:pt-10 px-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl mt-10 sm:mt-0" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">{cliente ? 'Editar cliente' : 'Nuevo cliente'}</h2>
          <button onClick={onClose} className="text-ink-soft hover:text-ink text-xl leading-none">&times;</button>
        </div>

        {state?.error && (
          <p className="mb-4 rounded-lg bg-accent-light p-3 text-sm text-accent">{state.error}</p>
        )}

        <form action={formAction} className="space-y-3">
          {cliente && <input type="hidden" name="id" value={cliente.id} />}

          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-ink mb-1">Nombre *</label>
            <input id="nombre" name="nombre" type="text" required
              defaultValue={cliente?.nombre ?? ''}
              className="w-full rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20" />
            {state?.errors?.nombre && <p className="mt-1 text-xs text-red-500">{state.errors.nombre}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="rut" className="block text-sm font-medium text-ink mb-1">RUT</label>
              <input id="rut" name="rut" type="text" placeholder="12.345.678-9"
                defaultValue={cliente?.rut ?? ''}
                className="w-full rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">Email</label>
              <input id="email" name="email" type="email"
                defaultValue={cliente?.email ?? ''}
                className="w-full rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20" />
              {state?.errors?.email && <p className="mt-1 text-xs text-red-500">{state.errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-ink mb-1">Teléfono</label>
              <input id="telefono" name="telefono" type="tel"
                defaultValue={cliente?.telefono ?? ''}
                className="w-full rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20" />
            </div>
            <div>
              <label htmlFor="direccion" className="block text-sm font-medium text-ink mb-1">Dirección</label>
              <input id="direccion" name="direccion" type="text"
                defaultValue={cliente?.direccion ?? ''}
                className="w-full rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20" />
            </div>
          </div>

          <div>
            <label htmlFor="notas" className="block text-sm font-medium text-ink mb-1">Notas</label>
            <textarea id="notas" name="notas" rows={2}
              defaultValue={cliente?.notas ?? ''}
              className="w-full rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="rounded-xl border border-paper-deep px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-deep transition-colors">Cancelar</button>
            <button type="submit" disabled={pending}
              className="rounded-xl bg-brand px-4 py-2.5 text-sm text-white hover:bg-brand-hover disabled:opacity-50 transition-colors">
              {pending ? 'Guardando...' : cliente ? 'Guardar cambios' : 'Crear cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteConfirm({ cliente, onConfirm, onCancel }) {
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
        <h2 className="text-lg font-semibold text-ink mt-3 mb-1">Eliminar cliente</h2>
        <p className="text-sm text-ink-soft mb-4">
          Esta acción no se puede deshacer. Se eliminará permanentemente a <strong>{cliente.nombre}</strong> y no podrá ser recuperado.
        </p>
        <div className="mb-4">
          <label className="block text-xs text-ink-soft mb-1">Escribe <strong>ELIMINAR</strong> para confirmar</label>
          <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)}
            className="w-full rounded-xl border border-red-200 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors" />
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel}
            className="rounded-xl border border-paper-deep px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-deep transition-colors">Cancelar</button>
          <button onClick={() => onConfirm(cliente)} disabled={!canDelete}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm text-white hover:bg-red-700 disabled:opacity-50 transition-colors">Eliminar</button>
        </div>
      </div>
    </div>
  )
}

export default function ClientesPage() {
  const toast = useToast()
  const [clientes, setClientes] = useState([])
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchClientes = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('clientes')
      .select('id, nombre, rut, email, telefono, direccion, notas')
      .order('nombre', { ascending: true })
    setClientes(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchClientes() }, [fetchClientes])

  const filtered = search
    ? clientes.filter((c) => c.nombre.toLowerCase().includes(search.toLowerCase()))
    : clientes

  const handleDelete = async (cliente) => {
    const supabase = createClient()
    const { error } = await supabase.from('clientes').delete().eq('id', cliente.id)
    if (error) {
      toast(error.message, 'error')
    } else {
      toast('Cliente eliminado', 'success')
    }
    setDeleting(null)
    fetchClientes()
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Clientes</h1>
          <p className="text-sm text-ink-soft">{clientes.length} cliente{clientes.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowImport(true)}
            className="rounded-xl border border-paper-deep px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-deep transition-colors">
            Importar desde Excel/CSV
          </button>
          <button onClick={() => { setEditing(null); setShowForm(true) }}
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors">
            + Nuevo cliente
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input type="search" placeholder="Buscar cliente por nombre..."
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
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          {search ? (
            <>
              <p className="text-sm text-ink-soft/60 mb-1">No encontramos clientes con ese nombre.</p>
              <p className="text-xs text-ink-soft/40">Revisa el término de búsqueda o intenta con otro.</p>
            </>
          ) : (
            <>
              <p className="text-sm text-ink-soft/60 mb-1">Todavía no tienes clientes registrados.</p>
              <p className="text-xs text-ink-soft/40 mb-4">Guarda los datos de tus clientes y olvídate de escribirlos a mano en cada cotización.</p>
              <button onClick={() => { setEditing(null); setShowForm(true) }}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors">
                + Agregar primer cliente
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-1.5">
          {filtered.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-xl border border-paper-deep bg-white p-4 hover:bg-paper-deep transition-colors group">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-light text-xs font-bold text-brand">
                    {c.nombre.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-medium text-ink truncate">{c.nombre}</p>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft pl-10">
                  {c.email && <span className="truncate max-w-[200px]">{c.email}</span>}
                  {c.telefono && <span>{c.telefono}</span>}
                  {c.rut && <span className="text-ink-soft/60">{c.rut}</span>}
                </div>
              </div>
              <div className="flex gap-1 ml-3 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditing(c); setShowForm(true) }}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand hover:bg-brand-light transition-colors">Editar</button>
                <button onClick={() => setDeleting(c)}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <FormularioCliente
          cliente={editing}
          toast={toast}
          onClose={() => { setShowForm(false); setEditing(null); fetchClientes() }}
        />
      )}

      {deleting && (
        <DeleteConfirm
          cliente={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}

      {showImport && (
        <ImportadorMasivo
          tipo="clientes"
          onClose={() => setShowImport(false)}
          onComplete={() => fetchClientes()}
        />
      )}
    </div>
  )
}
