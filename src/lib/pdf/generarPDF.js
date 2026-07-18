import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

const BLACK = [31, 31, 31]
const GRAY = [113, 113, 122]
const RED = [220, 38, 38]

const MONEDA_SYMBOLS = { CLP: '$ ', UF: 'UF ', USD: 'US$ ' }

function formatearPrecio(n, moneda) {
  const sym = MONEDA_SYMBOLS[moneda] || '$ '
  return sym + Number(n).toLocaleString('es-CL', { minimumFractionDigits: moneda === 'UF' ? 2 : 0, maximumFractionDigits: moneda === 'UF' ? 2 : 0 })
}

function formatearFecha(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' })
}

const ESTADO_COLORS = {
  borrador: [161, 161, 170],
  enviada: [37, 99, 235],
  aceptada: [22, 163, 74],
  rechazada: [220, 38, 38],
}

export async function generarPDF({ cotizacion, empresa, cliente, items }) {
  const moneda = empresa?.moneda || 'CLP'
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = 190
  const margin = 10
  let y = margin

  const PAGE_HEIGHT = 297
  const BOTTOM_MARGIN = 20

  function checkPageBreak(h) {
    if (y + h > PAGE_HEIGHT - BOTTOM_MARGIN) {
      doc.addPage()
      y = margin
    }
  }

  // ---- Header: Logo + Empresa ----
  if (empresa.logo_url) {
    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = empresa.logo_url
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })
      const imgProps = doc.getImageProperties(img)
      const maxH = 20
      const scale = maxH / imgProps.height
      doc.addImage(img, 'JPEG', margin, y, imgProps.width * scale, maxH)
      y += maxH + 4
    } catch {
      // silencio si falla la imagen
    }
  }

  doc.setFontSize(18).setFont('helvetica', 'bold').text(empresa.nombre || '', pageW / 2, y, { align: 'center' })
  y += 7
  doc.setFontSize(9).setFont('helvetica', 'normal').setTextColor(...GRAY)
  const datosEmpresa = [empresa.rut, empresa.direccion, empresa.telefono, empresa.email].filter(Boolean)
  datosEmpresa.forEach((line) => {
    doc.text(line, pageW / 2, y, { align: 'center' })
    y += 4
  })
  y += 3

  // ---- Línea separadora ----
  doc.setDrawColor(...GRAY).setLineWidth(0.3).line(margin, y, margin + pageW, y)
  y += 6

  // ---- Título + Número ----
  doc.setFontSize(20).setFont('helvetica', 'bold').setTextColor(...BLACK)
  doc.text(`COTIZACIÓN N° ${cotizacion.numero_padded || `COT-${String(cotizacion.numero).padStart(4, '0')}`}`, margin, y)
  y += 8

  doc.setFontSize(9).setFont('helvetica', 'normal').setTextColor(...GRAY)
  doc.text(`Fecha: ${formatearFecha(cotizacion.created_at)}`, margin, y)
  y += 5

  // Estado badge
  const colorEstado = ESTADO_COLORS[cotizacion.estado] || GRAY
  doc.setFillColor(...colorEstado).setTextColor(255, 255, 255).setFontSize(8).setFont('helvetica', 'bold')
  const estadoLabel = cotizacion.estado.charAt(0).toUpperCase() + cotizacion.estado.slice(1)
  const estadoW = doc.getTextWidth(estadoLabel) + 6
  doc.roundedRect(margin, y - 1, estadoW, 5, 1, 1, 'F')
  doc.text(estadoLabel, margin + 3, y + 3)
  doc.setTextColor(...BLACK)
  y += 10

  // ---- Datos del cliente ----
  doc.setFontSize(10).setFont('helvetica', 'bold').text('Cliente', margin, y)
  y += 5
  doc.setFontSize(9).setFont('helvetica', 'normal').setTextColor(...BLACK)
  const datosCliente = [
    cliente.nombre,
    cliente.rut ? `RUT: ${cliente.rut}` : null,
    cliente.direccion,
    cliente.email,
    cliente.telefono,
  ].filter(Boolean)
  datosCliente.forEach((line) => {
    doc.text(line, margin, y)
    y += 4
  })
  y += 3

  // ---- Tabla de ítems ----
  checkPageBreak(10)
  const tableBody = items.map((it) => [
    String(it.cantidad),
    it.descripcion,
    formatearPrecio(it.precio_unitario, moneda),
    it.descuento > 0 ? formatearPrecio(it.descuento, moneda) : '-',
    formatearPrecio(it.total, moneda),
  ])

  doc.autoTable({
    startY: y,
    margin: { left: margin, right: margin },
    tableWidth: pageW,
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      lineColor: [212, 212, 216],
      lineWidth: 0.2,
      textColor: BLACK,
    },
    headStyles: {
      fillColor: BLACK,
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 8,
    },
    footStyles: {
      fillColor: [245, 245, 245],
      fontStyle: 'bold',
      fontSize: 8,
    },
    columns: [
      { header: 'Cant.', dataKey: 0 },
      { header: 'Descripción', dataKey: 1 },
      { header: 'P. Unitario', dataKey: 2 },
      { header: 'Descuento', dataKey: 3 },
      { header: 'Total', dataKey: 4 },
    ],
    body: tableBody,
    didParseCell(data) {
      if (data.section === 'body' && data.column.dataKey === 1) {
        data.cell.styles.halign = 'left'
      }
      if (data.section === 'body' && data.column.dataKey !== 1) {
        data.cell.styles.halign = 'right'
      }
    },
  })

  y = doc.lastAutoTable.finalY + 6

  // ---- Totales ----
  const subtotal = items.reduce((s, i) => s + Number(i.cantidad) * Number(i.precio_unitario), 0)
  const descuentoTotal = items.reduce((s, i) => s + Number(i.descuento), 0)
  const neto = subtotal - descuentoTotal
  const iva = neto * 0.19
  const total = neto + iva

  const totales = [
    { label: 'Subtotal', value: formatearPrecio(subtotal, moneda) },
    descuentoTotal > 0 && { label: 'Descuento', value: `- ${formatearPrecio(descuentoTotal, moneda)}` },
    { label: `IVA 19%`, value: formatearPrecio(iva, moneda) },
    { label: 'TOTAL', value: formatearPrecio(total, moneda), bold: true },
  ].filter(Boolean)

  const col1X = pageW / 2 + margin
  const col2X = margin + pageW - 30
  totales.forEach((t) => {
    checkPageBreak(6)
    doc.setFontSize(t.bold ? 12 : 10).setFont('helvetica', t.bold ? 'bold' : 'normal')
    if (t.bold) doc.setTextColor(...BLACK)
    else doc.setTextColor(...GRAY)
    doc.text(t.label, col1X, y)
    doc.text(t.value, col2X, y, { align: 'right' })
    if (t.bold) {
      y += 2
      doc.setDrawColor(...BLACK).setLineWidth(0.5).line(col1X, y, margin + pageW, y)
    }
    y += 6
  })

  doc.setTextColor(...BLACK)
  y += 2

  // ---- Notas ----
  if (cotizacion.notas) {
    checkPageBreak(10)
    doc.setFontSize(9).setFont('helvetica', 'bold').text('Notas / Condiciones', margin, y)
    y += 5
    doc.setFont('helvetica', 'normal').setTextColor(...GRAY)
    const lines = doc.splitTextToSize(cotizacion.notas, pageW)
    lines.forEach((line) => {
      checkPageBreak(5)
      doc.text(line, margin, y)
      y += 4
    })
  }

  return doc
}

export function descargarPDF(doc, filename) {
  doc.save(filename)
}

export async function blobPDF(doc) {
  return doc.output('blob')
}
