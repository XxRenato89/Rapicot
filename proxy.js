import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

const protectedRoutes = ['/clientes', '/catalogo', '/cotizaciones', '/perfil']
const publicRoutes = ['/login', '/registro', '/']

export async function proxy(request) {
  const response = NextResponse.next()
  const supabase = await createClient(request, response)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isProtected = protectedRoutes.some((r) => path.startsWith(r))
  const isPublic = publicRoutes.some((r) => path === r)

  if (isProtected && !user) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', path)
    return NextResponse.redirect(url)
  }

  if (isPublic && user && path !== '/') {
    return NextResponse.redirect(new URL('/cotizaciones', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
