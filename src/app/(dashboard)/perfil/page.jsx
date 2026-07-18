'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { updateEmpresa, uploadLogo } from '@/lib/actions/empresa'
import { actualizarPassword } from '@/lib/actions/auth'
import { useToast } from '@/components/dashboard/Toast'
import FortalezaContrasena from '@/components/dashboard/FortalezaContrasena'
import * as XLSX from 'xlsx'

export default function PerfilPage() {
  const toast = useToast()
  const [empresa, setEmpresa] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)
  const [error, setError] = useState('')
  const [logoPreview, setLogoPreview] = useState(null)
  const [confirmExport, setConfirmExport] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const fileInputRef = useRef(null)

  const fetchEmpresa = useCallback(async () => {
    const supabase = createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('empresa_id')
      .single()

    if (profile) {
      const { data: emp } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', profile.empresa_id)
        .single()
      setEmpresa(emp)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchEmpresa() }, [fetchEmpresa])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const form = e.currentTarget
    const formData = new FormData(form)
    const res = await updateEmpresa(undefined, formData)

    if (res.error) {
      setError(res.error)
      setSaving(false)
    } else {
      setEditing(false)
      setSaving(false)
      toast('Datos de la empresa actualizados', 'success')
      fetchEmpresa()
    }
  }

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      toast('La imagen no puede superar 2 MB', 'error')
      return
    }

    setLogoPreview(URL.createObjectURL(file))
    setLogoUploading(true)
    setError('')

    const formData = new FormData()
    formData.set('logo', file)
    const res = await uploadLogo(formData)

    if (res.error) {
      setError(res.error)
      toast(res.error, 'error')
      setLogoPreview(null)
    } else {
      toast('Logo actualizado', 'success')
      setLogoPreview(null)
      fetchEmpresa()
    }
    setLogoUploading(false)
  }

  const handleExport = async () => {
    setExporting(true)
    const supabase = createClient()

    const { data: profile } = await supabase
      .from('profiles')
      .select('empresa_id')
      .single()

    if (!profile?.empresa_id) {
      toast('Error al obtener datos de la empresa', 'error')
      setExporting(false)
      return
    }

    const empresaId = profile.empresa_id

    const [clientesRes, productosRes, cotizacionesRes] = await Promise.all([
      supabase.from('clientes').select('nombre, rut, email, telefono, direccion, notas').eq('empresa_id', empresaId).order('nombre'),
      supabase.from('productos').select('nombre, descripcion, precio_unitario, unidad').eq('empresa_id', empresaId).order('nombre'),
      supabase.from('cotizaciones')
        .select('numero, created_at, estado, total, notas, clientes!inner(nombre), cotizacion_items!inner(descripcion, cantidad, precio_unitario, descuento, total)')
        .eq('empresa_id', empresaId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false }),
    ])

    const wb = XLSX.utils.book_new()

    const clientesData = (clientesRes.data ?? []).map((c) => ({
      Nombre: c.nombre,
      RUT: c.rut || '',
      Email: c.email || '',
      Teléfono: c.telefono || '',
      Dirección: c.direccion || '',
      Notas: c.notas || '',
    }))
    const wsClientes = XLSX.utils.json_to_sheet(clientesData)
    wsClientes['!cols'] = [{ wch: 28 }, { wch: 16 }, { wch: 28 }, { wch: 18 }, { wch: 28 }, { wch: 24 }]
    XLSX.utils.book_append_sheet(wb, wsClientes, 'Clientes')

    const productosData = (productosRes.data ?? []).map((p) => ({
      Nombre: p.nombre,
      Descripción: p.descripcion || '',
      'Precio unitario': Number(p.precio_unitario),
      Unidad: p.unidad,
    }))
    const wsProductos = XLSX.utils.json_to_sheet(productosData)
    wsProductos['!cols'] = [{ wch: 32 }, { wch: 36 }, { wch: 16 }, { wch: 12 }]
    XLSX.utils.book_append_sheet(wb, wsProductos, 'Catálogo')

    const cotizacionesData = []
    for (const c of cotizacionesRes.data ?? []) {
      for (const item of c.cotizacion_items ?? []) {
        cotizacionesData.push({
          'N° Cotización': `COT-${String(c.numero).padStart(4, '0')}`,
          Fecha: new Date(c.created_at).toLocaleDateString('es-CL'),
          Estado: c.estado.charAt(0).toUpperCase() + c.estado.slice(1),
          Cliente: c.clientes?.nombre || '',
          Total: Number(c.total),
          Item: item.descripcion,
          Cantidad: Number(item.cantidad),
          'Precio unitario': Number(item.precio_unitario),
          Descuento: Number(item.descuento),
          'Total item': Number(item.total),
          Notas: c.notas || '',
        })
      }
    }
    const wsCotizaciones = XLSX.utils.json_to_sheet(cotizacionesData)
    wsCotizaciones['!cols'] = [{ wch: 16 }, { wch: 14 }, { wch: 12 }, { wch: 24 }, { wch: 14 }, { wch: 36 }, { wch: 10 }, { wch: 16 }, { wch: 12 }, { wch: 14 }, { wch: 24 }]
    XLSX.utils.book_append_sheet(wb, wsCotizaciones, 'Cotizaciones')

    const empresaNombre = empresa?.nombre?.replace(/[^a-zA-Z0-9]/g, '_') || 'mi_empresa'
    XLSX.writeFile(wb, `rapicot_respaldo_${empresaNombre}_${new Date().toISOString().slice(0, 10)}.xlsx`)

    setConfirmExport(false)
    setExporting(false)
    toast('Datos exportados correctamente', 'success')
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        <div className="mb-6 h-8 w-48 rounded bg-paper-deep animate-pulse" />
        <div className="h-48 rounded-xl bg-paper-deep animate-pulse" />
      </div>
    )
  }

  if (!empresa) return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto text-center py-20">
      <p className="text-ink-soft/60">No se encontraron datos de la empresa.</p>
    </div>
  )

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Mi Empresa</h1>
          <p className="text-sm text-ink-soft">Configuración de tu negocio</p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-hover transition-colors">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-accent-light p-3 text-sm text-accent">{error}</div>
      )}

      {editing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="rounded-xl border border-paper-deep bg-white p-6 space-y-5">
            {/* Logo */}
            <div className="flex items-center gap-4 pb-5 border-b border-paper-deep">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-brand text-white text-xl font-bold overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : empresa.logo_url ? (
                    <img src={empresa.logo_url} alt="Logo" className="h-full w-full object-cover" />
                  ) : (
                    empresa.nombre?.charAt(0)?.toUpperCase() || 'E'
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white text-xs shadow-sm hover:bg-accent-hover transition-colors"
                >
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 16l4-4 4 4-4 4zM12 4h4v4" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">Logo de la empresa</p>
                <p className="text-xs text-ink-soft">PNG, JPG o WebP. Máximo 2 MB. Se mostrará en las cotizaciones.</p>
                {logoUploading && <p className="text-xs text-brand mt-1">Subiendo...</p>}
              </div>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-ink mb-1">Nombre de la empresa *</label>
                <input name="nombre" type="text" required defaultValue={empresa.nombre}
                  className="w-full rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">RUT</label>
                <input name="rut" type="text" defaultValue={empresa.rut || ''} placeholder="12.345.678-9"
                  className="w-full rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Email</label>
                <input name="email" type="email" defaultValue={empresa.email || ''}
                  className="w-full rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Teléfono</label>
                <input name="telefono" type="tel" defaultValue={empresa.telefono || ''}
                  className="w-full rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Dirección</label>
                <input name="direccion" type="text" defaultValue={empresa.direccion || ''}
                  className="w-full rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Moneda</label>
                <select name="moneda" defaultValue={empresa.moneda || 'CLP'}
                  className="w-full rounded-xl border border-paper-deep bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20">
                  <option value="CLP">CLP (Peso chileno)</option>
                  <option value="UF">UF</option>
                  <option value="USD">USD (Dólar)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setEditing(false)}
              className="rounded-xl border border-paper-deep px-5 py-2.5 text-sm text-ink-soft hover:bg-paper-deep transition-colors">Cancelar</button>
            <button type="submit" disabled={saving}
              className="rounded-xl bg-brand px-5 py-2.5 text-sm text-white hover:bg-brand-hover disabled:opacity-50 transition-colors">
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-xl border border-paper-deep bg-white p-6 space-y-5">
          <div className="flex items-center gap-4 pb-5 border-b border-paper-deep">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-brand text-white text-xl font-bold overflow-hidden">
              {empresa.logo_url ? (
                <img src={empresa.logo_url} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                empresa.nombre?.charAt(0)?.toUpperCase() || 'E'
              )}
            </div>
            <div>
              <p className="text-lg font-medium text-ink">{empresa.nombre}</p>
              {empresa.rut && <p className="text-sm text-ink-soft">{empresa.rut}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
            {empresa.email && (
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-ink-soft shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-ink">{empresa.email}</span>
              </div>
            )}
            {empresa.telefono && (
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-ink-soft shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-ink">{empresa.telefono}</span>
              </div>
            )}
            {empresa.direccion && (
              <div className="sm:col-span-2 flex items-center gap-2">
                <svg className="h-4 w-4 text-ink-soft shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-ink">{empresa.direccion}</span>
              </div>
            )}
          </div>

            {empresa.moneda && (
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-ink-soft shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 5-5m4 0l5 5-5 5" />
                </svg>
                <span className="text-ink">{empresa.moneda}</span>
              </div>
            )}
            {!empresa.email && !empresa.telefono && !empresa.direccion && !empresa.moneda && (
              <div className="rounded-lg bg-paper p-4 text-sm text-ink-soft/60">
                <p>Completa los datos de tu empresa desde el botón Editar para que aparezcan en tus cotizaciones.</p>
              </div>
            )}
        </div>
      )}

      {/* Change password */}
      <div className="mt-8 rounded-xl border border-paper-deep bg-white p-6">
        <h2 className="text-lg font-semibold text-ink mb-4">Cambiar contraseña</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            const form = e.currentTarget
            const formData = new FormData(form)
            const res = await actualizarPassword(undefined, formData)
            if (res?.success) {
              toast('Contraseña actualizada', 'success')
              form.reset()
              setNewPassword('')
            } else {
              toast(res?.error || 'Error al actualizar', 'error')
            }
          }}
        >
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="Nueva contraseña"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-paper-deep bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-hover transition-colors"
            >
              Actualizar
            </button>
          </div>
          <FortalezaContrasena password={newPassword} />
        </form>
      </div>

      {/* Export data */}
      <div className="mt-8 rounded-xl border border-paper-deep bg-white p-6">
        <h2 className="text-lg font-semibold text-ink mb-4">Respaldo de datos</h2>
        <p className="text-sm text-ink-soft mb-4">
          Descarga un archivo Excel con todos los datos de tu empresa para tener una copia de seguridad o abrirlo en tu programa de hoja de cálculo favorito.
        </p>

        {confirmExport ? (
          <div className="rounded-xl border border-brand-light bg-brand-light/20 p-4">
            <p className="text-sm font-medium text-ink mb-3">El archivo incluirá:</p>
            <ul className="space-y-1.5 text-sm text-ink-soft">
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-brand" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 10l3 3 6-6" /></svg>
                <strong className="text-ink">Clientes</strong> — todos tus clientes registrados
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-brand" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 10l3 3 6-6" /></svg>
                <strong className="text-ink">Catálogo</strong> — todos tus productos y servicios
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-brand" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 10l3 3 6-6" /></svg>
                <strong className="text-ink">Cotizaciones</strong> — cada cotización con su detalle de ítems, una fila por ítem
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <button onClick={() => setConfirmExport(false)}
                className="rounded-xl border border-paper-deep px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-deep transition-colors">
                Cancelar
              </button>
              <button onClick={handleExport} disabled={exporting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-50 transition-colors">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {exporting ? 'Generando...' : 'Confirmar y descargar'}
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setConfirmExport(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-paper-deep px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-deep transition-colors">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar mis datos
          </button>
        )}
      </div>
    </div>
  )
}
