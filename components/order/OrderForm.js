'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ShippingCalculator from '@/components/ShippingCalculator';
import { MapPin, User, Phone, MessageSquare } from 'lucide-react';

/**
 * Customer Information Form Component
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
export function CustomerInfoForm({ 
  customerInfo, 
  onCustomerInfoChange, 
  errors = {} 
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Informasi Pemesan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Nama Lengkap *</Label>
          <Input
            id="name"
            value={customerInfo.name || ''}
            onChange={(e) => onCustomerInfoChange('name', e.target.value)}
            placeholder="Masukkan nama lengkap"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Nomor WhatsApp *</Label>
          <Input
            id="phone"
            value={customerInfo.phone || ''}
            onChange={(e) => onCustomerInfoChange('phone', e.target.value)}
            placeholder="08xxxxxxxxxx"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email (Opsional)</Label>
          <Input
            id="email"
            type="email"
            value={customerInfo.email || ''}
            onChange={(e) => onCustomerInfoChange('email', e.target.value)}
            placeholder="email@contoh.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Shipping Information Form Component
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
export function ShippingInfoForm({ 
  shippingInfo, 
  onShippingInfoChange, 
  onShippingCalculated,
  errors = {} 
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Informasi Pengiriman
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="address">Alamat Lengkap *</Label>
          <Textarea
            id="address"
            value={shippingInfo.address || ''}
            onChange={(e) => onShippingInfoChange('address', e.target.value)}
            placeholder="Jalan, nomor rumah, RT/RW, kelurahan..."
            rows={3}
            className={errors.address ? 'border-red-500' : ''}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">Kota *</Label>
            <Input
              id="city"
              value={shippingInfo.city || ''}
              onChange={(e) => onShippingInfoChange('city', e.target.value)}
              placeholder="Nama kota"
              className={errors.city ? 'border-red-500' : ''}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <Label htmlFor="postalCode">Kode Pos *</Label>
            <Input
              id="postalCode"
              value={shippingInfo.postalCode || ''}
              onChange={(e) => onShippingInfoChange('postalCode', e.target.value)}
              placeholder="12345"
              className={errors.postalCode ? 'border-red-500' : ''}
            />
            {errors.postalCode && (
              <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
            )}
          </div>
        </div>

        <ShippingCalculator 
          onShippingCalculated={onShippingCalculated}
          destination={{
            city: shippingInfo.city,
            postalCode: shippingInfo.postalCode
          }}
        />
      </CardContent>
    </Card>
  );
}

/**
 * Additional Notes Form Component
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
export function AdditionalNotesForm({ 
  notes, 
  onNotesChange 
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Catatan Tambahan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={notes || ''}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Catatan khusus untuk pesanan (opsional)..."
          rows={3}
        />
        <p className="text-sm text-gray-500 mt-2">
          Contoh: Warna kemasan, waktu pengiriman khusus, dll.
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Complete Order Form Component
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
export function OrderForm({
  customerInfo,
  onCustomerInfoChange,
  shippingInfo,
  onShippingInfoChange,
  onShippingCalculated,
  notes,
  onNotesChange,
  errors = {}
}) {
  return (
    <div className="space-y-6">
      <CustomerInfoForm
        customerInfo={customerInfo}
        onCustomerInfoChange={onCustomerInfoChange}
        errors={errors}
      />

      <ShippingInfoForm
        shippingInfo={shippingInfo}
        onShippingInfoChange={onShippingInfoChange}
        onShippingCalculated={onShippingCalculated}
        errors={errors}
      />

      <AdditionalNotesForm
        notes={notes}
        onNotesChange={onNotesChange}
      />
    </div>
  );
}