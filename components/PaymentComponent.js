'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  PAYMENT_METHODS, 
  BANK_CODES, 
  EWALLET_TYPES, 
  RETAIL_OUTLETS,
  calculateTotalAmount 
} from '@/lib/xendit';
import { 
  CreditCard, 
  Building2, 
  Wallet, 
  Store, 
  QrCode, 
  AlertCircle,
  CheckCircle,
  Clock,
  Copy
} from 'lucide-react';

const PAYMENT_METHOD_ICONS = {
  [PAYMENT_METHODS.VIRTUAL_ACCOUNT]: Building2,
  [PAYMENT_METHODS.EWALLET]: Wallet,
  [PAYMENT_METHODS.CREDIT_CARD]: CreditCard,
  [PAYMENT_METHODS.RETAIL_OUTLET]: Store,
  [PAYMENT_METHODS.QR_CODE]: QrCode
};

const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.VIRTUAL_ACCOUNT]: 'Virtual Account',
  [PAYMENT_METHODS.EWALLET]: 'E-Wallet',
  [PAYMENT_METHODS.CREDIT_CARD]: 'Kartu Kredit',
  [PAYMENT_METHODS.RETAIL_OUTLET]: 'Retail Outlet',
  [PAYMENT_METHODS.QR_CODE]: 'QR Code'
};

const BANK_LABELS = {
  [BANK_CODES.BCA]: 'BCA',
  [BANK_CODES.BNI]: 'BNI',
  [BANK_CODES.BRI]: 'BRI', 
  [BANK_CODES.MANDIRI]: 'Mandiri',
  [BANK_CODES.PERMATA]: 'Permata',
  [BANK_CODES.BJB]: 'BJB'
};

const EWALLET_LABELS = {
  [EWALLET_TYPES.OVO]: 'OVO',
  [EWALLET_TYPES.DANA]: 'DANA',
  [EWALLET_TYPES.LINKAJA]: 'LinkAja',
  [EWALLET_TYPES.SHOPEEPAY]: 'ShopeePay',
  [EWALLET_TYPES.GOPAY]: 'GoPay'
};

const RETAIL_LABELS = {
  [RETAIL_OUTLETS.ALFAMART]: 'Alfamart',
  [RETAIL_OUTLETS.INDOMARET]: 'Indomaret'
};

