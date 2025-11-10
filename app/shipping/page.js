'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ShippingCalculator from '@/components/ShippingCalculator';
import ShippingTracker from '@/components/ShippingTracker';

export default function ShippingPage() {
  const [selectedShipping, setSelectedShipping] = useState(null);

  const handleShippingSelected = (shippingData) => {
    setSelectedShipping(shippingData);
    console.log('Selected shipping:', shippingData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="https://customer-assets.emergentagent.com/job_120889a2-ce7e-413b-8824-b8c0eeea94ef/artifacts/kekg4cgf_logo%20pisjo%20pendek.png" 
                alt="Pisang Ijo Evi Logo" 
                className="h-12 w-auto"
              />
              <span className="text-2xl font-bold text-green-700">Pisang Ijo Evi</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 px-4 bg-green-700 text-white">
        <div className="container mx-auto max-w-6xl">
          <Link href="/dashboard" className="inline-flex items-center text-green-200 hover:text-white mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Dashboard
          </Link>
          <h1 className="text-4xl font-bold">Pengiriman & Tracking</h1>
          <p className="text-green-100 mt-2">Hitung ongkir dan lacak paket</p>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Shipping Calculator */}
          <div>
            <ShippingCalculator
              onShippingSelected={handleShippingSelected}
              defaultWeight={1000}
              origin="268" // Makassar, Sulawesi Selatan
            />
            
            {selectedShipping && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Pengiriman Dipilih:</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <div><strong>Kurir:</strong> {selectedShipping.courierName} ({selectedShipping.courier})</div>
                  <div><strong>Layanan:</strong> {selectedShipping.service}</div>
                  <div><strong>Deskripsi:</strong> {selectedShipping.description}</div>
                  <div><strong>Biaya:</strong> Rp {selectedShipping.cost.toLocaleString('id-ID')}</div>
                  <div><strong>Estimasi:</strong> {selectedShipping.etd} hari</div>
                  <div><strong>Tujuan:</strong> {selectedShipping.destination.cityName}, {selectedShipping.destination.provinceName}</div>
                </div>
              </div>
            )}
          </div>

          {/* Shipping Tracker */}
          <div>
            <ShippingTracker />
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Cara Menggunakan:</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-700">
            <div>
              <h4 className="font-semibold mb-2">Kalkulator Ongkir:</h4>
              <ol className="space-y-1 list-decimal list-inside">
                <li>Pilih provinsi tujuan</li>
                <li>Pilih kota/kabupaten tujuan</li>
                <li>Masukkan berat barang (gram)</li>
                <li>Pilih kurir (JNE, POS, TIKI)</li>
                <li>Klik "Hitung Ongkir"</li>
                <li>Pilih layanan yang diinginkan</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Lacak Paket:</h4>
              <ol className="space-y-1 list-decimal list-inside">
                <li>Masukkan nomor resi</li>
                <li>Pilih kurir yang digunakan</li>
                <li>Klik "Lacak Paket"</li>
                <li>Lihat status dan riwayat pengiriman</li>
              </ol>
            </div>
          </div>
        </div>

        {/* API Information */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Informasi API:</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>API Endpoints:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><code>/api/shipping/provinces</code> - Daftar provinsi</li>
              <li><code>/api/shipping/cities?province=ID</code> - Daftar kota berdasarkan provinsi</li>
              <li><code>/api/shipping/cost</code> - Hitung ongkos kirim</li>
              <li><code>/api/shipping/track</code> - Lacak pengiriman</li>
            </ul>
            <p className="mt-3"><strong>Supported Couriers:</strong> JNE, POS Indonesia, TIKI</p>
          </div>
        </div>
      </div>
    </div>
  );
}