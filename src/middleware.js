import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = await createClient(request, response)

  // Refresca la sesión del usuario si existe y es válida
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // 1. Proteger rutas del Dashboard (requieren autenticación)
  const isDashboardRoute =
    path.startsWith('/inicio') ||
    path.startsWith('/cotizaciones') ||
    path.startsWith('/clientes') ||
    path.startsWith('/catalogo') ||
    path.startsWith('/perfil') ||
    path.startsWith('/calificaciones')

  if (isDashboardRoute && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  // 2. Redirigir usuarios ya autenticados lejos de las páginas de Auth
  const isAuthRoute =
    path.startsWith('/login') ||
    path.startsWith('/registro') ||
    path.startsWith('/recuperar')

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/inicio', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (if any)
     * - static files (_next/static, _next/image)
     * - assets (favicon.ico, sitemap.xml, robots.txt)
     * - images/fonts (extension based)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
