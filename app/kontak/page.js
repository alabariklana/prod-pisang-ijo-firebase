import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Mail, Phone, Clock, Send } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Kontak Kami - Pisang Ijo Evi | Hubungi Kami',
  description: 'Hubungi Pisang Ijo Evi untuk pemesanan dan informasi lebih lanjut. WhatsApp: 082260289787, Email: pisangijo@cateringsamarasa.com, Lokasi: Kelurahan Banta-Bantaeng, Kec. Rappocini, Makassar',
  keywords: ['kontak pisang ijo evi', 'pesan pisang ijo', 'whatsapp pisang ijo', 'catering makassar', 'rappocini', 'banta-bantaeng'],
};

export default function KontakPage() {
  const whatsappNumber = '6282260289787'; // Format internasional
  const whatsappMessage = encodeURIComponent('Halo Pisang Ijo Evi, saya ingin bertanya tentang produk Anda...');

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div 
        className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center py-12 md:py-20"
        style={{ 
          backgroundColor: '#214929',
          backgroundImage: 'linear-gradient(135deg, #214929 0%, #2d6339 100%)'
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-8 md:py-12">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-8 text-white leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Hubungi Kami
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
            Kami siap melayani kebutuhan Anda
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div style={{ backgroundColor: '#EBDEC5', fontFamily: 'var(--font-poppins)' }}>
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
            
            {/* Contact Cards */}
            <div className="space-y-4 md:space-y-6">
              
              {/* WhatsApp Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#25D366' }}>
                    <Phone size={24} className="text-white md:w-7 md:h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold mb-2" style={{ color: '#214929', fontFamily: 'var(--font-playfair)' }}>
                      WhatsApp
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                      Hubungi kami melalui WhatsApp untuk respon cepat
                    </p>
                    <a 
                      href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-white text-sm md:text-base font-medium transition-all duration-300 hover:opacity-90 hover:scale-105 active:scale-95"
                      style={{ backgroundColor: '#25D366' }}
                    >
                      <Phone size={16} className="md:w-[18px] md:h-[18px]" />
                      <span className="break-all">082260289787</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#214929' }}>
                    <Mail size={24} className="text-white md:w-7 md:h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold mb-2" style={{ color: '#214929', fontFamily: 'var(--font-playfair)' }}>
                      Email
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                      Kirim email untuk pertanyaan detail atau kerjasama
                    </p>
                    <a 
                      href="mailto:pisangijo@cateringsamarasa.com"
                      className="inline-flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-white text-sm md:text-base font-medium transition-all duration-300 hover:opacity-90 hover:scale-105 active:scale-95 break-all"
                      style={{ backgroundColor: '#214929' }}
                    >
                      <Send size={16} className="flex-shrink-0 md:w-[18px] md:h-[18px]" />
                      <span className="break-all">pisangijo@cateringsamarasa.com</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Location Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FCD900' }}>
                    <MapPin size={24} style={{ color: '#214929' }} className="md:w-7 md:h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold mb-2" style={{ color: '#214929', fontFamily: 'var(--font-playfair)' }}>
                      Lokasi
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                      Kunjungi kami atau pesan untuk area Makassar dan sekitarnya
                    </p>
                    <p className="text-base md:text-lg font-medium mb-1" style={{ color: '#214929' }}>
                      Kelurahan Banta-Bantaeng
                    </p>
                    <p className="text-sm md:text-base text-gray-600">
                      Kecamatan Rappocini, Kota Makassar
                    </p>
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#214929' }}>
                    <Clock size={24} className="text-white md:w-7 md:h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold mb-2" style={{ color: '#214929', fontFamily: 'var(--font-playfair)' }}>
                      Jam Operasional
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 mb-3">
                      Siap melayani pesanan Anda
                    </p>
                    <div className="space-y-2 text-sm md:text-base text-gray-700">
                      <div className="flex justify-between gap-2">
                        <span className="flex-shrink-0">Senin - Jumat</span>
                        <span className="font-medium text-right">08:00 - 20:00</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="flex-shrink-0">Sabtu - Minggu</span>
                        <span className="font-medium text-right">09:00 - 21:00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Order Section */}
            <div>
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 md:sticky md:top-8">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6" style={{ color: '#214929', fontFamily: 'var(--font-playfair)' }}>
                  Pesan Sekarang
                </h2>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                  Pesan Pisang Ijo Evi untuk acara spesial Anda atau sebagai oleh-oleh istimewa. 
                  Kami siap melayani pesanan dalam jumlah besar maupun kecil.
                </p>

                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-1" style={{ backgroundColor: '#FCD900' }}>
                      <span className="text-xs md:text-sm font-bold" style={{ color: '#214929' }}>✓</span>
                    </div>
                    <div>
                      <h4 className="text-sm md:text-base font-semibold mb-1" style={{ color: '#214929' }}>Kualitas Premium</h4>
                      <p className="text-xs md:text-sm text-gray-600">Dibuat dengan bahan pilihan terbaik</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-1" style={{ backgroundColor: '#FCD900' }}>
                      <span className="text-xs md:text-sm font-bold" style={{ color: '#214929' }}>✓</span>
                    </div>
                    <div>
                      <h4 className="text-sm md:text-base font-semibold mb-1" style={{ color: '#214929' }}>Pengiriman Aman</h4>
                      <p className="text-xs md:text-sm text-gray-600">Dikemas dengan rapi dan higienis</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-1" style={{ backgroundColor: '#FCD900' }}>
                      <span className="text-xs md:text-sm font-bold" style={{ color: '#214929' }}>✓</span>
                    </div>
                    <div>
                      <h4 className="text-sm md:text-base font-semibold mb-1" style={{ color: '#214929' }}>Pesanan Custom</h4>
                      <p className="text-xs md:text-sm text-gray-600">Sesuaikan dengan kebutuhan acara Anda</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <a 
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-4 rounded-lg text-white text-sm md:text-base font-bold transition-all duration-300 hover:opacity-90 hover:scale-105 active:scale-95 text-center"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <Phone size={18} className="md:w-5 md:h-5" />
                    <span>Chat via WhatsApp</span>
                  </a>
                  <Link
                    href="/pesan"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-4 rounded-lg text-white text-sm md:text-base font-bold transition-all duration-300 hover:opacity-90 hover:scale-105 active:scale-95 text-center"
                    style={{ backgroundColor: '#214929' }}
                  >
                    <Send size={18} className="md:w-5 md:h-5" />
                    <span>Form Pemesanan Online</span>
                  </Link>
                </div>

                <p className="text-xs text-gray-500 text-center mt-3 md:mt-4">
                  Untuk pesanan dalam jumlah besar, silakan hubungi kami terlebih dahulu
                </p>
              </div>
            </div>

          </div>

          {/* Map Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6" style={{ color: '#214929', fontFamily: 'var(--font-playfair)' }}>
              Lokasi Kami
            </h2>
            <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '300px', minHeight: '300px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.7658284547647!2d119.42846931476285!3d-5.147796996278638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbee318b5817867%3A0x3030bfbcaf77e20!2sBanta-Bantaeng%2C%20Kec.%20Rappocini%2C%20Kota%20Makassar%2C%20Sulawesi%20Selatan!5e0!3m2!1sid!2sid!4v1699999999999!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Pisang Ijo Evi"
              ></iframe>
            </div>
            <p className="text-xs md:text-sm text-gray-600 mt-3 md:mt-4 text-center px-2">
              📍 Kelurahan Banta-Bantaeng, Kecamatan Rappocini, Kota Makassar, Sulawesi Selatan
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}
