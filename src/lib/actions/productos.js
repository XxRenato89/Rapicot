'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sanitizar } from '@/lib/security'

function validate(data) {
  const errors = {}
  if (!data.nombre?.trim()) errors.nombre = 'El nombre es obligatorio'
  if (!data.precio_unitario || Number(data.precio_unitario) < 0) {
    errors.precio_unitario = 'Ingresa un precio válido (>= 0)'
  }
  if (!data.unidad?.trim()) errors.unidad = 'Selecciona o escribe una unidad'
  return errors
}

export async function createProducto(prevState, formData) {
  const raw = Object.fromEntries(formData)
  const errors = validate(raw)
  if (Object.keys(errors).length) return { errors }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('empresa_id')
    .eq('id', user.id)
    .single()

  if (!profile?.empresa_id) return { error: 'Empresa no encontrada' }

  const { error } = await supabase.from('productos').insert({
    empresa_id: profile.empresa_id,
    nombre: sanitizar(raw.nombre),
    descripcion: sanitizar(raw.descripcion || '') || null,
    precio_unitario: Number(raw.precio_unitario),
    unidad: sanitizar(raw.unidad),
  })

  if (error) return { error: error.message }
  revalidatePath('/catalogo')
  return { success: true }
}

export async function updateProducto(prevState, formData) {
  const raw = Object.fromEntries(formData)
  const errors = validate(raw)
  if (Object.keys(errors).length) return { errors }

  const supabase = await createClient()
  const { error } = await supabase
    .from('productos')
    .update({
      nombre: sanitizar(raw.nombre),
      descripcion: sanitizar(raw.descripcion || '') || null,
      precio_unitario: Number(raw.precio_unitario),
      unidad: sanitizar(raw.unidad),
    })
    .eq('id', raw.id)

  if (error) return { error: error.message }
  revalidatePath('/catalogo')
  return { success: true }
}

export async function importarProductos(data) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('empresa_id')
    .eq('id', user.id)
    .single()

  if (!profile?.empresa_id) return { error: 'Empresa no encontrada' }

  const rows = data.map((r) => ({
    empresa_id: profile.empresa_id,
    nombre: sanitizar(r.nombre || ''),
    descripcion: sanitizar(r.descripcion || '') || null,
    precio_unitario: Number(r.precio_unitario),
    unidad: sanitizar(r.unidad || 'unidad'),
  }))

  const { error } = await supabase.from('productos').insert(rows)
  if (error) return { error: error.message }

  revalidatePath('/catalogo')
  return { success: true, count: rows.length }
}
