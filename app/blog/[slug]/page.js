import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import { Calendar, User, Eye, ArrowLeft, Facebook, Instagram } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { optimizeImageUrl } from '@/lib/imageOptimizer';
import FacebookComments from '@/components/FacebookComments';

// Generate metadata for SEO
function getBaseUrl() {
  // First, check if NEXT_PUBLIC_APP_URL is set
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // Fallback to headers
  try {
    const h = headers();
    const getHeader = (key) =>
      typeof h?.get === 'function' ? h.get(key) : h?.[key] ?? h?.[key?.toLowerCase?.()] ?? undefined;
    const host = getHeader('x-forwarded-host') || getHeader('host') || 'localhost:3000';
    const proto = getHeader('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http');
    return `${proto}://${host}`;
  } catch {
    return 'http://localhost:3000';
  }
}

export async function generateMetadata({ params, searchParams }) {
  try {
    const { slug } = await params;
    const preview = (await searchParams)?.preview === '1';
    const { db } = await connectToDatabase();
    const post = await db.collection('blog_posts').findOne({ slug });
    if (!post) return { title: 'Artikel Tidak Ditemukan' };
    const seo = post.seo || {};

    // If draft and not in preview, use minimal metadata
    const isDraft = post.status !== 'published';
    const noIndex = isDraft || (seo.robotsTag && seo.robotsTag.includes('noindex'));

    return {
      title: `${seo.metaTitle || post.title}${preview && isDraft ? ' (Draft Preview)' : ''}`,
      description: seo.metaDescription || post.excerpt || post.content.substring(0, 160),
      keywords: seo.keywords || [],
      authors: [{ name: seo.author || post.author }],
      publisher: seo.publisher || 'Pisang Ijo Evi',
      robots: {
        index: !noIndex,
        follow: seo.robotsTag?.includes('nofollow') ? false : true,
      },
      alternates: {
        canonical: seo.canonicalUrl || `${getBaseUrl()}/blog/${post.slug}`
      },
      openGraph: {
        title: seo.ogTitle || post.title,
        description: seo.ogDescription || post.excerpt,
        images: [seo.ogImage || post.featuredImage],
        type: seo.ogType || 'article',
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        authors: [seo.author || post.author],
        tags: post.tags || [],
      },
      twitter: {
        card: seo.twitterCard || 'summary_large_image',
        title: seo.twitterTitle || post.title,
        description: seo.twitterDescription || post.excerpt,
        images: [seo.twitterImage || post.featuredImage],
      },
    };
  } catch (error) {
    return { title: 'Error Loading Article' };
  }
}

