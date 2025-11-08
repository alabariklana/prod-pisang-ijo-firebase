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
  title: 'Pisang Ijo Evi - Es Pisang Ijo Makassar',
  description: 'Website resmi Pisang Ijo Evi - Es Pisang Ijo khas Makassar yang lezat dan segar',
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
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={`${playfairDisplay.variable} ${poppins.variable}`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}