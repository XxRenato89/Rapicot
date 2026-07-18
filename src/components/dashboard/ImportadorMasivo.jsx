'use client'

import { useState, useRef, useCallback } from 'react'
import * as XLSX from 'xlsx'
import { useToast } from '@/components/dashboard/Toast'

const CONFIG = {
  clientes: {
    titulo: 'Importar clientes',
    icono: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    campos: [
      { key: 'nombre', label: 'Nombre', required: true, type: 'text' },
      { key: 'rut', label: 'RUT', required: false, type: 'text' },
      { key: 'email', label: 'Email', required: false, type: 'email' },
      { key: 'telefono', label: 'Teléfono', required: false, type: 'text' },
      { key: 'direccion', label: 'Dirección', required: false, type: 'text' },
      { key: 'notas', label: 'Notas', required: false, type: 'text' },
    ],
    importAction: 'importarClientes',
    etiqueta: 'cliente',
    etiquetas: 'clientes',
  },
  catalogo: {
    titulo: 'Importar productos',
    icono: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    campos: [
      { key: 'nombre', label: 'Nombre', required: true, type: 'text' },
      { key: 'precio_unitario', label: 'Precio unitario', required: true, type: 'number' },
      { key: 'unidad', label: 'Unidad', required: false, type: 'text', default: 'unidad' },
      { key: 'descripcion', label: 'Descripción', required: false, type: 'text' },
    ],
    importAction: 'importarProductos',
    etiqueta: 'producto',
    etiquetas: 'productos',
  },
}

const ALIASES = {
  nombre: ['nombre', 'name', 'cliente', 'producto', 'servicio', 'item', 'descripcion del item', 'nombre del cliente', 'nombre del producto', 'nombre cliente', 'nombre producto', 'articulo', 'artículo'],
  rut: ['rut', 'r.u.t.', 'run', 'id tributario', 'identificacion', 'identificación'],
  email: ['email', 'e-mail', 'correo', 'correo electrónico', 'mail', 'e mail', 'e_mail'],
  telefono: ['telefono', 'teléfono', 'tel', 'whatsapp', 'celular', 'móvil', 'movil', 'phone', 'contacto', 'telefono contacto', 'cel'],
  direccion: ['direccion', 'dirección', 'address', 'domicilio', 'dire'],
  notas: ['notas', 'nota', 'comentarios', 'comentario', 'observaciones', 'notes', 'note'],
  precio_unitario: ['precio', 'precio_unitario', 'precio unitario', 'precio por unidad', 'precio por und', '$', 'valor', 'tarifa', 'price', 'cost', 'costo', 'pvp', 'precio venta'],
  unidad: ['unidad', 'medida', 'unidad de medida', 'unit', 'uom', 'tipo', 'formato'],
  descripcion: ['descripcion', 'descripción', 'desc', 'description', 'detalle', 'detalles', 'descripción del producto'],
}

function detectarMapeo(columnasArchivo, campos) {
  const mapeo = {}
  const cols = columnasArchivo.map((c) => c.toLowerCase().trim())
  for (const campo of campos) {
    const aliasList = ALIASES[campo.key] || [campo.key]
    let idx = -1
    for (const alias of [campo.key, ...aliasList]) {
      idx = cols.indexOf(alias.toLowerCase())
      if (idx >= 0) break
    }
    if (idx < 0 && campo.required) {
      idx = 0
    }
    mapeo[campo.key] = idx
  }
  return mapeo
}

function normalizarValor(val) {
  if (val === undefined || val === null) return ''
  if (typeof val === 'string') return val.trim()
  return String(val)
}

function validarFilas(rows, campos, mapeo) {
  return rows.map((row, idx) => {
    const errores = []
    for (const campo of campos) {
      const colIdx = mapeo[campo.key]
      const val = colIdx >= 0 ? normalizarValor(row[colIdx]) : ''
      if (campo.required && !val) {
        errores.push(`${campo.label} es obligatorio`)
      }
      if (campo.type === 'number' && val) {
        const num = Number(val.replace(/[^0-9.,\-]/g, '').replace(',', '.'))
        if (isNaN(num) || num < 0) {
          errores.push(`${campo.label} debe ser un número válido`)
        }
      }
      if (campo.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        errores.push('Email inválido')
      }
    }
    return { idx, errores, valido: errores.length === 0, excluir: errores.length > 0 }
  })
}

