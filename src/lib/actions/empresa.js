'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateEmpresa(prevState, formData) {
  const raw = Object.fromEntries(formData)

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('empresa_id')
    .eq('id', user.id)
    .single()

  if (!profile?.empresa_id) return { error: 'Empresa no encontrada' }

  const updates = {}
  if (raw.nombre?.trim()) updates.nombre = raw.nombre.trim()
  if (raw.rut) updates.rut = raw.rut
  if (raw.email) updates.email = raw.email
  if (raw.telefono) updates.telefono = raw.telefono
  if (raw.direccion) updates.direccion = raw.direccion
  if (raw.moneda) updates.moneda = raw.moneda

  const { error } = await supabase
    .from('empresas')
    .update(updates)
    .eq('id', profile.empresa_id)

  if (error) return { error: error.message }
  revalidatePath('/perfil')
  return { success: true }
}

export async function uploadLogo(formData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('empresa_id')
    .eq('id', user.id)
    .single()

  if (!profile?.empresa_id) return { error: 'Empresa no encontrada' }

  const file = formData.get('logo')
  if (!file || !file.size) return { error: 'Selecciona una imagen' }

  const ext = file.name.split('.').pop()
  const path = `logos/${profile.empresa_id}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('cotizaciones-pdf')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) return { error: uploadError.message }

  const { data: urlData } = supabase.storage
    .from('cotizaciones-pdf')
    .getPublicUrl(path)

  const { error: updateError } = await supabase
    .from('empresas')
    .update({ logo_url: urlData.publicUrl })
    .eq('id', profile.empresa_id)

  if (updateError) return { error: updateError.message }
  revalidatePath('/perfil')
  return { success: true, url: urlData.publicUrl }
}
