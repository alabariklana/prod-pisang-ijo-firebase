import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Heart, Award, Users, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Tentang Kami - Pisang Ijo Evi | Makassar\'s Finest Dessert',
  description: 'Kisah di balik Pisang Ijo Evi - kehangatan tradisi dalam cita rasa yang berkelas. Dari dapur keluarga Makassar hingga menjadi dessert pilihan jamuan istimewa.',
  keywords: ['tentang pisang ijo evi', 'dessert makassar', 'kuliner tradisional', 'pisang ijo premium', 'catering makassar'],
};

export default function TentangKamiPage() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div 
        className="relative min-h-[60vh] flex items-center justify-center"
        style={{ 
          backgroundColor: '#214929',
          backgroundImage: 'linear-gradient(135deg, #214929 0%, #2d6339 100%)'
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-6">
            <Sparkles size={48} className="mx-auto mb-4 text-yellow-300" />
          </div>
          <h1 
            className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Tentang Kami
          </h1>
          <p className="text-xl md:text-2xl text-white/90 italic" style={{ fontFamily: 'var(--font-poppins)' }}>
            Kehangatan tradisi, dalam cita rasa yang berkelas
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ backgroundColor: '#EBDEC5', fontFamily: 'var(--font-poppins)' }}>
        
        {/* Story Section */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl leading-relaxed text-gray-700 mb-6">
                Di balik setiap sajian <span className="font-bold" style={{ color: '#214929' }}>Pisang Ijo Evi</span>, 
                tersimpan kisah tentang kehangatan, tradisi, dan cita rasa yang dirawat dengan penuh cinta.
              </p>
              
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                Kami berasal dari <span className="font-semibold">Makassar</span> — tanah dengan warisan kuliner yang kaya dan berkarakter. 
                Dari dapur keluarga sederhana, kami membawa resep Pisang Ijo yang telah menemani berbagai perayaan dan jamuan istimewa, 
                lalu kami sempurnakan menjadi sebuah pengalaman rasa yang elegan dan berkelas.
              </p>

              <div className="my-8 p-6 rounded-lg border-l-4" style={{ backgroundColor: '#f9fafb', borderColor: '#214929' }}>
                <p className="text-lg italic text-gray-700 mb-0">
                  "Bagi kami, Pisang Ijo bukan sekadar dessert, melainkan simbol keramahan dan penghormatan."
                </p>
              </div>

              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                Setiap lapisan lembut adonan hijau, setiap siraman saus santan manis, dibuat dengan kesabaran dan perhatian pada detail — 
                sebagaimana kami menghargai setiap pelanggan yang mempercayakan momen berharganya kepada kami.
              </p>

              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                Dengan harga yang mungkin sedikit lebih tinggi, kami tidak hanya menjual rasa, tapi juga keindahan dari kesederhanaan 
                yang dibuat dengan niat terbaik. Kami percaya, kualitas sejati selalu punya tempat bagi mereka yang memahami makna 
                keanggunan dan keaslian.
              </p>

              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                Kini, <span className="font-bold" style={{ color: '#214929' }}>Pisang Ijo Evi</span> menjadi pilihan jamuan para tamu kehormatan, 
                oleh-oleh bagi keluarga terkasih, serta simbol cita rasa Makassar yang modern tanpa kehilangan akarnya.
              </p>

              <p className="text-lg leading-relaxed text-gray-700">
                Kami ingin setiap suapan membawa Anda pada kenangan — tentang rumah, tentang kebersamaan, tentang rasa yang tulus namun elegan.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-16 px-4" style={{ backgroundColor: '#214929' }}>
          <div className="max-w-6xl mx-auto">
            <h2 
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-white"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Nilai-Nilai Kami
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Value 1 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-white/20">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FCD900' }}>
                  <Heart size={32} style={{ color: '#214929' }} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Dibuat dengan Cinta
                </h3>
                <p className="text-white/90">
                  Setiap produk dibuat dengan perhatian penuh pada detail dan kesabaran, 
                  mencerminkan rasa hormat kami kepada tradisi dan pelanggan.
                </p>
              </div>

              {/* Value 2 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-white/20">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FCD900' }}>
                  <Award size={32} style={{ color: '#214929' }} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Kualitas Premium
                </h3>
                <p className="text-white/90">
                  Kami menggunakan bahan pilihan terbaik dan resep yang telah disempurnakan 
                  untuk menghadirkan pengalaman rasa yang tak terlupakan.
                </p>
              </div>

              {/* Value 3 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-white/20">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FCD900' }}>
                  <Users size={32} style={{ color: '#214929' }} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Tradisi & Kebersamaan
                </h3>
                <p className="text-white/90">
                  Membawa kehangatan tradisi Makassar ke momen-momen berharga Anda, 
                  menciptakan kenangan yang penuh makna.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Statement */}
        <div className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <Sparkles size={48} className="mx-auto mb-6" style={{ color: '#214929' }} />
              <h2 
                className="text-3xl md:text-4xl font-bold mb-6"
                style={{ color: '#214929', fontFamily: 'var(--font-playfair)' }}
              >
                Pisang Ijo Evi
              </h2>
              <p className="text-xl italic mb-4" style={{ color: '#214929' }}>
                Makassar's Finest Dessert
              </p>
              <p className="text-lg text-gray-700">
                Kehangatan tradisi, dalam cita rasa yang berkelas.
              </p>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
}
