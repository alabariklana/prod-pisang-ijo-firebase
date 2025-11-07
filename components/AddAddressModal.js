'use client';

import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: -5.1477, // Makassar coordinates
  lng: 119.4327
};

export default function AddAddressModal({ isOpen, onClose, userEmail, onAddressAdded }) {
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get user's current location on mount
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setMarkerPosition(pos);
          reverseGeocode(pos);
        },
        () => {
          console.log('Error getting location, using default');
        }
      );
    }
  }, [isOpen]);

  const reverseGeocode = async (position) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.lat},${position.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results[0]) {
        setAddress(data.results[0].formatted_address);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  const handleMapClick = useCallback((e) => {
    const pos = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    setMarkerPosition(pos);
    reverseGeocode(pos);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results[0]) {
        const location = data.results[0].geometry.location;
        const pos = { lat: location.lat, lng: location.lng };
        setMarkerPosition(pos);
        setAddress(data.results[0].formatted_address);
        
        if (map) {
          map.panTo(pos);
          map.setZoom(16);
        }
      } else {
        toast.error('Lokasi tidak ditemukan');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Gagal mencari lokasi');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!label || !address) {
      toast.error('Label dan alamat harus diisi');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/member/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberEmail: userEmail,
          label,
          address,
          latitude: markerPosition.lat,
          longitude: markerPosition.lng,
          notes
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Alamat berhasil ditambahkan!');
        onAddressAdded();
        handleClose();
      } else {
        toast.error(data.error || 'Gagal menambahkan alamat');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Gagal menambahkan alamat');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setLabel('');
    setAddress('');
    setNotes('');
    setSearchQuery('');
    setMarkerPosition(defaultCenter);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair), serif', color: '#214929' }}>
            Tambah Alamat Baru
          </h2>
          <button onClick={handleClose} className="hover:bg-gray-100 rounded-full p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Search Location */}
          <div>
            <label className="block text-sm font-medium mb-2">Cari Lokasi</label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari alamat, nama tempat, atau kota..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
              />
              <Button 
                type="button" 
                onClick={handleSearch}
                style={{ backgroundColor: '#214929' }}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Atau klik langsung pada peta untuk menentukan lokasi
            </p>
          </div>

          {/* Google Maps */}
          <div className="border rounded-lg overflow-hidden">
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={markerPosition}
                zoom={15}
                onClick={handleMapClick}
                onLoad={(map) => setMap(map)}
              >
                <Marker position={markerPosition} />
              </GoogleMap>
            </LoadScript>
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium mb-2">Label Alamat *</label>
            <Input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Contoh: Rumah, Kantor, Kos"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Alamat Lengkap *</label>
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jalan, nomor, kecamatan, kota"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Koordinat: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Catatan (Opsional)</label>
            <Input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Patokan, warna rumah, dll"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              style={{ borderColor: '#214929', color: '#214929' }}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
              style={{ backgroundColor: '#214929' }}
            >
              {loading ? 'Menyimpan...' : 'Simpan Alamat'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
