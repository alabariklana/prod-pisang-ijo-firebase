import { connectToDatabase } from '@/lib/mongodb';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pisangijoevi.web.id';

export default async function sitemap() {
  try {
    // Static pages
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/tentang`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/menu`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/kontak`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/pesan`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/cara-pemesanan`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
    ];

    let dynamicPages = [];

    try {
      const { db } = await connectToDatabase();
      
      // Get published blog posts
      const blogPosts = await db.collection('blog_posts')
        .find({ status: 'published' })
        .sort({ publishedAt: -1 })
        .toArray();

      // Generate sitemap entries for blog posts
      const blogPages = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt || post.publishedAt || post.createdAt,
        changeFrequency: 'weekly',
        priority: 0.7,
      }));

      // Get blog categories (if you have them)
      const categories = await db.collection('blog_posts').distinct('category', { 
        status: 'published' 
      });

      const categoryPages = categories.map((category) => ({
        url: `${baseUrl}/blog/categories?category=${encodeURIComponent(category)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      }));

      // Get published products/menu items (if you have them)
      let productPages = [];
      try {
        const products = await db.collection('products')
          .find({ status: 'active' })
          .sort({ createdAt: -1 })
          .toArray();

        productPages = products.map((product) => ({
          url: `${baseUrl}/menu/${product.slug}`,
          lastModified: product.updatedAt || product.createdAt,
          changeFrequency: 'weekly',
          priority: 0.8,
        }));
      } catch (productError) {
        console.log('No products collection found, skipping product pages');
      }

      dynamicPages = [...blogPages, ...categoryPages, ...productPages];

    } catch (dbError) {
      console.error('Database connection failed for sitemap generation:', dbError);
      // If DB fails, return static pages only
    }

    return [...staticPages, ...dynamicPages];

  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Fallback to static pages only
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/tentang`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/menu`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/kontak`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
    ];
  }
}