async function getBlogPost(slug, { increment = true } = {}) {
  try {
    const { db } = await connectToDatabase();
    const post = await db.collection('blog_posts').findOne({ slug });
    if (post && increment && post.status === 'published') {
      await db.collection('blog_posts').updateOne({ _id: post._id }, { $inc: { views: 1 } });
    }
    return post;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export default async function BlogDetailPage({ params, searchParams }) {
  const { slug } = await params;
  const preview = (await searchParams)?.preview === '1';
  const post = await getBlogPost(slug, { increment: !preview });

  if (!post || (post.status !== 'published' && !preview)) {
    notFound();
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const shareUrl = `${getBaseUrl()}/blog/${post.slug}`;
  const shareTitle = encodeURIComponent(post.title);

  // Generate JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt || post.content.substring(0, 160),
    "image": post.featuredImage,
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": post.seo?.author || post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": post.seo?.publisher || "Pisang Ijo Evi",
      "logo": {
        "@type": "ImageObject",
        "url": `${getBaseUrl()}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": shareUrl
    }
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div style={{ fontFamily: 'var(--font-poppins)', backgroundColor: '#EBDEC5', minHeight: '100vh' }}>
        {/* Preview Banner */}
        {post.status !== 'published' && (
          <div className="text-center py-2 text-white" style={{ backgroundColor: '#b45309' }}>
            Anda sedang melihat draft (preview). Artikel ini belum dipublish.
          </div>
        )}
        {/* Article Header */}
        <div className="py-12 px-4" style={{ backgroundColor: '#214929' }}>
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Kembali ke Blog</span>
            </Link>

            {/* Category */}
            <div className="mb-4">
              <span
                className="inline-block px-4 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: '#FCD900', color: '#214929' }}
              >
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={18} />
                <span>{post.views || 0} views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="max-w-5xl mx-auto px-4 -mt-8">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Excerpt */}
          {post.excerpt && (
            <div
              className="text-xl italic mb-8 p-6 rounded-lg border-l-4"
              style={{ backgroundColor: 'white', borderColor: '#214929', color: '#666' }}
            >
              {post.excerpt}
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none bg-white p-8 md:p-12 rounded-lg shadow-md"
            style={{ color: '#333', lineHeight: '1.8' }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1
                    {...props}
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      color: '#214929',
                      fontSize: '2.25em',
                      fontWeight: '700',
                      lineHeight: '1.2',
                      marginTop: '1.5em',
                      marginBottom: '0.8em',
                    }}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    {...props}
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      color: '#214929',
                      fontSize: '1.875em',
                      fontWeight: '700',
                      lineHeight: '1.3',
                      marginTop: '1.4em',
                      marginBottom: '0.7em',
                    }}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    {...props}
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      color: '#214929',
                      fontSize: '1.5em',
                      fontWeight: '600',
                      lineHeight: '1.4',
                      marginTop: '1.2em',
                      marginBottom: '0.6em',
                    }}
                  />
                ),
                h4: ({ node, ...props }) => (
                  <h4
                    {...props}
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      color: '#214929',
                      fontSize: '1.25em',
                      fontWeight: '600',
                      lineHeight: '1.4',
                      marginTop: '1em',
                      marginBottom: '0.5em',
                    }}
                  />
                ),
                p: ({ node, ...props }) => (
                  <p
                    {...props}
                    style={{
                      marginBottom: '1.5em',
                      fontSize: '1.125rem',
                      lineHeight: '1.8',
                      color: '#374151',
                    }}
                  />
                ),
                ul: ({ node, ...props }) => (
                  <ul
                    {...props}
                    style={{
                      marginBottom: '1.5em',
                      marginTop: '1em',
                      paddingLeft: '1.5em',
                      listStyleType: 'disc',
                    }}
                  />
                ),
                ol: ({ node, ...props }) => (
                  <ol
                    {...props}
                    style={{
                      marginBottom: '1.5em',
                      marginTop: '1em',
                      paddingLeft: '1.5em',
                      listStyleType: 'decimal',
                    }}
                  />
                ),
                li: ({ node, ...props }) => (
                  <li
                    {...props}
                    style={{
                      marginBottom: '0.5em',
                      lineHeight: '1.8',
                    }}
                  />
                ),
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    className="underline hover:no-underline transition-all"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    style={{ color: '#214929', fontWeight: '500' }}
                  />
                ),
                img: ({ node, ...props }) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    {...props}
                    alt={props.alt || ''}
                    className="rounded-md my-6"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    {...props}
                    className="italic border-l-4 pl-6 py-2"
                    style={{
                      borderColor: '#214929',
                      color: '#475569',
                      marginTop: '1.5em',
                      marginBottom: '1.5em',
                      backgroundColor: '#f9fafb',
                      fontSize: '1.1rem',
                    }}
                  />
                ),
                code: ({ node, inline, className, children, ...props }) => (
                  <code
                    className={className}
                    {...props}
                    style={{
                      background: inline ? '#f1f5f9' : '#1e293b',
                      color: inline ? '#1e293b' : '#e2e8f0',
                      padding: inline ? '3px 8px' : '1em',
                      borderRadius: 6,
                      fontSize: inline ? '0.9em' : '0.95em',
                      fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                      display: inline ? 'inline' : 'block',
                      marginTop: inline ? 0 : '1em',
                      marginBottom: inline ? 0 : '1em',
                      overflowX: 'auto',
                    }}
                  >
                    {children}
                  </code>
                ),
                strong: ({ node, ...props }) => (
                  <strong {...props} style={{ fontWeight: '700', color: '#1f2937' }} />
                ),
                em: ({ node, ...props }) => (
                  <em {...props} style={{ fontStyle: 'italic', color: '#374151' }} />
                ),
                hr: ({ node, ...props }) => (
                  <hr
                    {...props}
                    style={{
                      border: 'none',
                      borderTop: '2px solid #e5e7eb',
                      marginTop: '2em',
                      marginBottom: '2em',
                    }}
                  />
                ),
              }}
            >
              {post.content || ''}
            </ReactMarkdown>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-base font-semibold mb-3" style={{ color: '#214929' }}>Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{ backgroundColor: '#FCD900', color: '#214929' }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share icons inline */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center gap-3">
              <span className="text-sm font-medium" style={{ color: '#214929' }}>Share to:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bagikan ke Facebook"
                className="h-8 w-8 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-85"
                style={{ backgroundColor: '#1877F2' }}
                title="Bagikan ke Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bagikan ke WhatsApp"
                className="h-8 w-8 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-85"
                style={{ backgroundColor: '#25D366' }}
                title="Bagikan ke WhatsApp"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M20.52 3.48A11.86 11.86 0 0012.06 0C5.59 0 .35 5.16.35 11.56c0 2.04.54 4.02 1.57 5.77L0 24l6.86-1.8a11.9 11.9 0 005.2 1.23h.01c6.47 0 11.71-5.16 11.71-11.56 0-3.09-1.23-5.99-3.26-8.39zM12.06 21.3c-1.8 0-3.57-.48-5.13-1.38l-.37-.21-4.07 1.07 1.09-3.93-.24-.4A9.58 9.58 0 012.3 11.56c0-5.26 4.33-9.53 9.76-9.53 2.6 0 5.03 1 6.86 2.83a9.42 9.42 0 012.87 6.7c0 5.26-4.33 9.53-9.76 9.53zm5.52-7.23c-.3-.15-1.78-.88-2.06-.98-.28-.1-.49-.15-.69.15-.2.3-.79.98-.97 1.18-.18.2-.36.23-.66.08-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.36.45-.54.15-.18.2-.3.3-.5.1-.23.05-.43-.03-.61-.08-.15-.69-1.66-.94-2.28-.25-.6-.51-.5-.69-.51h-.59c-.2 0-.51.08-.78.38-.27.3-1.03 1-1.03 2.44s1.05 2.84 1.2 3.04c.15.2 2.07 3.15 5.02 4.31.7.3 1.25.48 1.68.61.7.22 1.34.19 1.85.12.56-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.08-.13-.28-.2-.58-.35z" />
                </svg>
              </a>
              <a
                href={`https://www.instagram.com/`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bagikan ke Instagram"
                className="h-8 w-8 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-85"
                style={{ background: 'radial-gradient(30% 30% at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}
                title="Buka Instagram"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Facebook Comments Section */}
          <div className="mt-12 p-6 rounded-lg" style={{ backgroundColor: 'white' }}>
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#214929', fontFamily: 'var(--font-playfair)' }}>
              💬 Komentar
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Silakan berbagi pendapat Anda tentang artikel ini. Login dengan Facebook untuk berkomentar.
            </p>
            <FacebookComments url={shareUrl} numPosts={10} />
          </div>

          {/* Back to Blog */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-white font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#214929' }}
            >
              <ArrowLeft size={20} />
              <span>Lihat Artikel Lainnya</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
