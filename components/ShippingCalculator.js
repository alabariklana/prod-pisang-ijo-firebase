'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ShippingCalculator({ 
  onShippingSelected = () => {},
  defaultWeight = 1000,
  origin = '268' // Default Makassar, Sulawesi Selatan
}) {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [weight, setWeight] = useState(defaultWeight);
  const [courier, setCourier] = useState('jne');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState('');

  // Fetch provinces on component mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  // Fetch cities when province changes
  useEffect(() => {
    if (selectedProvince) {
      fetchCities(selectedProvince);
    } else {
      setCities([]);
      setSelectedCity('');
    }
  }, [selectedProvince]);

  const fetchProvinces = async () => {
    try {
      const response = await fetch('/api/shipping/provinces');
      const data = await response.json();
      
      if (data.success) {
        setProvinces(data.provinces);
      } else {
        setError('Failed to fetch provinces');
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
      setError('Failed to fetch provinces');
    }
  };

  const fetchCities = async (provinceId) => {
    setLoadingCities(true);
    try {
      const response = await fetch(`/api/shipping/cities?province=${provinceId}`);
      const data = await response.json();
      
      if (data.success) {
        setCities(data.cities);
      } else {
        setError('Failed to fetch cities');
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setError('Failed to fetch cities');
    } finally {
      setLoadingCities(false);
    }
  };

  const calculateShipping = async () => {
    if (!selectedCity || !weight) {
      setError('Please select destination city and enter weight');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/shipping/cost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          origin,
          destination: selectedCity,
          weight: parseInt(weight),
          courier
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShippingOptions(data.shippingOptions);
      } else {
        setError(data.error || 'Failed to calculate shipping cost');
      }
    } catch (error) {
      console.error('Error calculating shipping:', error);
      setError('Failed to calculate shipping cost');
    } finally {
      setLoading(false);
    }
  };

  const selectShipping = (courierData, service) => {
    const shippingData = {
      courier: courierData.courier,
      courierName: courierData.courierName,
      service: service.service,
      description: service.description,
      cost: service.cost,
      etd: service.etd,
      destination: {
        cityId: selectedCity,
        cityName: cities.find(c => c.city_id === selectedCity)?.city_name || '',
        provinceId: selectedProvince,
        provinceName: provinces.find(p => p.province_id === selectedProvince)?.province || ''
      }
    };
    
    setSelectedShipping(shippingData);
    onShippingSelected(shippingData);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Hitung Ongkos Kirim</h3>
      
      <div className="space-y-4">
        {/* Province Selection */}
        <div>
          <Label htmlFor="province">Pilih Provinsi</Label>
          <select
            id="province"
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-- Pilih Provinsi --</option>
            {provinces.map((province) => (
              <option key={province.province_id} value={province.province_id}>
                {province.province}
              </option>
            ))}
          </select>
        </div>

        {/* City Selection */}
        <div>
          <Label htmlFor="city">Pilih Kota/Kabupaten</Label>
          <select
            id="city"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedProvince || loadingCities}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">
              {loadingCities ? 'Loading...' : '-- Pilih Kota/Kabupaten --'}
            </option>
            {cities.map((city) => (
              <option key={city.city_id} value={city.city_id}>
                {city.type} {city.city_name}
              </option>
            ))}
          </select>
        </div>

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight">Berat (gram)</Label>
          <Input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Masukkan berat dalam gram"
            min="1"
            className="mt-1"
          />
        </div>

        {/* Courier Selection */}
        <div>
          <Label htmlFor="courier">Pilih Kurir</Label>
          <select
            id="courier"
            value={courier}
            onChange={(e) => setCourier(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="jne">JNE</option>
            <option value="pos">POS Indonesia</option>
            <option value="tiki">TIKI</option>
          </select>
        </div>

        {/* Calculate Button */}
        <Button
          onClick={calculateShipping}
          disabled={loading || !selectedCity || !weight}
          className="w-full"
        >
          {loading ? 'Menghitung...' : 'Hitung Ongkir'}
        </Button>

        {/* Error Display */}
        {error && (
          <div className="text-red-600 text-sm mt-2">
            {error}
          </div>
        )}

        {/* Shipping Options */}
        {shippingOptions.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Pilih Layanan Pengiriman:</h4>
            <div className="space-y-3">
              {shippingOptions.map((courierData) => (
                <div key={courierData.courier} className="border rounded-lg p-4">
                  <h5 className="font-medium text-lg mb-2">
                    {courierData.courierName} ({courierData.courier})
                  </h5>
                  <div className="space-y-2">
                    {courierData.services.map((service, index) => (
                      <div
                        key={index}
                        className={`p-3 border rounded cursor-pointer transition-colors ${
                          selectedShipping?.courier === courierData.courier &&
                          selectedShipping?.service === service.service
                            ? 'bg-blue-50 border-blue-500'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => selectShipping(courierData, service)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{service.service}</div>
                            <div className="text-sm text-gray-600">
                              {service.description}
                            </div>
                            <div className="text-sm text-gray-500">
                              Estimasi: {service.etd} hari
                            </div>
                          </div>
                          <div className="text-lg font-semibold text-blue-600">
                            {formatCurrency(service.cost)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Shipping Display */}
        {selectedShipping && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Pengiriman Dipilih:</h4>
            <div className="text-sm text-green-700">
              <div>{selectedShipping.courierName} - {selectedShipping.service}</div>
              <div>Tujuan: {selectedShipping.destination.cityName}, {selectedShipping.destination.provinceName}</div>
              <div>Biaya: {formatCurrency(selectedShipping.cost)}</div>
              <div>Estimasi: {selectedShipping.etd} hari</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}