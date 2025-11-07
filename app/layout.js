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
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${playfairDisplay.variable} ${poppins.variable}`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}