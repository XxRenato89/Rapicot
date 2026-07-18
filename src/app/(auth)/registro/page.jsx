'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { signup } from '@/lib/actions/auth'
import FortalezaContrasena from '@/components/dashboard/FortalezaContrasena'

export default function RegistroPage() {
  const [state, action, pending] = useActionState(signup, undefined)
  const [password, setPassword] = useState('')

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
              <svg className="h-10 w-10 text-brand" viewBox="0 0 40 40" fill="none">
                <path d="M12 24l6 6 14-16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M33 13c-4 4-9 6-14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="font-display text-2xl tracking-tight">Empieza gratis</h1>
            <p className="mt-1 text-sm text-ink-soft">Crea tu cuenta en segundos</p>
          </div>

          <form action={action} className="space-y-4">
            {state?.error && (
              <p className="rounded-lg bg-accent-light p-3 text-sm text-accent">{state.error}</p>
            )}
            {state?.success && (
              <p className="rounded-lg bg-brand-light p-3 text-sm text-brand">{state.success}</p>
            )}

            <div>
              <label htmlFor="empresa_nombre" className="block text-sm font-medium text-ink mb-1.5">
                Nombre de tu empresa
              </label>
              <input
                id="empresa_nombre"
                name="empresa_nombre"
                type="text"
                required
                autoComplete="organization"
                className="w-full rounded-xl border border-paper-deep bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>

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
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-paper-deep bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <FortalezaContrasena password={password} />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-hover disabled:opacity-50"
            >
              {pending ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-medium text-brand hover:text-brand-hover">
              Inicia sesión
            </Link>
          </p>
          <p className="mt-3 text-center text-xs text-ink-soft/60">
            El logo lo puedes agregar después desde tu perfil.
          </p>
        </div>
      </div>
    </div>
  )
}
