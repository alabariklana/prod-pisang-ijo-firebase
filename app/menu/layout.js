export const metadata = {
  title: 'Menu Es Pisang Ijo - Pisang Ijo Evi Makassar',
  description: 'Lihat menu lengkap Es Pisang Ijo dan varian dessert khas Makassar dari Pisang Ijo Evi. Pilih favorit Anda dan pesan sekarang juga!',
  keywords: [
    'menu pisang ijo',
    'daftar harga pisang ijo',
    'es pisang ijo makassar',
    'menu dessert makassar',
    'harga es pisang ijo',
    'kuliner makassar',
    'pisang ijo evi menu'
  ],
  openGraph: {
    title: 'Menu Es Pisang Ijo - Pisang Ijo Evi',
    description: 'Lihat menu lengkap Es Pisang Ijo dan varian dessert khas Makassar. Pesan favorit Anda sekarang!',
    url: 'https://pisangijoevi.web.id/menu',
    type: 'website',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Menu Es Pisang Ijo - Pisang Ijo Evi',
    description: 'Lihat menu lengkap Es Pisang Ijo dan varian dessert khas Makassar.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/menu',
  },
};

export default function MenuLayout({ children }) {
  return children;
}