function descargarPlantilla(tipo) {
  const cfg = CONFIG[tipo]
  const header = cfg.campos.map((c) => c.label)
  const ejemplo = cfg.campos.map((c) => {
    if (c.key === 'nombre') return tipo === 'clientes' ? 'Ejemplo Cliente SPA' : 'Ejemplo Producto'
    if (c.key === 'precio_unitario') return '25000'
    if (c.key === 'email') return 'cliente@ejemplo.cl'
    if (c.key === 'telefono') return '+56 9 1234 5678'
    if (c.key === 'unidad') return 'unidad'
    if (c.key === 'rut') return '12.345.678-9'
    if (c.key === 'direccion') return 'Av. Siempre Viva 123'
    if (c.key === 'descripcion') return 'Descripción de ejemplo'
    if (c.key === 'notas') return 'Nota opcional'
    return ''
  })
  const ws = XLSX.utils.aoa_to_sheet([header, ejemplo])
  ws['!cols'] = header.map(() => ({ wch: 22 }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Datos')
  XLSX.writeFile(wb, `plantilla_${tipo}.xlsx`)
}

const ESTADO_COLOR = {
  upload: 'text-ink-soft',
  mapping: 'text-brand',
  validating: 'text-brand',
  result: 'text-brand',
}

export default function ImportadorMasivo({ tipo, onClose, onComplete }) {
  const toast = useToast()
  const cfg = CONFIG[tipo]
  const fileInputRef = useRef(null)

  const [step, setStep] = useState('upload')
  const [fileName, setFileName] = useState('')
  const [columnas, setColumnas] = useState([])
  const [rawRows, setRawRows] = useState([])
  const [previewRows, setPreviewRows] = useState([])
  const [mapeo, setMapeo] = useState({})
  const [validaciones, setValidaciones] = useState([])
  const [importando, setImportando] = useState(false)
  const [resultado, setResultado] = useState(null)

  const handleFile = useCallback((file) => {
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      toast('Formato no soportado. Sube un archivo .xlsx o .csv', 'error')
      return
    }
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' })

        if (json.length < 2) {
          toast('El archivo debe tener al menos una fila de encabezados y una de datos', 'error')
          return
        }

        const headers = json[0].map((h) => normalizarValor(h) || `Columna ${json[0].indexOf(h) + 1}`)
        const dataRows = json.slice(1).filter((r) => r.some((c) => normalizarValor(c)))

        if (dataRows.length === 0) {
          toast('El archivo no contiene datos válidos', 'error')
          return
        }

        setColumnas(headers)
        setRawRows(dataRows)
        setPreviewRows(dataRows.slice(0, 10))

        const detected = detectarMapeo(headers, cfg.campos)
        setMapeo(detected)
        setStep('mapping')

        const v = validarFilas(dataRows, cfg.campos, detected)
        setValidaciones(v)
      } catch (err) {
        toast('Error al leer el archivo: ' + err.message, 'error')
      }
    }
    reader.readAsArrayBuffer(file)
  }, [cfg, toast])

  function handleMappingChange(campoKey, colIdx) {
    const nuevo = { ...mapeo, [campoKey]: colIdx === '' ? -1 : Number(colIdx) }
    setMapeo(nuevo)
    const v = validarFilas(rawRows, cfg.campos, nuevo)
    setValidaciones(v)
  }

  function toggleExcluir(idx) {
    setValidaciones((prev) => prev.map((v) => (v.idx === idx ? { ...v, excluir: !v.excluir } : v)))
  }

  async function handleImport() {
    const validas = validaciones.filter((v) => v.valido && !v.excluir)
    if (validas.length === 0) {
      toast('No hay filas válidas para importar', 'warning')
      return
    }

    setImportando(true)

    const datos = validas.map((v) => {
      const obj = {}
      for (const campo of cfg.campos) {
        const colIdx = mapeo[campo.key]
        obj[campo.key] = colIdx >= 0 ? normalizarValor(rawRows[v.idx][colIdx]) : (campo.default || '')
      }
      return obj
    })

    const actionModule = await import('@/lib/actions/' + (tipo === 'clientes' ? 'clientes' : 'productos'))
    const actionName = tipo === 'clientes' ? 'importarClientes' : 'importarProductos'
    const res = await actionModule[actionName](datos)

    setImportando(false)
    setStep('result')

    if (res?.error) {
      setResultado({ error: res.error })
    } else {
      const omitidas = validaciones.filter((v) => !v.valido || v.excluir).length
      setResultado({ importadas: res.count, omitidas })
    }
  }

  const validas = validaciones.filter((v) => v.valido && !v.excluir).length
  const conErrores = validaciones.filter((v) => !v.valido).length
  const excluidas = validaciones.filter((v) => v.excluir && v.valido).length

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 pt-4 sm:pt-8 px-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-3xl rounded-2xl bg-white p-5 sm:p-6 shadow-xl mt-8 sm:mt-0 animate-fade-in" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">{cfg.titulo}</h2>
          <button onClick={onClose} className="text-ink-soft hover:text-ink text-xl leading-none">&times;</button>
        </div>

        {/* Steps indicator */}
        <div className="mb-5 flex items-center gap-2 text-xs">
          {['upload', 'mapping', 'validating', 'result'].map((s, i) => {
            const isActive = step === s
            const isPast = ['upload', 'mapping', 'validating', 'result'].indexOf(step) > i
            return (
              <span key={s} className={`flex items-center gap-1.5 ${isActive ? 'text-brand font-medium' : isPast ? 'text-brand/60' : 'text-ink-soft/40'}`}>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${isActive ? 'bg-brand text-white' : isPast ? 'bg-brand/20 text-brand' : 'bg-paper-deep text-ink-soft/40'}`}>
                  {isPast ? <svg className="h-3 w-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 10l3 3 6-6" /></svg> : i + 1}
                </span>
                {s === 'upload' ? 'Subir' : s === 'mapping' ? 'Mapeo' : s === 'validating' ? 'Validar' : 'Resultado'}
                {i < 3 && <span className="ml-1 text-ink-soft/20">&#x2022;</span>}
              </span>
            )
          })}
        </div>

        {/* Step 1: Upload */}
        {step === 'upload' && (
          <div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-paper-deep bg-paper/50 p-8 sm:p-12 transition-colors hover:border-brand/40 hover:bg-brand-light/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light text-brand">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm font-medium text-ink">Arrastra tu archivo aquí o haz clic para seleccionar</p>
              <p className="mt-1 text-xs text-ink-soft">Soporta archivos .xlsx, .xls y .csv</p>
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            </div>

            <div className="mt-4 flex justify-end">
              <button onClick={() => descargarPlantilla(tipo)}
                className="text-sm text-brand hover:underline flex items-center gap-1.5">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar plantilla de ejemplo
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Column Mapping */}
        {step === 'mapping' && (
          <div>
            <p className="text-sm text-ink-soft mb-4">
              Asigna las columnas de tu archivo a los campos del sistema.
              {columnas.length > 0 && <span className="ml-1 text-ink-soft/50">Se detectaron {rawRows.length} filas.</span>}
            </p>

            {/* Mapping selectors */}
            <div className="space-y-3 mb-5">
              {cfg.campos.map((campo) => (
                <div key={campo.key} className="flex items-center gap-3">
                  <label className="w-32 shrink-0 text-sm text-ink font-medium">
                    {campo.label}
                    {campo.required && <span className="text-accent ml-0.5">*</span>}
                  </label>
                  <select
                    value={mapeo[campo.key] ?? -1}
                    onChange={(e) => handleMappingChange(campo.key, e.target.value)}
                    className={`flex-1 rounded-xl border px-3 py-2 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20 ${
                      mapeo[campo.key] == null || mapeo[campo.key] < 0
                        ? 'border-accent-light bg-accent-light/30 text-accent'
                        : 'border-paper-deep bg-paper text-ink'
                    }`}
                  >
                    <option value={-1}>{campo.required ? '-- Selecciona una columna --' : '-- Ninguno --'}</option>
                    {columnas.map((col, i) => (
                      <option key={i} value={i}>{col}</option>
                    ))}
                  </select>
                  {mapeo[campo.key] > -1 && columnas[mapeo[campo.key]] && (
                    <span className="text-xs text-ink-soft/60 shrink-0 w-20 truncate text-right" title={columnas[mapeo[campo.key]]}>
                      &larr; {columnas[mapeo[campo.key]]}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Preview table */}
            <div className="mb-4">
              <p className="text-xs text-ink-soft font-medium mb-2">Vista previa (primeras {previewRows.length} filas)</p>
              <div className="overflow-x-auto rounded-xl border border-paper-deep">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-paper-deep/50">
                      <th className="px-3 py-2 text-left text-ink-soft font-medium">#</th>
                      {cfg.campos.filter((c) => mapeo[c.key] >= 0).map((c) => (
                        <th key={c.key} className="px-3 py-2 text-left text-ink-soft font-medium whitespace-nowrap">{c.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, i) => (
                      <tr key={i} className="border-t border-paper-deep">
                        <td className="px-3 py-2 text-ink-soft/40">{i + 1}</td>
                        {cfg.campos.filter((c) => mapeo[c.key] >= 0).map((c) => {
                          const val = normalizarValor(row[mapeo[c.key]])
                          return <td key={c.key} className="px-3 py-2 text-ink truncate max-w-[160px]" title={val}>{val || <span className="text-ink-soft/30">—</span>}</td>
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setStep('upload')}
                className="rounded-xl border border-paper-deep px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-deep transition-colors">Volver</button>
              <button onClick={() => setStep('validating')}
                className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-hover transition-colors">
                Continuar ({rawRows.length} filas)
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Validation */}
        {step === 'validating' && (
          <div>
            <div className="mb-4 flex flex-wrap gap-3">
              <div className="rounded-lg bg-brand-light/50 px-3 py-1.5 text-sm">
                <span className="font-semibold text-brand">{validas}</span>
                <span className="text-brand/70 ml-1">válida{validas !== 1 ? 's' : ''}</span>
              </div>
              {conErrores > 0 && (
                <div className="rounded-lg bg-accent-light/50 px-3 py-1.5 text-sm">
                  <span className="font-semibold text-accent">{conErrores}</span>
                  <span className="text-accent/70 ml-1">con error{conErrores !== 1 ? 'es' : ''}</span>
                </div>
              )}
              {excluidas > 0 && (
                <div className="rounded-lg bg-paper-deep/50 px-3 py-1.5 text-sm">
                  <span className="font-semibold text-ink-soft">{excluidas}</span>
                  <span className="text-ink-soft/70 ml-1">excluida{excluidas !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            <div className="overflow-x-auto rounded-xl border border-paper-deep max-h-80 overflow-y-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-paper-deep/50 sticky top-0">
                    <th className="px-3 py-2 text-left text-ink-soft font-medium w-8">#</th>
                    {cfg.campos.filter((c) => mapeo[c.key] >= 0).map((c) => (
                      <th key={c.key} className="px-3 py-2 text-left text-ink-soft font-medium whitespace-nowrap">{c.label}</th>
                    ))}
                    <th className="px-3 py-2 text-center text-ink-soft font-medium">Estado</th>
                    <th className="px-3 py-2 text-center text-ink-soft font-medium w-16">Incluir</th>
                  </tr>
                </thead>
                <tbody>
                  {validaciones.map((v) => {
                    const row = rawRows[v.idx]
                    return (
                      <tr key={v.idx} className={`border-t border-paper-deep ${!v.valido || v.excluir ? 'opacity-60' : ''}`}>
                        <td className="px-3 py-2 text-ink-soft/40">{v.idx + 1}</td>
                        {cfg.campos.filter((c) => mapeo[c.key] >= 0).map((c) => {
                          const val = normalizarValor(row[mapeo[c.key]])
                          return <td key={c.key} className={`px-3 py-2 truncate max-w-[140px] ${c.required && !val ? 'text-accent' : 'text-ink'}`} title={val}>{val || <span className="text-accent/50">(vacío)</span>}</td>
                        })}
                        <td className="px-3 py-2 text-center">
                          {v.valido ? (
                            <span className="text-brand text-[10px] font-medium">OK</span>
                          ) : (
                            <span className="text-accent text-[10px] font-medium" title={v.errores.join(', ')}>
                              Error
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={!v.excluir}
                            onChange={() => toggleExcluir(v.idx)}
                            disabled={!v.valido}
                            className="h-4 w-4 rounded border-paper-deep text-brand focus:ring-brand/20 disabled:opacity-30"
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setStep('mapping')}
                className="rounded-xl border border-paper-deep px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-deep transition-colors">Volver</button>
              <button onClick={handleImport} disabled={validas === 0 || importando}
                className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-50 transition-colors">
                {importando ? 'Importando...' : `Importar ${validas} ${validas === 1 ? cfg.etiqueta : cfg.etiquetas}`}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Result */}
        {step === 'result' && (
          <div className="text-center py-6">
            {resultado?.error ? (
              <>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-light text-accent">
                  <svg className="h-6 w-6" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 6v4m0 4h.01" /></svg>
                </div>
                <p className="text-sm text-accent">{resultado.error}</p>
              </>
            ) : (
              <>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-brand">
                  <svg className="h-6 w-6" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 10l3 3 6-6" /></svg>
                </div>
                <p className="text-base font-semibold text-ink">Importación completada</p>
                <p className="mt-2 text-sm text-ink-soft">
                  Se importaron <strong>{resultado.importadas}</strong> {resultado.importadas === 1 ? cfg.etiqueta : cfg.etiquetas}
                  {resultado.omitidas > 0 && (
                    <>, <strong>{resultado.omitidas}</strong> {resultado.omitidas === 1 ? 'fila fue' : 'filas fueron'} omitida{resultado.omitidas !== 1 ? 's' : ''} por errores</>
                  )}
                  .
                </p>
              </>
            )}
            <div className="mt-6 flex justify-center gap-3">
              {resultado?.error && (
                <button onClick={() => { setStep('upload'); setResultado(null); setFileName(''); setColumnas([]); setRawRows([]); setValidaciones([]) }}
                  className="rounded-xl border border-paper-deep px-5 py-2.5 text-sm text-ink-soft hover:bg-paper-deep transition-colors">Intentar de nuevo</button>
              )}
              <button onClick={() => { onComplete?.(); onClose() }}
                className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-hover transition-colors">Cerrar</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
