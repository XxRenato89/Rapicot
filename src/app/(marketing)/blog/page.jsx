import Link from 'next/link'
import { posts } from '@/data/blog'

export const metadata = {
  title: 'Blog',
  description:
    'Consejos y guías para crear cotizaciones profesionales y hacer crecer tu pyme.',
  openGraph: {
    title: 'Blog — Rapicot',
    description:
      'Consejos y guías para crear cotizaciones profesionales y hacer crecer tu pyme.',
    url: 'https://rapicot.cl/blog',
    siteName: 'Rapicot',
    images: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="%230D6B56"/><text x="600" y="280" font-family="Instrument Serif, serif" font-size="56" font-weight="bold" fill="white" text-anchor="middle">Blog Rapicot</text><text x="600" y="350" font-family="Geist, sans-serif" font-size="28" fill="%23D1F0EA" text-anchor="middle">Consejos para tu pyme</text></svg>',
        width: 1200,
        height: 630,
        alt: 'Blog Rapicot',
      },
    ],
    locale: 'es_CL',
    type: 'website',
  },
  alternates: {
    canonical: 'https://rapicot.cl/blog',
  },
}

export default function BlogPage() {
  return (
    <div className="px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">Blog</h1>
          <p className="mt-3 text-ink-soft">
            Consejos y guías para crear cotizaciones profesionales y hacer crecer
            tu pyme.
          </p>
        </div>

        <div className="mt-12 grid gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-2xl border border-paper-deep bg-paper p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl font-semibold text-brand hover:underline">
                  {post.title}
                </h2>
              </Link>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {post.excerpt}
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs text-ink-soft/60">
                <time>{post.date}</time>
                <span className="text-paper-deep">&middot;</span>
                <span>{post.author}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
