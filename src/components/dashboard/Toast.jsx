'use client'

import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(() => {})

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg animate-in-slide ${
              t.type === 'success'
                ? 'border-brand-light bg-brand-light text-brand'
                : t.type === 'error'
                  ? 'border-red-100 bg-red-50 text-red-700'
                  : t.type === 'warning'
                    ? 'border-yellow-100 bg-yellow-50 text-yellow-700'
                    : t.type === 'celebration'
                      ? 'border-accent-light bg-accent-light text-accent'
                      : 'border-zinc-200 bg-white text-zinc-700'
            }`}
          >
            <span className="mt-0.5 shrink-0">
              {t.type === 'success' && (
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M6 10l3 3 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              )}
              {t.type === 'error' && (
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6v4m0 4h.01" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
              )}
              {t.type === 'celebration' && (
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 12a1 1 0 110-2 1 1 0 010 2zm0-4a1 1 0 01-1-1V7a1 1 0 012 0v2a1 1 0 01-1 1z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
              )}
            </span>
            <p className="flex-1 text-sm">{t.message}</p>
            <button onClick={() => remove(t.id)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
