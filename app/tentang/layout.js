export const metadata = {
  title: 'Tentang Kami - Pisang Ijo Evi | Sejarah & Cerita',
  description: 'Pelajari sejarah dan cerita di balik Pisang Ijo Evi. Usaha keluarga yang menyajikan Es Pisang Ijo autentik khas Makassar sejak bertahun-tahun.',
  keywords: [
    'tentang pisang ijo evi',
    'sejarah pisang ijo makassar',
    'profil usaha kuliner',
    'cerita pisang ijo evi',
    'kuliner keluarga makassar',
    'tradisi pisang ijo'
  ],
  openGraph: {
    title: 'Tentang Kami - Pisang Ijo Evi',
    description: 'Usaha keluarga yang menyajikan Es Pisang Ijo autentik khas Makassar dengan resep turun temurun.',
    url: 'https://pisangijoevi.web.id/tentang',
    type: 'website',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tentang Kami - Pisang Ijo Evi',
    description: 'Usaha keluarga yang menyajikan Es Pisang Ijo autentik khas Makassar.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/tentang',
  },
};

export default function TentangLayout({ children }) {
  return children;
}