'use client'

import { useState } from 'react'

export default function ContactoForm() {
  const [status, setStatus] = useState('idle')
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' })

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('https://formsubmit.co/ajax/hola@rapicot.cl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Error al enviar')

      setStatus('sent')
      setForm({ nombre: '', email: '', mensaje: '' })
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-12 space-y-5 rounded-2xl border border-paper-deep bg-paper p-6 sm:p-8"
      >
        <div>
          <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium text-ink">
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            required
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="w-full rounded-xl border border-paper-deep bg-paper-deep/50 px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand focus:bg-paper"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-paper-deep bg-paper-deep/50 px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand focus:bg-paper"
            placeholder="tu@correo.cl"
          />
        </div>

        <div>
          <label htmlFor="mensaje" className="mb-1.5 block text-sm font-medium text-ink">
            Mensaje
          </label>
          <textarea
            id="mensaje"
            required
            rows={5}
            value={form.mensaje}
            onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
            className="w-full resize-y rounded-xl border border-paper-deep bg-paper-deep/50 px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand focus:bg-paper"
            placeholder="¿En qué podemos ayudarte?"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
        </button>

        {status === 'sent' && (
          <p className="text-center text-sm font-medium text-brand">
            Mensaje enviado. Te responderemos pronto.
          </p>
        )}
        {status === 'error' && (
          <p className="text-center text-sm font-medium text-accent">
            Hubo un error al enviar. Intenta de nuevo.
          </p>
        )}
      </form>

      <div className="mt-8 text-center text-sm text-ink-soft">
        También puedes escribirnos directamente a{' '}
        <a href="mailto:hola@rapicot.cl" className="font-medium text-brand underline">
          hola@rapicot.cl
        </a>
      </div>
    </>
  )
}
