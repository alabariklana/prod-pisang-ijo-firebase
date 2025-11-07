import Link from 'next/link';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="text-white py-8 px-4" style={{ backgroundColor: '#1a3a22' }}>
      <div className="container mx-auto max-w-6xl">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Pisang Ijo Evi</h3>
            <p className="text-green-200 text-sm mb-4">Makassar's Finest Dessert - Kehangatan tradisi dalam cita rasa yang berkelas</p>
            <div className="space-y-2 text-sm text-green-200">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <div>
                  <div>Kelurahan Banta-Bantaeng</div>
                  <div>Kec. Rappocini, Kota Makassar</div>
                </div>
              </div>
            </div>
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
            <h3 className="font-bold text-lg mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="https://wa.me/6282260289787" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-200 hover:text-white transition flex items-center gap-2"
                >
                  <Phone size={16} />
                  <span>082260289787</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:pisangijo@cateringsamarasa.com" 
                  className="text-green-200 hover:text-white transition flex items-center gap-2"
                >
                  <Mail size={16} />
                  <span className="text-xs">pisangijo@cateringsamarasa.com</span>
                </a>
              </li>
              <li><Link href="/cara-pemesanan" className="text-green-200 hover:text-white transition">Cara Pemesanan</Link></li>
              <li><Link href="/kontak" className="text-green-200 hover:text-white transition">Hubungi Kami</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Ikuti Kami</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-green-200 hover:text-white transition" aria-label="Facebook">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-green-200 hover:text-white transition" aria-label="Instagram">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
            <Link href="/dashboard" className="text-green-200 hover:text-white transition text-sm">
              Dashboard Admin
            </Link>
          </div>
        </div>
        <div className="border-t border-green-800 pt-6 text-center text-sm text-green-200">
          <p>&copy; 2025 Pisang Ijo Evi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
