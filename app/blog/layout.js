export const metadata = {
  title: 'Blog Kuliner - Pisang Ijo Evi | Tips & Resep Makassar',
  description: 'Baca artikel menarik tentang kuliner Makassar, tips menikmati Es Pisang Ijo, resep tradisional, dan cerita kuliner Sulawesi Selatan di blog Pisang Ijo Evi.',
  keywords: [
    'blog kuliner makassar',
    'artikel pisang ijo',
    'tips dessert makassar',
    'resep pisang ijo',
    'cerita kuliner sulawesi',
    'food blog indonesia',
    'tradisi kuliner makassar',
    'pisang ijo evi blog'
  ],
  openGraph: {
    title: 'Blog Kuliner - Pisang Ijo Evi | Tips & Resep',
    description: 'Temukan artikel menarik tentang kuliner Makassar, tips menikmati Es Pisang Ijo, dan cerita tradisi kuliner Sulawesi.',
    url: 'https://pisangijoevi.web.id/blog',
    type: 'website',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Kuliner - Pisang Ijo Evi',
    description: 'Artikel menarik tentang kuliner Makassar dan Es Pisang Ijo tradisional.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogLayout({ children }) {
  return children;
}