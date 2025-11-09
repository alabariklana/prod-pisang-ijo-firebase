'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, MessageCircle, CreditCard, Package } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CaraPemesananPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#214929] to-[#2d6b3a] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-4">
            Cara Pemesanan
          </h1>
          <p className="text-lg md:text-xl text-gray-200">
            Mudah dan cepat! Ikuti langkah-langkah berikut untuk memesan Pisang Ijo favoritmu
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Step 1 */}
          <Card className="border-2 border-[#D4AF37] hover:shadow-2xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="bg-[#214929] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <ShoppingCart className="w-8 h-8 text-[#D4AF37]" />
                    <h3 className="text-2xl font-bold text-[#214929] font-playfair">
                      Pilih Menu
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Lihat menu lengkap kami dan pilih produk Pisang Ijo yang Anda inginkan. 
                    Kami menyediakan berbagai paket dan varian rasa.
                  </p>
                  <Link href="/menu">
                    <Button className="bg-[#214929] hover:bg-[#2d6b3a] text-white">
                      Lihat Menu
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="border-2 border-[#D4AF37] hover:shadow-2xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="bg-[#214929] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <MessageCircle className="w-8 h-8 text-[#D4AF37]" />
                    <h3 className="text-2xl font-bold text-[#214929] font-playfair">
                      Hubungi Kami
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Hubungi kami melalui WhatsApp atau telepon untuk konfirmasi pesanan Anda. 
                    Tim kami siap membantu Anda 24/7.
                  </p>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      📱 WhatsApp: <span className="font-semibold">+62 812-3456-7890</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      ☎️ Telepon: <span className="font-semibold">0411-123456</span>
                    </p>
                  </div>
                  <a 
                    href="https://wa.me/6281234567890?text=Halo,%20saya%20ingin%20memesan%20Pisang%20Ijo" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Chat via WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="border-2 border-[#D4AF37] hover:shadow-2xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="bg-[#214929] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="w-8 h-8 text-[#D4AF37]" />
                    <h3 className="text-2xl font-bold text-[#214929] font-playfair">
                      Lakukan Pembayaran
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Setelah pesanan dikonfirmasi, lakukan pembayaran melalui transfer bank 
                    atau metode pembayaran lainnya yang tersedia.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm font-semibold text-gray-800">Metode Pembayaran:</p>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                      <li>Transfer Bank (BCA, Mandiri, BNI)</li>
                      <li>E-Wallet (OVO, GoPay, Dana)</li>
                      <li>Cash on Delivery (COD)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card className="border-2 border-[#D4AF37] hover:shadow-2xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="bg-[#214929] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Package className="w-8 h-8 text-[#D4AF37]" />
                    <h3 className="text-2xl font-bold text-[#214929] font-playfair">
                      Terima Pesanan
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Pesanan Anda akan diproses dan dikirim sesuai jadwal yang telah disepakati. 
                    Nikmati Pisang Ijo segar dan berkualitas!
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <span className="font-semibold">💡 Tips:</span> Pesanan untuk frozen disarankan H-1 
                      untuk memastikan kesegaran produk. Untuk paket catering, harap pesan minimal 2 hari sebelumnya.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[#214929] to-[#2d6b3a] text-white rounded-2xl p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4">
              Siap Memesan?
            </h2>
            <p className="text-lg mb-8 text-gray-200">
              Hubungi kami sekarang dan nikmati kelezatan Pisang Ijo Evi!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/menu">
                <Button className="bg-[#D4AF37] hover:bg-[#c49d2f] text-[#214929] font-semibold px-8 py-6 text-lg">
                  Lihat Menu
                </Button>
              </Link>
              <Link href="/kontak">
                <Button variant="outline" className="bg-white hover:bg-gray-100 text-[#214929] border-2 border-white font-semibold px-8 py-6 text-lg">
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
