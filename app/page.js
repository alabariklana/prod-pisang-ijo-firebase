'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Phone, Mail, MapPin, Facebook, Instagram, ShoppingCart, Menu as MenuIcon, X, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signInWithGoogle, user } = useAuth();
  const router = useRouter();
  const [loginLoading, setLoginLoading] = useState(false);
  // Fungsi login Google
  const handleGoogleLogin = async () => {
    setLoginLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        toast.success('Login berhasil');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/popup-blocked') {
        toast.error('Pop-up diblokir. Mohon izinkan pop-up untuk login.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        // User closed the popup, no need to show error
        return;
      } else {
        toast.error('Login gagal. Silakan coba lagi.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchBlogPosts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');

      if (!res.ok) {
        const contentType = res.headers.get('content-type') || '';
        let body = null;
        try {
          body = contentType.includes('application/json') ? await res.json() : await res.text();
        } catch (err) {
          body = '<unable to parse body>';
        }
        console.error('API error:', res.status, body);
        toast.error('Gagal memuat produk. Silakan coba lagi nanti.');
        setProducts([]);
        return;
      }

      const data = await res.json();

      // Validate that data is an array
      if (Array.isArray(data)) {
        setProducts(data.slice(0, 3)); // Show only 3 featured products
      } else {
        console.error('Invalid data format:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Gagal memuat produk. Silakan coba lagi nanti.');
      setProducts([]);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const res = await fetch('/api/blog?status=published&limit=3');
      if (res.ok) {
        const data = await res.json();
        setBlogPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setBlogPosts([]);
    }
  };

  const stripMarkdown = (text = '') => {
    try {
      return text
        .replace(/\!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/\[[^\]]*\]\([^)]*\)/g, '$1')
        .replace(/[`*_~>#-]/g, '')
        .replace(/^\s*\d+\.\s+/gm, '')
        .replace(/^\s*[-*+]\s+/gm, '')
        .replace(/\s+/g, ' ')
        .trim();
    } catch {
      return text;
    }
  };

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Mohon masukkan email Anda');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Format email tidak valid');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const result = await res.json();
      
      if (res.ok) {
        if (result.message.includes('sudah terdaftar')) {
          // Already subscribed
          toast.info('📧 ' + result.message);
        } else if (result.message.includes('kembali')) {
          // Resubscribed
          toast.success('🎉 ' + result.message);
          setEmail('');
        } else {
          // New subscription
          toast.success('✅ ' + result.message);
          setEmail('');
        }
      } else if (res.status === 409) {
        // Conflict - email already subscribed (fallback)
        toast.info('📧 ' + (result.message || 'Email sudah terdaftar di newsletter kami'));
      } else {
        toast.error(result.message || 'Gagal berlangganan, silakan coba lagi');
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      toast.error('Gagal berlangganan, silakan coba lagi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EBDEC5' }}>
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
              <Link href="/cara-pemesanan" className="transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }}>Cara Pemesanan</Link>
              <Link href="/blog" className="transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }}>Blog</Link>
              <Link href="/kontak" className="transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }}>Kontak</Link>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Login icon */}
              <Link href="/login" aria-label="Login Pelanggan" className="hidden md:block">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 transition-all duration-200 hover:scale-110 active:scale-95" title="Login" style={{ boxShadow: '0 2px 8px rgba(212, 175, 55, 0.2)' }}>
                  <UserIcon className="h-5 w-5" style={{ color: '#214929' }} />
                </span>
              </Link>
              <Link href="/pesan" className="hidden md:block">
                <Button style={{ backgroundColor: '#214929', boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)' }} className="hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Pesan Sekarang
                </Button>
              </Link>
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden text-gray-700"
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
                <Link href="/login" className="transition hover:opacity-80" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }} onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link href="/" className="transition hover:opacity-80" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }} onClick={() => setMobileMenuOpen(false)}>Home</Link>
                <Link href="/tentang" className="transition hover:opacity-80" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }} onClick={() => setMobileMenuOpen(false)}>Tentang Kami</Link>
                <Link href="/menu" className="transition hover:opacity-80" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }} onClick={() => setMobileMenuOpen(false)}>Menu</Link>
                <Link href="/cara-pemesanan" className="transition hover:opacity-80" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }} onClick={() => setMobileMenuOpen(false)}>Cara Pemesanan</Link>
                <Link href="/blog" className="transition hover:opacity-80" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }} onClick={() => setMobileMenuOpen(false)}>Blog</Link>
                <Link href="/kontak" className="transition hover:opacity-80" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }} onClick={() => setMobileMenuOpen(false)}>Kontak</Link>
                <Link href="/pesan" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full" style={{ backgroundColor: '#214929' }}>
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
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center" style={{ 
        background: 'linear-gradient(135deg, #214929 0%, #2a5f35 50%, #214929 100%)',
        boxShadow: 'inset 0 -4px 20px rgba(212, 175, 55, 0.15)'
      }}>
 
        <div className="relative z-20 text-center text-white px-4 max-w-4xl">
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 pb-2"
            style={{ 
              fontFamily: 'var(--font-playfair), serif', 
              textShadow: '0 6px 9px rgba(4, 49, 31, 0.65), 0 2px 4px rgba(212, 175, 55, 0.3)',
              background: 'linear-gradient(to bottom, #ffffff 0%, #F4E4C1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: '1.2'
            }}
          >
            Pisang Ijo Khas Makassar
          </h1>
          <p className="text-base md:text-lg mb-8" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#F4E4C1', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Kelezatan tradisional yang menyegarkan, dibuat dengan cinta dan resep turun temurun</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu">
              <Button 
                size="lg" 
                className="bg-white text-green-700 hover:bg-gray-100 w-full sm:w-auto transition-all duration-300 hover:scale-105 active:scale-95" 
                style={{ 
                  boxShadow: '0 4px 16px rgba(212, 175, 55, 0.4)',
                  fontWeight: 600
                }}
              >
                Lihat Menu
              </Button>
            </Link>
            <Link href="/pesan">
              <Button 
                size="lg" 
                className="w-full sm:w-auto transition-all duration-300 hover:scale-105 active:scale-95 hover:brightness-110" 
                style={{ 
                  backgroundColor: '#D4AF37',
                  color: '#214929',
                  fontWeight: 600,
                  boxShadow: '0 4px 16px rgba(212, 175, 55, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                Pesan Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4" style={{ backgroundColor: '#EBDEC5' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ 
                color: '#214929',
                position: 'relative',
                display: 'inline-block',
                paddingBottom: '12px'
              }}>
                Tentang Pisang Ijo Evi
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '60px',
                  height: '3px',
                  background: 'linear-gradient(to right, #D4AF37, #F4E4C1)',
                  boxShadow: '0 2px 4px rgba(212, 175, 55, 0.3)'
                }}></span>
              </h2>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
                Pisang Ijo Evi adalah usaha keluarga yang telah melayani masyarakat Makassar dengan es pisang ijo autentik selama bertahun-tahun. 
                Kami menggunakan bahan-bahan pilihan dan resep tradisional yang telah diwariskan turun temurun.
              </p>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
                Setiap porsi es pisang ijo kami dibuat dengan penuh perhatian dan cinta, 
                memastikan rasa yang konsisten dan kualitas terbaik untuk pelanggan kami.
              </p>
              <Link href="/tentang">
                <Button variant="outline" style={{ 
                  borderColor: '#D4AF37', 
                  color: '#214929',
                  boxShadow: '0 3px 10px rgba(212, 175, 55, 0.2)',
                  borderWidth: '2px'
                }} className="hover:bg-opacity-10 transition-all hover:shadow-md">
                  Selengkapnya
                </Button>
              </Link>
            </div>
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-green-100 to-green-300" style={{ boxShadow: '0 8px 24px rgba(212, 175, 55, 0.25), 0 4px 12px rgba(33, 73, 41, 0.1)' }}>
                <div className="w-full h-full">
                  <img
                    src="https://storage.googleapis.com/biolink_pisjo/images/pisang-ijo-no-1-di-makassar.webp"
                    alt="Pisang Ijo terbaik Makassar"
                    className="w-full h-full object-cover"
                  />
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      
      <section className="py-16 px-4" style={{ 
        background: 'linear-gradient(to bottom, #D4C4A8 0%, #E5D7BE 100%)',
        boxShadow: 'inset 0 4px 12px rgba(212, 175, 55, 0.1)'
      }}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ 
              color: '#214929',
              textShadow: '0 2px 4px rgba(212, 175, 55, 0.15)',
              position: 'relative',
              display: 'inline-block',
              paddingBottom: '12px'
            }}>
              Menu Favorit Kami
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '3px',
                background: 'linear-gradient(to right, #D4AF37, #F4E4C1, #D4AF37)',
                boxShadow: '0 2px 6px rgba(212, 175, 55, 0.4)'
              }}></span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg">Pilihan es pisang ijo terbaik untuk Anda</p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.length > 0 ? (
              products.map((product, idx) => {
                const key = product._id ?? product.id ?? product.slug ?? `${product.name}-${idx}`;
                const imgSrc = product.imageUrl ?? product.image ?? (Array.isArray(product.photos) ? product.photos[0] : null);
                return (
                  <Card key={String(key)} className="transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-100 cursor-pointer" style={{ 
                    boxShadow: '0 4px 16px rgba(212, 175, 55, 0.2), 0 2px 8px rgba(33, 73, 41, 0.1)',
                    border: '1px solid rgba(212, 175, 55, 0.1)'
                  }}>
                    <CardHeader>
                      <div className="h-48 bg-gray-200 rounded-md mb-4 overflow-hidden transition-transform duration-300 hover:scale-105" style={{ boxShadow: 'inset 0 2px 8px rgba(212, 175, 55, 0.15)' }}>
                        {imgSrc ? (
                          <img src={imgSrc} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                            <span className="text-green-700 text-6xl">🍌</span>
                          </div>
                        )}
                      </div>
                      <CardTitle style={{ color: '#214929' }}>{product.name}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold" style={{ 
                        background: 'linear-gradient(135deg, #214929 0%, #2a5f35 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        Rp {(Number(product.price) || 0).toLocaleString('id-ID')}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/menu#${product.slug ?? key}`} className="w-full">
                        <Button className="w-full transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg" style={{ 
                          backgroundColor: '#214929',
                          boxShadow: '0 3px 10px rgba(212, 175, 55, 0.3)'
                        }}>Lihat Detail</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 mb-4">Produk akan segera hadir...</p>
                <Link href="/dashboard">
                  <Button variant="outline" className="border-green-600 text-green-600">
                    Tambah Produk (Admin)
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {products.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/menu">
                <Button size="lg" style={{ 
                  backgroundColor: '#214929',
                  boxShadow: '0 4px 16px rgba(212, 175, 55, 0.35)'
                }} className="transition-all hover:shadow-xl">
                  Lihat Semua Menu
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Blog Section */}
      {blogPosts.length > 0 && (
        <section className="py-16 px-4" style={{ backgroundColor: '#EBDEC5' }}>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ 
                color: '#214929', 
                fontFamily: 'var(--font-playfair)',
                textShadow: '0 2px 4px rgba(212, 175, 55, 0.15)',
                position: 'relative',
                display: 'inline-block',
                paddingBottom: '12px'
              }}>
                📰 Artikel Terbaru
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '3px',
                  background: 'linear-gradient(to right, #D4AF37, #F4E4C1, #D4AF37)',
                  boxShadow: '0 2px 6px rgba(212, 175, 55, 0.4)'
                }}></span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Baca artikel, resep, tips & trik seputar kuliner tradisional Makassar
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-100"
                  style={{ 
                    boxShadow: '0 4px 16px rgba(212, 175, 55, 0.2), 0 2px 8px rgba(33, 73, 41, 0.1)',
                    border: '1px solid rgba(212, 175, 55, 0.1)'
                  }}
                >
                  {/* Featured Image */}
                  {post.featuredImage ? (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                      <div
                        className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-110"
                        style={{ 
                          backgroundColor: '#D4AF37', 
                          color: '#214929',
                          boxShadow: '0 2px 8px rgba(212, 175, 55, 0.4)'
                        }}
                      >
                        {post.category}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="h-48 flex items-center justify-center"
                      style={{ backgroundColor: '#EBDEC5' }}
                    >
                      <span className="text-6xl">📝</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <h3
                      className="text-xl font-bold mb-2 line-clamp-2 hover:underline"
                      style={{ color: '#214929', fontFamily: 'var(--font-playfair)' }}
                    >
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {(post.excerpt || stripMarkdown(post.content)).substring(0, 120)}...
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="font-medium" style={{ color: '#214929' }}>
                        Baca →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/blog">
                <Button size="lg" style={{ 
                  backgroundColor: '#214929', 
                  color: 'white',
                  boxShadow: '0 4px 16px rgba(212, 175, 55, 0.35)'
                }} className="transition-all hover:shadow-xl">
                  Lihat Semua Artikel
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16 px-4 text-white" style={{ 
        background: 'linear-gradient(135deg, #214929 0%, #2a5f35 100%)',
        boxShadow: 'inset 0 4px 12px rgba(212, 175, 55, 0.15)'
      }}>
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Dapatkan Promo & Update Terbaru</h2>
          <p className="mb-8" style={{ color: '#F4E4C1', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>Berlangganan newsletter kami dan dapatkan info promo menarik</p>
          <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-gray-900 transition-all duration-200 focus:scale-105"
              style={{ boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)' }}
              disabled={loading}
            />
            <Button 
              type="submit" 
              variant="secondary" 
              disabled={loading} 
              className="sm:w-auto transition-all duration-300 hover:scale-105 active:scale-95 hover:brightness-110" 
              style={{ 
                backgroundColor: '#D4AF37',
                color: '#214929',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.4)'
              }}
            >
              {loading ? 'Memproses...' : 'Subscribe'}
            </Button>
          </form>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 px-4" style={{ backgroundColor: '#EBDEC5' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ 
              color: '#214929',
              textShadow: '0 2px 4px rgba(212, 175, 55, 0.15)',
              position: 'relative',
              display: 'inline-block',
              paddingBottom: '12px'
            }}>
              Hubungi Kami
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '3px',
                background: 'linear-gradient(to right, #D4AF37, #F4E4C1, #D4AF37)',
                boxShadow: '0 2px 6px rgba(212, 175, 55, 0.4)'
              }}></span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            <Card className="text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-100 cursor-pointer" style={{ 
              boxShadow: '0 4px 16px rgba(212, 175, 55, 0.2)',
              border: '1px solid rgba(212, 175, 55, 0.1)'
            }}>
              <CardContent className="pt-6">
                <Phone className="h-12 w-12 mx-auto mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-12" style={{ color: '#D4AF37' }} />
                <h3 className="font-semibold text-lg mb-2" style={{ color: '#214929' }}>Telepon</h3>
                <a href="tel:+6282260889787" className="text-gray-600 hover:text-green-600 transition-colors">
                  +62 822-6088-9787
                </a>
              </CardContent>
            </Card>
            <Card className="text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-100 cursor-pointer" style={{ 
              boxShadow: '0 4px 16px rgba(212, 175, 55, 0.2)',
              border: '1px solid rgba(212, 175, 55, 0.1)'
            }}>
              <CardContent className="pt-6">
                <Mail className="h-12 w-12 mx-auto mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-12" style={{ color: '#D4AF37' }} />
                <h3 className="font-semibold text-lg mb-2" style={{ color: '#214929' }}>Email</h3>
                <a href="mailto:pisangijo@cateringsamarasa.com" className="text-gray-600 hover:text-green-600 transition-colors">
                  pisangijo@cateringsamarasa.com
                </a>
              </CardContent>
            </Card>
            <Card className="text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-100 cursor-pointer" style={{ 
              boxShadow: '0 4px 16px rgba(212, 175, 55, 0.2)',
              border: '1px solid rgba(212, 175, 55, 0.1)'
            }}>
              <CardContent className="pt-6">
                <MapPin className="h-12 w-12 mx-auto mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-12" style={{ color: '#D4AF37' }} />
                <h3 className="font-semibold text-lg mb-2" style={{ color: '#214929' }}>Lokasi</h3>
                <p className="text-gray-600">Makassar, Sulawesi Selatan</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-8 px-4" style={{ backgroundColor: '#1a3a22' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Pisang Ijo Evi</h3>
              <p className="text-green-200 text-sm">Es Pisang Ijo Khas Makassar yang lezat dan menyegarkan</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Menu</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-green-200 hover:text-white transition">Home</Link></li>
                <li><Link href="/tentang" className="text-green-200 hover:text-white transition">Tentang Kami</Link></li>
                <li><Link href="/menu" className="text-green-200 hover:text-white transition">Menu</Link></li>
                <li><Link href="/blog" className="text-green-200 hover:text-white transition">Blog</Link></li>
                <li><Link href="/pesan" className="text-green-200 hover:text-white transition">Pesan</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Informasi</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/kontak" className="text-green-200 hover:text-white transition">Kontak</Link></li>
                <li><Link href="/dashboard" className="text-green-200 hover:text-white transition">Dashboard Admin</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Ikuti Kami</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-green-200 hover:text-white transition">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-green-200 hover:text-white transition">
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-green-800 pt-6 text-center text-sm text-green-200">
            <p>&copy; 2025 Pisang Ijo Evi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}