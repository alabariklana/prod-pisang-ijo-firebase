export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pisangijoevi.web.id';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/admin/',
          '/member/',
          '/login',
          '/signup',
          '/forgot-password',
          '/_next/',
          '/static/',
          '/uploads/',
        ],
      },
      // Specific rules for search engines
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/admin/',
          '/member/',
          '/login',
          '/signup',
          '/forgot-password',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/admin/',
          '/member/',
          '/login',
          '/signup',
          '/forgot-password',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}