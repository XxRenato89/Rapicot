'use client'

import { useActionState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { login } from '@/lib/actions/auth'

function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/cotizaciones'
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div className="relative w-full max-w-sm">
      {/* Desktop decoration */}
      <div className="absolute -left-20 top-10 hidden h-32 w-24 rotate-6 rounded-lg border border-paper-deep bg-paper shadow-sm lg:block" />
      <div className="absolute -right-16 bottom-20 hidden h-28 w-20 -rotate-3 rounded-lg border border-paper-deep bg-paper shadow-sm lg:block" />

      {/* Signature watermark */}
      <div className="pointer-events-none absolute -right-8 -top-8 select-none opacity-[0.04]">
        <svg className="h-40 w-40 text-brand" viewBox="0 0 40 40" fill="none">
          <path d="M12 24l6 6 14-16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M33 13c-4 4-9 6-14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="rounded-2xl border border-paper-deep bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <svg className="h-10 w-10 text-brand" viewBox="0 0 40 40" fill="none">
              <path d="M12 24l6 6 14-16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M33 13c-4 4-9 6-14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="font-display text-2xl tracking-tight">Bienvenido de vuelta</h1>
          <p className="mt-1 text-sm text-ink-soft">Ingresa para gestionar tus cotizaciones</p>
        </div>

        <form action={action} className="space-y-4">
          {state?.error && (
            <p className="rounded-lg bg-accent-light p-3 text-sm text-accent">{state.error}</p>
          )}

          <input type="hidden" name="redirect" value={redirectTo} />

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-paper-deep bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-paper-deep bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-hover disabled:opacity-50"
          >
            {pending ? 'Ingresando...' : 'Iniciar sesión'}
          </button>

          <div className="text-center">
            <Link
              href="/recuperar"
              className="text-sm text-ink-soft hover:text-brand transition-colors"
            >
              Olvidé mi contraseña
            </Link>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="font-medium text-brand hover:text-brand-hover">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
