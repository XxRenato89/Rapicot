import { notFound } from 'next/navigation'
import Link from 'next/link'
import { posts } from '@/data/blog'

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} — Blog Rapicot`,
      description: post.excerpt,
      url: `https://rapicot.cl/blog/${slug}`,
      siteName: 'Rapicot',
      locale: 'es_CL',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    alternates: {
      canonical: `https://rapicot.cl/blog/${slug}`,
    },
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-2">
          <Link
            href="/blog"
            className="text-sm font-medium text-ink-soft hover:text-brand"
          >
            &larr; Volver al blog
          </Link>
        </div>
        <div className="flex items-center gap-3 text-sm text-ink-soft/60">
          <time>{post.date}</time>
          <span className="text-paper-deep">&middot;</span>
          <span>{post.author}</span>
        </div>
        <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-10 space-y-5 leading-relaxed text-ink-soft [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_strong]:text-ink [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_a]:text-brand [&_a]:underline">
          {post.content}
        </div>
      </div>
    </article>
  )
}
