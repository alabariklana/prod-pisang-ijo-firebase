'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu as MenuIcon, X, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 shadow-md" style={{ backgroundColor: '#EBDEC5' }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="https://customer-assets.emergentagent.com/job_120889a2-ce7e-413b-8824-b8c0eeea94ef/artifacts/kekg4cgf_logo%20pisjo%20pendek.png"
              alt="Pisang Ijo Evi Logo"
              className="h-12 w-auto"
            />
            <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair), serif', color: '#214929' }}>
              Pisang Ijo Evi
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="transition hover:opacity-80" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }}>
              Home
            </Link>
            <Link href="/tentang" className="transition hover:opacity-80" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }}>
              Tentang Kami
            </Link>
            <Link href="/menu" className="transition hover:opacity-80" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }}>
              Menu
            </Link>
            <Link href="/cara-pemesanan" className="transition hover:opacity-80" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }}>
              Cara Pemesanan
            </Link>
            <Link href="/blog" className="transition hover:opacity-80" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }}>
              Blog
            </Link>
            <Link href="/kontak" className="transition hover:opacity-80" style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }}>
              Kontak
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Login icon */}
            <Link href="/login" aria-label="Login Pelanggan" className="hidden md:block">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 transition" title="Login">
                <UserIcon className="h-5 w-5" style={{ color: '#214929' }} />
              </span>
            </Link>
            <Link href="/pesan" className="hidden md:block">
              <Button style={{ backgroundColor: '#214929' }} className="hover:opacity-90">
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
              <Link 
                href="/login" 
                className="transition hover:opacity-80" 
                style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }} 
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                href="/" 
                className="transition hover:opacity-80" 
                style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }} 
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/tentang" 
                className="transition hover:opacity-80" 
                style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }} 
                onClick={() => setMobileMenuOpen(false)}
              >
                Tentang Kami
              </Link>
              <Link 
                href="/menu" 
                className="transition hover:opacity-80" 
                style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }} 
                onClick={() => setMobileMenuOpen(false)}
              >
                Menu
              </Link>
              <Link 
                href="/cara-pemesanan" 
                className="transition hover:opacity-80" 
                style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }} 
                onClick={() => setMobileMenuOpen(false)}
              >
                Cara Pemesanan
              </Link>
              <Link 
                href="/blog" 
                className="transition hover:opacity-80" 
                style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }} 
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/kontak" 
                className="transition hover:opacity-80" 
                style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500, color: '#214929' }} 
                onClick={() => setMobileMenuOpen(false)}
              >
                Kontak
              </Link>
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
  );
}
