export const metadata = {
  title: 'Daftar Akun - Pisang Ijo Evi Makassar',
  description: 'Daftar akun baru di Pisang Ijo Evi untuk mendapatkan akses eksklusif, promo khusus, dan kemudahan dalam memesan Es Pisang Ijo khas Makassar.',
  keywords: [
    'daftar akun pisang ijo',
    'signup pisang ijo evi',
    'registrasi pelanggan makassar',
    'buat akun dessert',
    'member pisang ijo evi'
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Daftar Akun - Pisang Ijo Evi Makassar',
    description: 'Bergabunglah dengan Pisang Ijo Evi! Daftar akun untuk mendapatkan promo eksklusif dan kemudahan pemesanan.',
    url: 'https://pisangijoevi.web.id/signup',
    type: 'website',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daftar Akun - Pisang Ijo Evi Makassar',
    description: 'Bergabunglah dengan Pisang Ijo Evi! Daftar untuk mendapatkan promo eksklusif.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/signup',
  },
};

export default function SignupLayout({ children }) {
  return children;
}