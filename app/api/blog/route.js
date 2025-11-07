import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// GET - List all blog posts (with filters)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // 'published', 'draft', 'all'
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    const { db } = await connectToDatabase();
    
    // Build filter
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await db.collection('blog_posts')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection('blog_posts').countDocuments(filter);

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST - Create new blog post
export async function POST(req) {
  try {
    const data = await req.json();
    const { db } = await connectToDatabase();

    // Generate slug from title if not provided
    let slug = data.slug || data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingPost = await db.collection('blog_posts').findOne({ slug });
    if (existingPost) {
      // Add timestamp to make it unique
      slug = `${slug}-${Date.now()}`;
    }

    const newPost = {
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt || data.content.substring(0, 160),
      featuredImage: data.featuredImage || null,
      category: data.category || 'Uncategorized',
      tags: data.tags || [],
      status: data.status || 'draft', // 'draft' or 'published'
      
      // SEO Fields
      seo: {
        metaTitle: data.seo?.metaTitle || data.title,
        metaDescription: data.seo?.metaDescription || data.excerpt || data.content.substring(0, 160),
        keywords: data.seo?.keywords || [],
        canonicalUrl: data.seo?.canonicalUrl || '',
        robotsTag: data.seo?.robotsTag || 'index, follow',
        robotsMeta: data.seo?.robotsMeta || 'index, follow',
        ogTitle: data.seo?.ogTitle || data.title,
        ogDescription: data.seo?.ogDescription || data.excerpt,
        ogImage: data.seo?.ogImage || data.featuredImage,
        ogType: data.seo?.ogType || 'article',
        twitterCard: data.seo?.twitterCard || 'summary_large_image',
        twitterTitle: data.seo?.twitterTitle || data.title,
        twitterDescription: data.seo?.twitterDescription || data.excerpt,
        twitterImage: data.seo?.twitterImage || data.featuredImage,
        author: data.seo?.author || 'Pisang Ijo Evi',
        publisher: data.seo?.publisher || 'Pisang Ijo Evi',
        structuredData: data.seo?.structuredData || null
      },

      author: data.author || 'Admin',
      publishedAt: data.status === 'published' ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      likes: 0
    };

    const result = await db.collection('blog_posts').insertOne(newPost);

    return NextResponse.json({
      success: true,
      post: { ...newPost, _id: result.insertedId }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
