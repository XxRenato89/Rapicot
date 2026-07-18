'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { solicitarRecuperacion } from '@/lib/actions/auth'

export default function RecuperarPage() {
  const [state, action, pending] = useActionState(solicitarRecuperacion, undefined)

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-sm">
        <div className="absolute -left-20 top-10 hidden h-32 w-24 rotate-6 rounded-lg border border-paper-deep bg-paper shadow-sm lg:block" />
        <div className="absolute -right-16 bottom-20 hidden h-28 w-20 -rotate-3 rounded-lg border border-paper-deep bg-paper shadow-sm lg:block" />

        <div className="pointer-events-none absolute -right-8 -top-8 select-none opacity-[0.04]">
          <svg className="h-40 w-40 text-brand" viewBox="0 0 40 40" fill="none">
            <path d="M12 24l6 6 14-16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M33 13c-4 4-9 6-14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <div className="rounded-2xl border border-paper-deep bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <div className="mb-4 flex justify-center">
              <svg className="h-10 w-10 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="font-display text-2xl tracking-tight">Recuperar contraseña</h1>
            <p className="mt-1 text-sm text-ink-soft">
              Te enviaremos un link para restablecer tu contraseña.
            </p>
          </div>

          <form action={action} className="space-y-4">
            {state?.error && (
              <p className="rounded-lg bg-accent-light p-3 text-sm text-accent">{state.error}</p>
            )}
            {state?.success && (
              <div>
                <p className="rounded-lg bg-brand-light p-3 text-sm text-brand">{state.success}</p>
                <Link
                  href="/login"
                  className="mt-4 inline-block w-full rounded-xl bg-accent px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-accent-hover transition-colors"
                >
                  Volver a iniciar sesión
                </Link>
              </div>
            )}

            {!state?.success && (
              <>
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

                <button
                  type="submit"
                  disabled={pending}
                  className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-hover disabled:opacity-50"
                >
                  {pending ? 'Enviando...' : 'Enviar link'}
                </button>
              </>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft">
            <Link href="/login" className="font-medium text-brand hover:text-brand-hover">
              Volver a iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
