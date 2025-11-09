export const metadata = {
  title: 'Login - Pisang Ijo Evi Makassar',
  description: 'Masuk ke akun Anda untuk mengakses fitur eksklusif Pisang Ijo Evi. Login sebagai pelanggan atau admin untuk mengelola pesanan dan data.',
  keywords: [
    'login pisang ijo evi',
    'masuk akun dessert',
    'login pelanggan makassar',
    'sign in pisang ijo',
    'akses akun kuliner'
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Login - Pisang Ijo Evi Makassar',
    description: 'Masuk ke akun Anda untuk mengakses fitur eksklusif dan mengelola pesanan Es Pisang Ijo.',
    url: 'https://pisangijoevi.web.id/login',
    type: 'website',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Login - Pisang Ijo Evi Makassar',
    description: 'Masuk ke akun Anda untuk mengakses fitur eksklusif Pisang Ijo Evi.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/login',
  },
};

export default function LoginLayout({ children }) {
  return children;
}