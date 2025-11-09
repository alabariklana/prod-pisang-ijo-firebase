export const metadata = {
  title: 'Kontak Kami - Pisang Ijo Evi | Hubungi & Lokasi Makassar',
  description: 'Hubungi Pisang Ijo Evi untuk informasi dan pemesanan Es Pisang Ijo khas Makassar. Dapatkan alamat lengkap, nomor WhatsApp, dan cara mudah menghubungi kami.',
  keywords: [
    'kontak pisang ijo evi',
    'alamat pisang ijo makassar',
    'whatsapp pisang ijo evi',
    'lokasi dessert makassar',
    'hubungi pisang ijo evi',
    'telepon pisang ijo makassar',
    'customer service dessert'
  ],
  openGraph: {
    title: 'Kontak Kami - Pisang Ijo Evi | Lokasi Makassar',
    description: 'Hubungi kami untuk informasi dan pemesanan Es Pisang Ijo khas Makassar. Lokasi mudah dijangkau di Makassar.',
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