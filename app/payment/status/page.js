'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle,
  Home,
  Receipt,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';

const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800',
    title: 'Menunggu Pembayaran',
    description: 'Silakan selesaikan pembayaran sesuai instruksi di bawah'
  },
  paid: {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800',
    title: 'Pembayaran Berhasil',
    description: 'Terima kasih! Pesanan Anda sedang diproses'
  },
  expired: {
    icon: XCircle,
    color: 'bg-red-100 text-red-800',
    title: 'Pembayaran Kedaluwarsa',
    description: 'Batas waktu pembayaran sudah habis'
  },
  failed: {
    icon: AlertCircle,
    color: 'bg-red-100 text-red-800',
    title: 'Pembayaran Gagal',
    description: 'Terjadi kesalahan saat memproses pembayaran'
  }
};

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchPaymentStatus();
      // Auto refresh setiap 30 detik untuk status pending
      const interval = setInterval(() => {
        if (paymentData?.status === 'pending') {
          fetchPaymentStatus();
        }
      }, 30000);

      return () => clearInterval(interval);
    } else {
      setError('Order ID tidak ditemukan');
      setLoading(false);
    }
  }, [orderId]);

  const fetchPaymentStatus = async () => {
    try {
      const response = await fetch(`/api/payments?orderId=${orderId}`);
      
      if (!response.ok) {
        throw new Error('Gagal mengambil status pembayaran');
      }

      const result = await response.json();
      
      if (result.success) {
        setPaymentData(result.data);
      } else {
        setError(result.error || 'Data pembayaran tidak ditemukan');
      }
    } catch (err) {
      console.error('Error fetching payment status:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Berhasil disalin ke clipboard');
  };

  const refreshStatus = () => {
    setLoading(true);
    fetchPaymentStatus();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat status pembayaran...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Terjadi Kesalahan</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/pesan">
              <Button className="bg-green-600 hover:bg-green-700">
                <Home className="h-4 w-4 mr-2" />
                Kembali ke Pemesanan
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[paymentData?.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

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

      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Status Header */}
        <Card className="mb-6">
          <CardContent className="pt-6 text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${statusConfig.color.replace('text-', 'bg-').replace('800', '200')}`}>
              <StatusIcon className={`h-8 w-8 ${statusConfig.color.split(' ')[1]}`} />
            </div>
            <h1 className="text-2xl font-bold mb-2">{statusConfig.title}</h1>
            <p className="text-gray-600 mb-4">{statusConfig.description}</p>
            <Badge className={statusConfig.color}>
              {paymentData?.status?.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Detail Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Order ID</label>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-semibold">{paymentData?.orderId}</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(paymentData?.orderId)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Metode Pembayaran</label>
                  <p className="font-semibold">{paymentData?.paymentMethod}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tanggal Pesanan</label>
                  <p>{new Date(paymentData?.createdAt).toLocaleString('id-ID')}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Pembayaran</label>
                  <p className="text-2xl font-bold text-green-600">
                    Rp {paymentData?.amount?.toLocaleString('id-ID')}
                  </p>
                </div>
                {paymentData?.updatedAt && paymentData?.updatedAt !== paymentData?.createdAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Terakhir Diupdate</label>
                    <p>{new Date(paymentData?.updatedAt).toLocaleString('id-ID')}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Instructions - untuk status pending */}
        {paymentData?.status === 'pending' && paymentData?.paymentData && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Instruksi Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Tampilkan instruksi sesuai method pembayaran */}
              {paymentData.paymentMethod === 'VIRTUAL_ACCOUNT' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Bank</label>
                    <p className="text-lg font-semibold">{paymentData.paymentData.bankCode}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nomor Virtual Account</label>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-mono font-bold">{paymentData.paymentData.accountNumber}</p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(paymentData.paymentData.accountNumber)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Cara Pembayaran:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Transfer ke nomor virtual account di atas</li>
                      <li>Masukkan jumlah yang sama persis: Rp {paymentData.amount?.toLocaleString('id-ID')}</li>
                      <li>Simpan bukti transfer</li>
                      <li>Pembayaran akan otomatis terkonfirmasi</li>
                    </ol>
                  </div>
                </div>
              )}

              {paymentData.paymentMethod === 'EWALLET' && paymentData.paymentData.checkoutUrl && (
                <div className="text-center">
                  <p className="mb-4">Klik tombol di bawah untuk melanjutkan pembayaran</p>
                  <Button 
                    size="lg"
                    onClick={() => window.open(paymentData.paymentData.checkoutUrl, '_blank')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Bayar dengan {paymentData.paymentData.ewalletType}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {paymentData?.status === 'pending' && (
            <Button onClick={refreshStatus} variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          )}
          
          <Link href="/">
            <Button className="bg-green-600 hover:bg-green-700">
              <Home className="h-4 w-4 mr-2" />
              Kembali ke Home
            </Button>
          </Link>
          
          <Link href="/pesan">
            <Button variant="outline">
              Pesan Lagi
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat halaman...</p>
        </div>
      </div>
    }>
      <PaymentStatusContent />
    </Suspense>
  );
}