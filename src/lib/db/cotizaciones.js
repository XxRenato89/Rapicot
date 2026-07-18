import { createClient } from '@/lib/supabase/server'

export async function getCotizacionDetalle(id) {
  const supabase = await createClient()

  const { data: cotizacion, error } = await supabase
    .from('cotizaciones')
    .select('*, clientes(*), empresas!inner(*)')
    .eq('id', id)
    .single()

  if (error || !cotizacion) return null

  const { data: items } = await supabase
    .from('cotizacion_items')
    .select('*')
    .eq('cotizacion_id', id)
    .order('created_at')

  return { ...cotizacion, items: items ?? [] }
}
