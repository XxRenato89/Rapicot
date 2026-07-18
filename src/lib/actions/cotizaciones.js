'use server'

import crypto from 'crypto'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const ESTADOS = ['borrador', 'enviada', 'aceptada', 'rechazada']

export async function actualizarEstado(formData) {
  const id = formData.get('id')
  const estado = formData.get('estado')

  if (!ESTADOS.includes(estado)) return { error: 'Estado inválido' }

  const supabase = await createClient()
  const updates = { estado }

  if (estado === 'enviada') {
    updates.emitida_at = new Date().toISOString()
  }

  const { error } = await supabase.from('cotizaciones').update(updates).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath(`/cotizaciones/${id}`)
  return { success: true }
}

export async function crearCotizacion(data) {
  const { cliente_id, items, notas, fecha_validez } = data

  if (!cliente_id) return { error: 'Selecciona un cliente' }
  if (!items || items.length === 0) return { error: 'Agrega al menos un item' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('empresa_id')
    .eq('id', user.id)
    .single()

  if (!profile?.empresa_id) return { error: 'Empresa no encontrada' }

  const { data: nextNum } = await supabase
    .rpc('next_cotizacion_numero', { p_empresa_id: profile.empresa_id })

  const subtotal = items.reduce((s, i) => s + i.cantidad * i.precio_unitario, 0)
  const descuentoTotal = items.reduce((s, i) => s + (i.descuento || 0), 0)
  const neto = subtotal - descuentoTotal
  const iva = neto * 0.19
  const total = neto + iva

  const insertData = {
    empresa_id: profile.empresa_id,
    cliente_id,
    numero: nextNum,
    notas: notas || null,
    subtotal: Math.round(subtotal * 100) / 100,
    descuento_global: Math.round(descuentoTotal * 100) / 100,
    iva: Math.round(iva * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
  insertData.token = crypto.randomUUID()
  if (fecha_validez) insertData.fecha_validez = fecha_validez

  const { data: cotizacion, error } = await supabase
    .from('cotizaciones')
    .insert(insertData)
    .select('id, token')
    .single()

  if (error) return { error: error.message }

  const itemsToInsert = items.map((i) => ({
    cotizacion_id: cotizacion.id,
    producto_id: i.producto_id || null,
    descripcion: i.descripcion,
    cantidad: i.cantidad,
    precio_unitario: i.precio_unitario,
    descuento: i.descuento || 0,
    total: Math.round((i.cantidad * i.precio_unitario - (i.descuento || 0)) * 100) / 100,
  }))

  const { error: itemsError } = await supabase
    .from('cotizacion_items')
    .insert(itemsToInsert)

  if (itemsError) {
    await supabase.from('cotizaciones').delete().eq('id', cotizacion.id)
    return { error: itemsError.message }
  }

  revalidatePath('/cotizaciones')
  return { success: true, id: cotizacion.id, token: cotizacion.token }
}

export async function duplicarCotizacion(formData) {
  const originalId = formData.get('id')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { data: original } = await supabase
    .from('cotizaciones')
    .select('*')
    .eq('id', originalId)
    .single()
  if (!original) return { error: 'Cotización no encontrada' }

  const { data: items } = await supabase
    .from('cotizacion_items')
    .select('*')
    .eq('cotizacion_id', originalId)
    .order('created_at')

  const { data: nextNum } = await supabase
    .rpc('next_cotizacion_numero', { p_empresa_id: original.empresa_id })

  const { data: cotizacion, error } = await supabase
    .from('cotizaciones')
    .insert({
      empresa_id: original.empresa_id,
      cliente_id: original.cliente_id,
      numero: nextNum,
      notas: original.notas,
      subtotal: original.subtotal,
      descuento_global: original.descuento_global,
      iva: original.iva,
      total: original.total,
      fecha_validez: original.fecha_validez,
      token: crypto.randomUUID(),
      estado: 'borrador',
    })
    .select('id, token')
    .single()

  if (error) return { error: error.message }

  const itemsToInsert = (items ?? []).map((i) => ({
    cotizacion_id: cotizacion.id,
    producto_id: i.producto_id,
    descripcion: i.descripcion,
    cantidad: i.cantidad,
    precio_unitario: i.precio_unitario,
    descuento: i.descuento,
    total: i.total,
  }))

  const { error: itemsError } = await supabase
    .from('cotizacion_items')
    .insert(itemsToInsert)

  if (itemsError) {
    await supabase.from('cotizaciones').delete().eq('id', cotizacion.id)
    return { error: itemsError.message }
  }

  revalidatePath('/cotizaciones')
  return { success: true, id: cotizacion.id }
}

export async function eliminarCotizacion(formData) {
  const id = formData.get('id')
  const supabase = await createClient()

  const { error } = await supabase
    .from('cotizaciones')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/cotizaciones')
  revalidatePath(`/cotizaciones/${id}`)
  return { success: true }
}

export async function restaurarCotizacion(formData) {
  const id = formData.get('id')
  const supabase = await createClient()

  const { error } = await supabase
    .from('cotizaciones')
    .update({ deleted_at: null })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/cotizaciones')
  revalidatePath('/cotizaciones/papelera')
  return { success: true }
}

export async function responderCotizacion(formData) {
  const token = formData.get('token')
  const respuesta = formData.get('respuesta')

  if (!token) return { error: 'Token inválido' }
  if (!['aceptada', 'rechazada'].includes(respuesta)) return { error: 'Respuesta inválida' }

  const supabase = await createClient()

  const { data: cotizacion } = await supabase
    .from('cotizaciones')
    .select('id, estado, respondida_at')
    .eq('token', token)
    .single()

  if (!cotizacion) return { error: 'Cotización no encontrada' }

  if (cotizacion.respondida_at) return { error: 'Esta cotización ya fue respondida' }
  if (cotizacion.estado !== 'enviada') return { error: 'Esta cotización no está en estado enviada' }

  const { error } = await supabase
    .from('cotizaciones')
    .update({
      estado: respuesta,
      respondida_at: new Date().toISOString(),
    })
    .eq('id', cotizacion.id)

  if (error) return { error: error.message }

  revalidatePath(`/cotizacion/${token}`)
  revalidatePath(`/cotizaciones/${cotizacion.id}`)
  return { success: true, respuesta }
}
