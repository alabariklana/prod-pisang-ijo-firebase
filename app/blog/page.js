import { Suspense } from 'react';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Search, Calendar, User, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { connectToDatabase } from '@/lib/mongodb';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Blog - Pisang Ijo Evi | Resep, Tips & Cerita Kuliner',
  description: 'Kumpulan artikel, resep, tips & trik, dan cerita seputar kuliner tradisional Makassar. Temukan inspirasi masakan dan informasi menarik di blog Pisang Ijo Evi.',
  keywords: ['blog kuliner', 'resep pisang ijo', 'tips masak', 'kuliner makassar', 'resep tradisional'],
  openGraph: {
    title: 'Blog - Pisang Ijo Evi',
    description: 'Artikel, resep, dan cerita kuliner tradisional Makassar',
    type: 'website',
  }
};

function getBaseUrl() {
  try {
    const h = headers();
    const getHeader = (key) =>
      typeof h?.get === 'function' ? h.get(key) : h?.[key] ?? h?.[key?.toLowerCase?.()] ?? undefined;
    const host = getHeader('x-forwarded-host') || getHeader('host') || process.env.VERCEL_URL || 'localhost:3000';
    const proto = getHeader('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http');
    return `${proto}://${host}`;
  } catch {
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }
}

function stripMarkdown(text = '') {
  return text
    .replace(/\!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[[^\]]*\]\([^)]*\)/g, '$1') // links [text](url) -> text
    .replace(/[`*_~>#-]/g, '') // md syntax chars
    .replace(/^\s*\d+\.\s+/gm, '') // ordered list markers
    .replace(/^\s*[-*+]\s+/gm, '') // unordered list markers
    .replace(/\s+/g, ' ') // collapse spaces
    .trim();
}

async function getBlogPosts(searchParams) {
  try {
    const resolvedParams = await searchParams;
    const page = Number(resolvedParams?.page || 1);
    const limit = Number(resolvedParams?.limit || 12);
    const category = resolvedParams?.category || '';
    const search = resolvedParams?.search || '';
    const skip = (page - 1) * limit;

    const { db } = await connectToDatabase();
    const filter = {
      status: 'published',
      ...(category ? { category } : {}),
      ...(search
        ? {
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { excerpt: { $regex: search, $options: 'i' } },
              { content: { $regex: search, $options: 'i' } },
            ],
          }
        : {}),
    };

    const cursor = db
      .collection('blog_posts')
      .find(filter)
      .project({
        title: 1,
        slug: 1,
        excerpt: 1,
        featuredImage: 1,
        category: 1,
        tags: 1,
        createdAt: 1,
        publishedAt: 1,
        views: 1,
        seo: 1,
      })
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const [items, total] = await Promise.all([
      cursor.toArray(),
      db.collection('blog_posts').countDocuments(filter),
    ]);

    return {
      posts: items,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { posts: [], pagination: { total: 0, page: 1, pages: 0, limit: 12 } };
  }
}

async function getCategories() {
  try {
    const { db } = await connectToDatabase();
    const categories = await db
      .collection('blog_posts')
      .distinct('category', { status: 'published', category: { $exists: true, $ne: '' } });
    return { categories };
  } catch (error) {
    return { categories: [] };
  }
}

export default async function BlogPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const { posts, pagination } = await getBlogPosts(searchParams);
  const { categories } = await getCategories();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div style={{ fontFamily: 'var(--font-poppins)', backgroundColor: '#EBDEC5', minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="py-20 px-4" style={{ backgroundColor: '#214929' }}>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
            📰 Blog Pisang Ijo Evi
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Kumpulan artikel, resep, tips & trik, dan cerita seputar kuliner tradisional Makassar
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Categories Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/blog"
              className={`px-4 py-2 rounded-full transition-colors ${
                !resolvedSearchParams.category
                  ? 'text-white'
                  : 'bg-white hover:bg-gray-100'
              }`}
              style={!resolvedSearchParams.category ? { backgroundColor: '#214929' } : { color: '#214929' }}
            >
              Semua
            </Link>
            {categories.map(cat => (
              <Link
                key={cat}
                href={`/blog?category=${cat}`}
                className={`px-4 py-2 rounded-full transition-colors ${
                  resolvedSearchParams.category === cat
                    ? 'text-white'
                    : 'bg-white hover:bg-gray-100'
                }`}
                style={resolvedSearchParams.category === cat ? { backgroundColor: '#214929' } : { color: '#214929' }}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl mb-4" style={{ color: '#214929' }}>
              📝 Belum ada artikel
            </p>
            <p className="text-gray-600">
              {resolvedSearchParams.search || resolvedSearchParams.category 
                ? 'Tidak ada artikel yang cocok dengan pencarian Anda'
                : 'Artikel akan segera hadir'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                {/* Featured Image */}
                {post.featuredImage ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                    <div
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: '#FCD900', color: '#214929' }}
                    >
                      {post.category}
                    </div>
                  </div>
                ) : (
                  <div
                    className="h-48 flex items-center justify-center"
                    style={{ backgroundColor: '#EBDEC5' }}
                  >
                    <span className="text-6xl">📝</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h2
                    className="text-xl font-bold mb-2 line-clamp-2 hover:underline"
                    style={{ color: '#214929', fontFamily: 'var(--font-playfair)' }}
                  >
                    {post.title}
                  </h2>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt || stripMarkdown(post.content).substring(0, 150)}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{post.author}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ backgroundColor: '#EBDEC5', color: '#214929' }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Read More */}
                  <div
                    className="text-sm font-medium inline-block"
                    style={{ color: '#214929' }}
                  >
                    Baca Selengkapnya →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
              <Link
                key={page}
                href={`/blog?page=${page}${resolvedSearchParams.category ? `&category=${resolvedSearchParams.category}` : ''}${resolvedSearchParams.search ? `&search=${resolvedSearchParams.search}` : ''}`}
                className={`px-4 py-2 rounded-md transition-colors ${
                  (resolvedSearchParams.page || '1') === page.toString()
                    ? 'text-white'
                    : 'bg-white hover:bg-gray-100'
                }`}
                style={(resolvedSearchParams.page || '1') === page.toString() ? { backgroundColor: '#214929' } : { color: '#214929' }}
              >
                {page}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
