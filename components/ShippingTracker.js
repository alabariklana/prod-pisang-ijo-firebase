'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ShippingTracker() {
  const [waybill, setWaybill] = useState('');
  const [courier, setCourier] = useState('jne');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trackPackage = async () => {
    if (!waybill.trim()) {
      setError('Please enter waybill number');
      return;
    }

    setLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const response = await fetch('/api/shipping/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          waybill: waybill.trim(),
          courier: courier.toLowerCase()
        })
      });

      const data = await response.json();

      if (data.success) {
        setTrackingData(data.tracking);
      } else {
        setError(data.error || 'Failed to track package');
      }
    } catch (error) {
      console.error('Error tracking package:', error);
      setError('Failed to track package');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower.includes('delivered') || statusLower.includes('terkirim')) {
      return 'text-green-600 bg-green-50';
    } else if (statusLower.includes('transit') || statusLower.includes('perjalanan')) {
      return 'text-blue-600 bg-blue-50';
    } else if (statusLower.includes('pickup') || statusLower.includes('diambil')) {
      return 'text-yellow-600 bg-yellow-50';
    } else {
      return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Lacak Paket</h3>
      
      <div className="space-y-4">
        {/* Waybill Input */}
        <div>
          <Label htmlFor="waybill">Nomor Resi</Label>
          <Input
            id="waybill"
            type="text"
            value={waybill}
            onChange={(e) => setWaybill(e.target.value)}
            placeholder="Masukkan nomor resi pengiriman"
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

        {/* Track Button */}
        <Button
          onClick={trackPackage}
          disabled={loading || !waybill.trim()}
          className="w-full"
        >
          {loading ? 'Melacak...' : 'Lacak Paket'}
        </Button>

        {/* Error Display */}
        {error && (
          <div className="text-red-600 text-sm mt-2 p-3 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}

        {/* Tracking Results */}
        {trackingData && (
          <div className="mt-6 space-y-4">
            {/* Package Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Informasi Paket</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium">Nomor Resi:</span> {trackingData.waybill_number}
                </div>
                <div>
                  <span className="font-medium">Kurir:</span> {trackingData.courier_name}
                </div>
                <div>
                  <span className="font-medium">Service:</span> {trackingData.service_name}
                </div>
                <div>
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(trackingData.status)}`}>
                    {trackingData.status}
                  </span>
                </div>
                {trackingData.origin && (
                  <div className="md:col-span-2">
                    <span className="font-medium">Asal:</span> {trackingData.origin}
                  </div>
                )}
                {trackingData.destination && (
                  <div className="md:col-span-2">
                    <span className="font-medium">Tujuan:</span> {trackingData.destination}
                  </div>
                )}
              </div>
            </div>

            {/* Tracking History */}
            {trackingData.manifest && trackingData.manifest.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Riwayat Pengiriman</h4>
                <div className="space-y-3">
                  {trackingData.manifest.map((item, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 pb-3">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-medium text-sm">
                          {item.manifest_description}
                        </div>
                        <div className="text-xs text-gray-500 ml-2">
                          {formatDate(item.manifest_date + ' ' + item.manifest_time)}
                        </div>
                      </div>
                      {item.city_name && (
                        <div className="text-xs text-gray-600">
                          📍 {item.city_name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {trackingData.receiver && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Informasi Penerima</h4>
                <div className="text-sm text-green-700">
                  <div><span className="font-medium">Penerima:</span> {trackingData.receiver}</div>
                  {trackingData.receiver_date_time && (
                    <div><span className="font-medium">Tanggal Terima:</span> {formatDate(trackingData.receiver_date_time)}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {trackingData && !trackingData.manifest && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <div className="text-yellow-800">
              Data tracking tidak ditemukan atau resi belum tersedia dalam sistem.
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}