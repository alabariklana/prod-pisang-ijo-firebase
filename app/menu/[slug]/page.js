'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ShoppingCart, 
  ArrowLeft, 
  Check, 
  Package,
  Clock,
  Menu as MenuIcon,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import Footer from '@/components/Footer';

export default function ProductDetailPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [slug, setSlug] = useState(null);
  const router = useRouter();

  // Unwrap params Promise
  useEffect(() => {
    Promise.resolve(params).then((resolvedParams) => {
      setSlug(resolvedParams.slug);
    });
  }, [params]);

  useEffect(() => {
    if (slug) {
      fetchProduct(slug);
    }
  }, [slug]);

  const fetchProduct = async (slug) => {
    try {
      const res = await fetch(`/api/products/${slug}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          toast.error('Produk tidak ditemukan');
          router.push('/menu');
          return;
        }
        throw new Error('Failed to fetch product');
      }
      
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = () => {
    if (!product.available) {
      toast.error('Maaf, produk ini sedang tidak tersedia');
      return;
    }
    // Redirect to order page with product info
    router.push(`/pesan?product=${product.slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50" style={{ backgroundColor: '#EBDEC5', boxShadow: '0 4px 20px rgba(212, 175, 55, 0.15)' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="https://storage.googleapis.com/biolink_pisjo/images/kekg4cgf_logo%20pisjo%20pendek.webp"
                alt="Pisang Ijo Evi Logo"
                className="h-12 w-auto"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(212, 175, 55, 0.3))' }}
              />
              <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair), serif', color: '#214929', textShadow: '0 1px 2px rgba(212, 175, 55, 0.2)' }}>Pisang Ijo Evi</span>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6">
              <Link href="/" className="transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }}>Home</Link>
              <Link href="/tentang" className="transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }}>Tentang Kami</Link>
              <Link href="/menu" className="transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }}>Menu</Link>
              <Link href="/blog" className="transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }}>Blog</Link>
              <Link href="/kontak" className="transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }}>Kontak</Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/pesan" className="hidden md:block">
                <Button style={{ backgroundColor: '#214929', boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)' }} className="hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Pesan Sekarang
                </Button>
              </Link>
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden"
                style={{ color: '#214929' }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col space-y-3">
                <Link href="/" className="transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }} onClick={() => setMobileMenuOpen(false)}>Home</Link>
                <Link href="/tentang" className="transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }} onClick={() => setMobileMenuOpen(false)}>Tentang Kami</Link>
                <Link href="/menu" className="transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }} onClick={() => setMobileMenuOpen(false)}>Menu</Link>
                <Link href="/blog" className="transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }} onClick={() => setMobileMenuOpen(false)}>Blog</Link>
                <Link href="/kontak" className="transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }} onClick={() => setMobileMenuOpen(false)}>Kontak</Link>
                <Link href="/pesan" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full transition-all duration-300 hover:scale-105 active:scale-95" style={{ backgroundColor: '#214929' }}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Pesan Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600 transition">Home</Link>
            <span>/</span>
            <Link href="/menu" className="hover:text-green-600 transition">Menu</Link>
            <span>/</span>
            <span className="text-green-600 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Link 
            href="/menu" 
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-6 transition"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Menu
          </Link>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                    <span className="text-green-700 text-9xl">🍌</span>
                  </div>
                )}
              </div>
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {product.available ? (
                  <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    Tersedia
                  </span>
                ) : (
                  <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    Stok Habis
                  </span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-6">
                <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                  {product.category || 'Pisang Ijo'}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mb-6">
                <p className="text-4xl font-bold text-green-600">
                  Rp {product.price?.toLocaleString('id-ID')}
                </p>
                <span className="text-gray-500">/ porsi</span>
              </div>

              <div className="prose prose-green mb-8">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {product.description || 'Es pisang ijo khas Makassar yang lezat dan menyegarkan, dibuat dengan bahan-bahan pilihan berkualitas tinggi.'}
                </p>
              </div>

              {/* Features */}
              <Card className="mb-8 border-green-100">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Keunggulan Produk:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Bahan-bahan segar dan berkualitas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Resep tradisional turun temurun</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Dibuat fresh setiap hari</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Rasa yang konsisten dan autentik</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <Package className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-600">Porsi</p>
                    <p className="font-semibold text-gray-900">1 Cup</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <Clock className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-600">Persiapan</p>
                    <p className="font-semibold text-gray-900">15-30 menit</p>
                  </div>
                </div>
              </div>

              {/* Order Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleOrderClick}
                  disabled={!product.available}
                  className="flex-1 bg-green-600 hover:bg-green-700 h-12 text-base transition-all duration-300 hover:scale-105 active:scale-95"
                  size="lg"
                  style={{ boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)' }}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.available ? 'Pesan Sekarang' : 'Stok Habis'}
                </Button>
                <Link href="/kontak" className="flex-1">
                  <Button 
                    variant="outline" 
                    className="w-full border-green-600 text-green-600 hover:bg-green-50 h-12 text-base transition-all duration-300 hover:scale-105 active:scale-95"
                    size="lg"
                    style={{ 
                      borderColor: '#D4AF37',
                      color: '#214929',
                      borderWidth: '2px',
                      boxShadow: '0 3px 10px rgba(212, 175, 55, 0.2)'
                    }}
                  >
                    Hubungi Kami
                  </Button>
                </Link>
              </div>

              {/* Notice */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Info:</strong> Untuk pemesanan dalam jumlah besar (lebih dari 20 porsi), 
                  mohon hubungi kami terlebih dahulu untuk ketersediaan stok.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products / CTA Section */}
      <section className="py-12 px-4 bg-green-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#214929' }}>
            Tertarik dengan produk lainnya?
          </h2>
          <p className="text-gray-600 mb-6">
            Lihat menu lengkap kami dan temukan favorit Anda
          </p>
          <Link href="/menu">
            <Button size="lg" variant="outline" style={{ 
              borderColor: '#D4AF37', 
              color: '#214929',
              boxShadow: '0 3px 10px rgba(212, 175, 55, 0.2)',
              borderWidth: '2px'
            }} className="hover:bg-opacity-10 transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95">
              Lihat Semua Menu
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}