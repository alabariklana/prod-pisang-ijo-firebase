export const metadata = {
  title: 'Kontak Kami - Pisang Ijo Evi | Hubungi & Lokasi',
  description: 'Hubungi Pisang Ijo Evi untuk informasi pemesanan Es Pisang Ijo khas Makassar. Temukan lokasi, nomor telepon, dan email kami.',
  keywords: [
    'kontak pisang ijo evi',
    'alamat pisang ijo makassar',
    'telepon pisang ijo evi',
    'lokasi dessert makassar',
    'hubungi pisang ijo evi',
    'pesan pisang ijo makassar'
  ],
  openGraph: {
    title: 'Kontak Kami - Pisang Ijo Evi',
    description: 'Hubungi kami untuk informasi dan pemesanan Es Pisang Ijo khas Makassar.',
    url: 'https://pisangijoevi.web.id/kontak',
    type: 'website',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kontak Kami - Pisang Ijo Evi',
    description: 'Hubungi kami untuk informasi dan pemesanan Es Pisang Ijo khas Makassar.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/kontak',
  },
};

export default function KontakLayout({ children }) {
  return children;
}