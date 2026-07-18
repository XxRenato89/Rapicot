import { createClient } from '@/lib/supabase/server'

const SELECT = 'id, nombre, rut, email, telefono, direccion, notas, created_at'

export async function getClientes(query) {
  const supabase = await createClient()
  let q = supabase.from('clientes').select(SELECT).order('nombre', { ascending: true })
  if (query) q = q.ilike('nombre', `%${query}%`)
  const { data } = await q
  return data ?? []
}

export async function getCliente(id) {
  const supabase = await createClient()
  const { data } = await supabase.from('clientes').select(SELECT).eq('id', id).single()
  return data
}
