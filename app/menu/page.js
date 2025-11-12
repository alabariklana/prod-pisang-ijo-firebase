'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, ArrowLeft, Menu as MenuIcon, X } from 'lucide-react';
import Footer from '@/components/Footer';

export default function MenuPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      
      if (!res.ok) {
        console.error('API error:', res.status);
        setProducts([]);
        return;
      }
      
      const data = await res.json();
      
      // Validate that data is an array
      if (Array.isArray(data)) {
        // Filter only active products for menu display
        const activeProducts = data.filter(product => product.isActive !== false);
        setProducts(activeProducts);
      } else {
        console.error('Invalid data format:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Hero Section */}
      <section className="py-12 md:py-16 px-4 text-white" style={{ 
        background: 'linear-gradient(135deg, #214929 0%, #2a5f35 100%)',
        boxShadow: 'inset 0 -4px 20px rgba(212, 175, 55, 0.15)'
      }}>
        <div className="container mx-auto max-w-6xl">
          <Link href="/" className="inline-flex items-center mb-4 transition hover:opacity-80" style={{ color: '#F4E4C1' }}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Home
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ 
            fontFamily: 'var(--font-playfair), serif',
            textShadow: '0 2px 4px rgba(212, 175, 55, 0.3)'
          }}>Menu Kami</h1>
          <p className="text-lg md:text-xl" style={{ color: '#F4E4C1' }}>Pilihan Es Pisang Ijo terbaik untuk Anda dan keluarga</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Memuat produk...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {products.map((product, idx) => {
                const key = product._id ?? product.id ?? product.slug ?? `${product.name}-${idx}`;
                const imgSrc = product.imageUrl ?? product.image ?? (Array.isArray(product.photos) ? product.photos[0] : null);
                return (
                  <Card key={String(key)} className="transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-100 cursor-pointer" style={{ 
                    boxShadow: '0 4px 16px rgba(212, 175, 55, 0.2), 0 2px 8px rgba(33, 73, 41, 0.1)',
                    border: '1px solid rgba(212, 175, 55, 0.1)'
                  }} id={product.slug ?? key}>
                    <CardHeader>
                      <div className="h-48 md:h-64 bg-gray-200 rounded-md mb-4 overflow-hidden transition-transform duration-300 hover:scale-105" style={{ boxShadow: 'inset 0 2px 8px rgba(212, 175, 55, 0.15)' }}>
                        {imgSrc ? (
                          <img src={imgSrc} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                            <span className="text-green-700 text-5xl md:text-6xl">🍌</span>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-lg md:text-xl" style={{ color: '#214929' }}>{product.name}</CardTitle>
                      <CardDescription className="text-sm">{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <p className="text-xl md:text-2xl font-bold" style={{ 
                          background: 'linear-gradient(135deg, #214929 0%, #2a5f35 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}>
                          Rp {(Number(product.price) || 0).toLocaleString('id-ID')}
                        </p>
                        {(() => {
                          const stock = Number(product.stock) || 0;
                          const threshold = Number(product.lowStockThreshold) || 5;
                          
                          if (stock === 0) {
                            return <span className="text-xs md:text-sm text-red-600 bg-red-100 px-2 py-1 rounded">Habis</span>;
                          } else if (stock <= threshold) {
                            return <span className="text-xs md:text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Terbatas</span>;
                          } else {
                            return <span className="text-xs md:text-sm px-2 py-1 rounded" style={{ color: '#214929', backgroundColor: '#F4E4C1' }}>Tersedia</span>;
                          }
                        })()}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Link href={`/menu/${product.slug ?? key}`} className="flex-1">
                        <Button variant="outline" className="w-full transition-all duration-300 hover:scale-105 active:scale-95" style={{ 
                          borderColor: '#D4AF37',
                          color: '#214929',
                          borderWidth: '2px'
                        }}>
                          Detail
                        </Button>
                      </Link>
                      <Link href="/pesan" className="flex-1">
                        <Button 
                          className="w-full transition-all duration-300 hover:scale-105 active:scale-95" 
                          style={{ backgroundColor: (Number(product.stock) || 0) > 0 ? '#214929' : '#9CA3AF' }} 
                          disabled={(Number(product.stock) || 0) === 0}
                        >
                          {product.available ? 'Pesan' : 'Habis'}
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🍌</div>
              <p className="text-gray-500 mb-4">Belum ada produk tersedia</p>
              <Link href="/dashboard">
                <Button variant="outline" className="border-green-600 text-green-600">
                  Tambah Produk (Admin)
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      {products.length > 0 && (
        <section className="py-12 px-4 bg-green-50">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ 
              color: '#214929',
              fontFamily: 'var(--font-playfair), serif',
              textShadow: '0 2px 4px rgba(212, 175, 55, 0.15)'
            }}>
              Siap Memesan?
            </h2>
            <p className="text-gray-600 mb-6">
              Hubungi kami sekarang untuk pemesanan atau pertanyaan lebih lanjut
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pesan">
                <Button size="lg" className="w-full sm:w-auto transition-all duration-300 hover:scale-105 active:scale-95" style={{ 
                  backgroundColor: '#214929',
                  boxShadow: '0 4px 16px rgba(212, 175, 55, 0.35)'
                }}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Pesan Sekarang
                </Button>
              </Link>
              <Link href="/kontak">
                <Button size="lg" variant="outline" className="w-full sm:w-auto transition-all duration-300 hover:scale-105 active:scale-95" style={{ 
                  borderColor: '#D4AF37',
                  color: '#214929',
                  boxShadow: '0 3px 10px rgba(212, 175, 55, 0.2)',
                  borderWidth: '2px'
                }}>
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}