export const metadata = {
  title: 'Tentang Kami - Pisang Ijo Evi | Sejarah & Tradisi Makassar',
  description: 'Kenali cerita di balik Pisang Ijo Evi, usaha keluarga yang melestarikan tradisi Es Pisang Ijo khas Makassar dengan resep turun temurun dan cita rasa autentik.',
  keywords: [
    'tentang pisang ijo evi',
    'sejarah pisang ijo makassar',
    'profil usaha kuliner',
    'cerita pisang ijo evi',
    'kuliner keluarga makassar',
    'tradisi pisang ijo',
    'resep turun temurun',
    'warisan kuliner sulawesi'
  ],
  openGraph: {
    title: 'Tentang Kami - Pisang Ijo Evi | Sejarah & Tradisi',
    description: 'Usaha keluarga yang melestarikan tradisi Es Pisang Ijo khas Makassar dengan resep turun temurun dan cita rasa autentik.',
    url: 'https://pisangijoevi.web.id/tentang',
    type: 'website',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tentang Kami - Pisang Ijo Evi',
    description: 'Usaha keluarga yang melestarikan tradisi Es Pisang Ijo khas Makassar dengan resep turun temurun.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/tentang',
  },
};

export default function TentangLayout({ children }) {
  return children;
}