import './globals.css'
import { Toaster } from 'sonner'
import { Playfair_Display, Poppins } from 'next/font/google'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata = {
  title: 'Pisang Ijo Evi – Dessert Khas Makassar Asli',
  description: 'Nikmati kelezatan Es Pisang Ijo khas Makassar dari Pisang Ijo Evi. Dessert lembut, manis, dan autentik yang cocok untuk semua momen. Pesan sekarang!',
  keywords: [
    'es pisang ijo',
    'pisang ijo makassar',
    'dessert makassar', 
    'kuliner sulawesi selatan',
    'makanan khas makassar',
    'es tradisional',
    'pisang ijo evi',
    'kuliner indonesia',
    'dessert indonesia',
    'makanan manis makassar'
  ],
  authors: [{ name: 'Pisang Ijo Evi' }],
  creator: 'Pisang Ijo Evi',
  publisher: 'Pisang Ijo Evi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://pisangijoevi.web.id'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Pisang Ijo Evi – Dessert Khas Makassar Asli',
    description: 'Es Pisang Ijo lembut dan manis khas Makassar. Rasakan kelezatannya dari Pisang Ijo Evi.',
    url: 'https://pisangijoevi.web.id/',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Pisang Ijo Evi',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pisang Ijo Evi - Es Pisang Ijo Khas Makassar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pisang Ijo Evi – Dessert Khas Makassar Asli',
    description: 'Es Pisang Ijo lembut dan manis khas Makassar. Rasakan kelezatannya dari Pisang Ijo Evi.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  verification: {
    google: 'kO0UqVWbbs3EBR8lCNzPoeWGhu3DQ7GMQYM8WOYOpfU', // Google Search Console verification untuk pisangijoevi.web.id
  },
}

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Pisang Ijo Evi",
    "image": [
      "https://pisangijoevi.web.id/og-image.jpg"
    ],
    "description": "Es Pisang Ijo khas Makassar yang lezat dan autentik. Dessert tradisional Indonesia dengan cita rasa yang menyegarkan.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "",
      "addressLocality": "Makassar",
      "addressRegion": "Sulawesi Selatan",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -5.1477,
      "longitude": 119.4327
    },
    "url": "https://pisangijoevi.web.id",
    "telephone": "+62 822-6088-9787",
    "priceRange": "$$",
    "servesCuisine": "Indonesian",
    "menu": "https://pisangijoevi.web.id/menu",
    "sameAs": [
      "https://www.facebook.com/pisangijoevi",
      "https://www.instagram.com/pisangijoevi"
    ]
  };

  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${playfairDisplay.variable} ${poppins.variable}`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}