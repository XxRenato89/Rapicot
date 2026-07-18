'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { validarContrasena, validarEmail, sanitizar } from '@/lib/security'

export async function login(prevState, formData) {
  const supabase = await createClient()

  const email = sanitizar(formData.get('email') || '')
  const password = formData.get('password') || ''
  const redirectTo = formData.get('redirect') || '/cotizaciones'

  if (!email || !password) {
    return { error: 'Completa todos los campos' }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Email o contraseña incorrectos' }
  }

  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

export async function signup(prevState, formData) {
  const supabase = await createClient()

  const empresaNombre = sanitizar(formData.get('empresa_nombre') || '')
  const email = sanitizar(formData.get('email') || '')
  const password = formData.get('password') || ''

  if (!empresaNombre || !email || !password) {
    return { error: 'Completa todos los campos' }
  }

  if (!validarEmail(email)) {
    return { error: 'Ingresa un email válido' }
  }

  const erroresPass = validarContrasena(password)
  if (erroresPass.length > 0) {
    return { error: `Contraseña: ${erroresPass.join(', ').toLowerCase()}` }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        empresa_nombre: empresaNombre,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user?.identities?.length === 0) {
    return { error: 'Este email ya está registrado' }
  }

  if (data.session) {
    revalidatePath('/', 'layout')
    redirect('/inicio')
  }

  return { success: 'Revisa tu email para confirmar la cuenta. Luego inicia sesión.' }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function reenviarVerificacion() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return { error: 'No se pudo obtener el email' }

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: user.email,
  })

  if (error) return { error: error.message }
  return { success: 'Correo de verificación reenviado' }
}

export async function solicitarRecuperacion(prevState, formData) {
  const supabase = await createClient()
  const email = sanitizar(formData.get('email') || '')

  if (!email) return { error: 'Ingresa tu email' }
  if (!validarEmail(email)) return { error: 'Ingresa un email válido' }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/recuperar/nueva-contrasena`,
  })

  if (error) return { error: error.message }
  return { success: 'Revisa tu email. Te enviamos un link para recuperar tu contraseña.' }
}

export async function actualizarPassword(prevState, formData) {
  const supabase = await createClient()
  const password = formData.get('password') || ''

  const erroresPass = validarContrasena(password)
  if (erroresPass.length > 0) {
    return { error: `La contraseña debe cumplir: ${erroresPass.join(', ').toLowerCase()}` }
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) return { error: error.message }
  return { success: 'Contraseña actualizada correctamente' }
}
