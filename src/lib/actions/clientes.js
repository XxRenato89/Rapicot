'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sanitizar, validarEmail } from '@/lib/security'

function validate(data) {
  const errors = {}
  if (!data.nombre?.trim()) errors.nombre = 'El nombre es obligatorio'
  if (data.email && !validarEmail(data.email)) {
    errors.email = 'Email inválido'
  }
  return errors
}

export async function createCliente(prevState, formData) {
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

  const { error } = await supabase.from('clientes').insert({
    empresa_id: profile.empresa_id,
    nombre: sanitizar(raw.nombre),
    rut: sanitizar(raw.rut || '') || null,
    email: sanitizar(raw.email || '') || null,
    telefono: sanitizar(raw.telefono || '') || null,
    direccion: sanitizar(raw.direccion || '') || null,
    notas: sanitizar(raw.notas || '') || null,
  })

  if (error) return { error: error.message }
  revalidatePath('/clientes')
  return { success: true, message: 'Cliente creado' }
}

export async function updateCliente(prevState, formData) {
  const raw = Object.fromEntries(formData)
  const errors = validate(raw)
  if (Object.keys(errors).length) return { errors }

  const supabase = await createClient()
  const { error } = await supabase
    .from('clientes')
    .update({
      nombre: sanitizar(raw.nombre),
      rut: sanitizar(raw.rut || '') || null,
      email: sanitizar(raw.email || '') || null,
      telefono: sanitizar(raw.telefono || '') || null,
      direccion: sanitizar(raw.direccion || '') || null,
      notas: sanitizar(raw.notas || '') || null,
    })
    .eq('id', raw.id)

  if (error) return { error: error.message }
  revalidatePath('/clientes')
  return { success: true, message: 'Cliente actualizado' }
}

export async function deleteCliente(formData) {
  const id = formData.get('id')
  const supabase = await createClient()
  await supabase.from('clientes').delete().eq('id', id)
  revalidatePath('/clientes')
}

export async function importarClientes(data) {
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
    rut: sanitizar(r.rut || '') || null,
    email: sanitizar(r.email || '') || null,
    telefono: sanitizar(r.telefono || '') || null,
    direccion: sanitizar(r.direccion || '') || null,
    notas: sanitizar(r.notas || '') || null,
  }))

  const { error } = await supabase.from('clientes').insert(rows)
  if (error) return { error: error.message }

  revalidatePath('/clientes')
  return { success: true, count: rows.length }
}