export default function PaymentComponent({ orderData, onPaymentSuccess, onPaymentError }) {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [ewalletType, setEwalletType] = useState('');
  const [retailOutlet, setRetailOutlet] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [error, setError] = useState('');

  const { baseAmount = 0, items = [] } = orderData || {};
  const { totalAmount, adminFee } = calculateTotalAmount(baseAmount, selectedMethod);

  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // TODO: Add toast notification
  };

  const createPayment = async () => {
    if (!selectedMethod || !customerInfo.name || !customerInfo.email) {
      setError('Mohon lengkapi semua data yang diperlukan');
      return;
    }

    if (selectedMethod === PAYMENT_METHODS.EWALLET && !customerInfo.phone) {
      setError('Nomor telepon diperlukan untuk pembayaran e-wallet');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const paymentData = {
        orderId,
        amount: baseAmount,
        paymentMethod: selectedMethod,
        customerInfo,
        items,
        bankCode: selectedMethod === PAYMENT_METHODS.VIRTUAL_ACCOUNT ? bankCode : undefined,
        ewalletType: selectedMethod === PAYMENT_METHODS.EWALLET ? ewalletType : undefined,
        retailOutletName: selectedMethod === PAYMENT_METHODS.RETAIL_OUTLET ? retailOutlet : undefined
      };

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Terjadi kesalahan saat membuat pembayaran');
        return;
      }

      setPaymentResult(result.data);
      
      if (onPaymentSuccess) {
        onPaymentSuccess(result.data);
      }

    } catch (err) {
      console.error('Payment creation error:', err);
      setError('Terjadi kesalahan pada sistem pembayaran');
      
      if (onPaymentError) {
        onPaymentError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderPaymentResult = () => {
    if (!paymentResult) return null;

    const { payment, orderId } = paymentResult;

    return (
      <Card className="mt-6 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            Pembayaran Berhasil Dibuat
          </CardTitle>
          <CardDescription>
            Order ID: <Badge variant="outline">{orderId}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedMethod === PAYMENT_METHODS.VIRTUAL_ACCOUNT && (
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Bank</Label>
                <p className="text-lg font-semibold">{BANK_LABELS[payment.bankCode]}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Nomor Virtual Account</Label>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-mono font-bold">{payment.accountNumber}</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(payment.accountNumber)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Jumlah Transfer</Label>
                <p className="text-xl font-bold text-blue-600">
                  Rp {payment.amount?.toLocaleString('id-ID')}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Berlaku Hingga</Label>
                <p className="text-sm text-gray-600">
                  {new Date(payment.expirationDate).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          )}

          {selectedMethod === PAYMENT_METHODS.EWALLET && (
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">E-Wallet</Label>
                <p className="text-lg font-semibold">{EWALLET_LABELS[payment.ewalletType]}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Jumlah Pembayaran</Label>
                <p className="text-xl font-bold text-blue-600">
                  Rp {payment.amount?.toLocaleString('id-ID')}
                </p>
              </div>
              {payment.checkoutUrl && (
                <Button 
                  className="w-full"
                  onClick={() => window.open(payment.checkoutUrl, '_blank')}
                >
                  Lanjutkan ke {EWALLET_LABELS[payment.ewalletType]}
                </Button>
              )}
            </div>
          )}

          {selectedMethod === PAYMENT_METHODS.RETAIL_OUTLET && (
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Retail Outlet</Label>
                <p className="text-lg font-semibold">{RETAIL_LABELS[payment.retailOutletName]}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Kode Pembayaran</Label>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-mono font-bold">{payment.paymentCode}</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(payment.paymentCode)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Jumlah Pembayaran</Label>
                <p className="text-xl font-bold text-blue-600">
                  Rp {payment.amount?.toLocaleString('id-ID')}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Berlaku Hingga</Label>
                <p className="text-sm text-gray-600">
                  {new Date(payment.expirationDate).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          )}

          {selectedMethod === PAYMENT_METHODS.QR_CODE && (
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Scan QR Code</Label>
                <div className="flex flex-col items-center space-y-4">
                  {/* QR Code would be rendered here */}
                  <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <QrCode className="h-20 w-20 text-gray-400" />
                  </div>
                  <p className="text-xl font-bold text-blue-600">
                    Rp {payment.amount?.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              Status: <Badge variant="secondary">{payment.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (paymentResult) {
    return renderPaymentResult();
  }

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Pilih Metode Pembayaran</CardTitle>
          <CardDescription>
            Pilih metode pembayaran yang Anda inginkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(PAYMENT_METHODS).map(([key, method]) => {
              const Icon = PAYMENT_METHOD_ICONS[method];
              return (
                <Card 
                  key={method}
                  className={`cursor-pointer transition-all ${
                    selectedMethod === method 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedMethod(method)}
                >
                  <CardContent className="p-4 text-center">
                    <Icon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium">
                      {PAYMENT_METHOD_LABELS[method]}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Specific Options */}
      {selectedMethod === PAYMENT_METHODS.VIRTUAL_ACCOUNT && (
        <Card>
          <CardHeader>
            <CardTitle>Pilih Bank</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={bankCode} onValueChange={setBankCode}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih bank" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(BANK_CODES).map(([key, code]) => (
                  <SelectItem key={code} value={code}>
                    {BANK_LABELS[code]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {selectedMethod === PAYMENT_METHODS.EWALLET && (
        <Card>
          <CardHeader>
            <CardTitle>Pilih E-Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={ewalletType} onValueChange={setEwalletType}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih e-wallet" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EWALLET_TYPES).map(([key, type]) => (
                  <SelectItem key={type} value={type}>
                    {EWALLET_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {selectedMethod === PAYMENT_METHODS.RETAIL_OUTLET && (
        <Card>
          <CardHeader>
            <CardTitle>Pilih Retail Outlet</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={retailOutlet} onValueChange={setRetailOutlet}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih retail outlet" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(RETAIL_OUTLETS).map(([key, outlet]) => (
                  <SelectItem key={outlet} value={outlet}>
                    {RETAIL_LABELS[outlet]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Customer Information */}
      {selectedMethod && (
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pembeli</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                value={customerInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Masukkan email"
                required
              />
            </div>

            {selectedMethod === PAYMENT_METHODS.EWALLET && (
              <div>
                <Label htmlFor="phone">Nomor Telepon *</Label>
                <Input
                  id="phone"
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payment Summary */}
      {selectedMethod && (
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {baseAmount?.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Admin</span>
                <span>Rp {adminFee?.toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">
                    Rp {totalAmount?.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Payment Button */}
      {selectedMethod && (
        <Button 
          className="w-full"
          size="lg"
          onClick={createPayment}
          disabled={isLoading}
        >
          {isLoading ? 'Membuat Pembayaran...' : 'Buat Pembayaran'}
        </Button>
      )}
    </div>
  );
}