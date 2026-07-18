import Link from 'next/link'
import { LogoFull } from '@/components/layout/Logo'
import CookieBanner from '@/components/marketing/CookieBanner'

export default function MarketingLayout({ children }) {
  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-paper-deep bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
        <div className="container-section flex items-center justify-between py-3">
          <Link href="/" className="shrink-0">
            <LogoFull className="h-7" />
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/#como-funciona"
              className="hidden text-sm font-medium text-ink-soft hover:text-brand sm:block"
            >
              Cómo funciona
            </Link>
            <Link
              href="/#beneficios"
              className="hidden text-sm font-medium text-ink-soft hover:text-brand sm:block"
            >
              Beneficios
            </Link>
            <Link
              href="/blog"
              className="hidden text-sm font-medium text-ink-soft hover:text-brand sm:block"
            >
              Blog
            </Link>
            <Link
              href="/precios"
              className="hidden text-sm font-medium text-ink-soft hover:text-brand sm:block"
            >
              Precios
            </Link>
            <Link
              href="/faq"
              className="hidden text-sm font-medium text-ink-soft hover:text-brand sm:block"
            >
              FAQ
            </Link>
            <Link
              href="/contacto"
              className="hidden text-sm font-medium text-ink-soft hover:text-brand sm:block"
            >
              Contacto
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft hover:bg-paper-deep"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
              >
                Crear cuenta
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-paper-deep bg-paper-deep">
        <div className="container-section py-12">
          <div className="grid gap-8 sm:grid-cols-4">
            <div className="sm:col-span-1">
              <LogoFull className="h-7 mb-3" />
              <p className="text-sm text-ink-soft">
                Cotizaciones profesionales para tu pyme, sin Excel ni errores.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-ink">Producto</h3>
              <ul className="space-y-2 text-sm text-ink-soft">
                <li>
                  <Link href="/#como-funciona" className="hover:text-brand">
                    Cómo funciona
                  </Link>
                </li>
                <li>
                  <Link href="/#beneficios" className="hover:text-brand">
                    Beneficios
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-brand">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-brand">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/precios" className="hover:text-brand">
                    Precios
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-ink">Legal</h3>
              <ul className="space-y-2 text-sm text-ink-soft">
                <li>
                  <Link href="/privacidad" className="hover:text-brand">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/terminos" className="hover:text-brand">
                    Términos
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-brand">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-ink">Contacto</h3>
              <ul className="space-y-2 text-sm text-ink-soft">
                <li>
                  <Link href="/contacto" className="hover:text-brand">
                    Escríbenos
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:hola@rapicot.cl"
                    className="hover:text-brand"
                  >
                    hola@rapicot.cl
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-paper-deep pt-6 text-center text-xs text-ink-soft">
            &copy; {new Date().getFullYear()} Rapicot. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      <CookieBanner />
    </>
  )
}
