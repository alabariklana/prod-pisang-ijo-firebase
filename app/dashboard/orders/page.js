'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  LogOut, 
  Search,
  Filter,
  Download,
  Eye,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function OrdersPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/dashboard');
    } else if (user) {
      fetchOrders();
    }
  }, [user, loading, router]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        toast.error('Gagal memuat pesanan');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Gagal memuat pesanan');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logout berhasil');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Logout gagal');
      console.error('Signout error:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        toast.success('Status pesanan berhasil diperbarui');
        fetchOrders();
        setShowDetailModal(false);
      } else {
        toast.error('Gagal memperbarui status pesanan');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Gagal memperbarui status pesanan');
    }
  };

  const viewOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'dikonfirmasi': return <CheckCircle className="w-4 h-4" />;
      case 'dikirim': return <Truck className="w-4 h-4" />;
      case 'selesai': return <CheckCircle className="w-4 h-4" />;
      case 'dibatalkan': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'dikonfirmasi': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'dikirim': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'selesai': return 'bg-green-100 text-green-800 border-green-300';
      case 'dibatalkan': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading || loadingOrders) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat pesanan...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/home">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700 transition">
                  <span className="text-white text-lg font-bold">PJ</span>
                </div>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Kelola Pesanan</h1>
                <p className="text-sm text-gray-500">Pisang Ijo Evi</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3">
                <img 
                  src={user.photoURL || '/default-avatar.png'} 
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full border-2 border-green-500"
                />
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/dashboard/home">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Kembali
              </Button>
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Daftar Pesanan
          </h2>
          <p className="text-gray-600">
            Kelola dan pantau semua pesanan pelanggan
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Cari nomor order, nama, atau email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                <Filter className="w-5 h-5 text-gray-400 self-center" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="dikonfirmasi">Dikonfirmasi</option>
                  <option value="dikirim">Dikirim</option>
                  <option value="selesai">Selesai</option>
                  <option value="dibatalkan">Dibatalkan</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              <p className="text-xs text-gray-500">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'pending').length}
              </p>
              <p className="text-xs text-gray-500">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.status === 'dikonfirmasi').length}
              </p>
              <p className="text-xs text-gray-500">Dikonfirmasi</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-purple-600">
                {orders.filter(o => o.status === 'dikirim').length}
              </p>
              <p className="text-xs text-gray-500">Dikirim</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'selesai').length}
              </p>
              <p className="text-xs text-gray-500">Selesai</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pesanan ({filteredOrders.length})</CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div 
                    key={order._id || order.id} 
                    className="border rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-gray-900">
                            {order.orderNumber}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{order.customerName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{order.customerPhone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>
                              {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 inline mr-1 text-gray-400" />
                          {order.customerAddress}
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end gap-2">
                        <p className="text-xl font-bold text-gray-900">
                          Rp {(order.totalAmount || 0).toLocaleString('id-ID')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.items?.length || 0} item
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => viewOrderDetail(order)}
                          className="gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Detail
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Tidak ada pesanan</p>
                <p className="text-sm">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Coba ubah filter pencarian Anda' 
                    : 'Belum ada pesanan masuk'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Detail Pesanan
                </h3>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-lg">{selectedOrder.orderNumber}</h4>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Tanggal Pesanan</p>
                    <p className="font-medium">
                      {new Date(selectedOrder.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Total Pembayaran</p>
                    <p className="font-bold text-xl text-green-600">
                      Rp {(selectedOrder.totalAmount || 0).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t pt-4">
                <h4 className="font-bold mb-3">Informasi Pelanggan</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Nama</p>
                      <p className="font-medium">{selectedOrder.customerName}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Telepon</p>
                      <p className="font-medium">{selectedOrder.customerPhone}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">{selectedOrder.customerEmail}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Alamat Pengiriman</p>
                      <p className="font-medium">{selectedOrder.customerAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              {selectedOrder.shipping && (
                <div className="border-t pt-4">
                  <h4 className="font-bold mb-3">Informasi Pengiriman</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Kurir</p>
                        <p className="font-semibold">{selectedOrder.shipping.courierName} ({selectedOrder.shipping.courier})</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Layanan</p>
                        <p className="font-semibold">{selectedOrder.shipping.service}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Ongkir</p>
                        <p className="font-semibold">Rp {(selectedOrder.shippingCost || 0).toLocaleString('id-ID')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Estimasi</p>
                        <p className="font-semibold">{selectedOrder.shipping.etd} hari</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-600 mb-1">Tujuan</p>
                        <p className="font-semibold">
                          {selectedOrder.shipping.destination?.cityName}, {selectedOrder.shipping.destination?.provinceName}
                        </p>
                      </div>
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div className="mt-4 pt-4 border-t border-blue-300">
                        <p className="text-gray-600 mb-1">Nomor Resi</p>
                        <p className="font-semibold text-lg">{selectedOrder.trackingNumber}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="border-t pt-4">
                <h4 className="font-bold mb-3">Item Pesanan</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{item.productName || item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity}x @ Rp {(item.price || 0).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <p className="font-bold">
                        Rp {((item.quantity * item.price) || 0).toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
                  
                  {/* Order Summary */}
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal Produk:</span>
                      <span>Rp {(selectedOrder.subtotal || 0).toLocaleString('id-ID')}</span>
                    </div>
                    {selectedOrder.shippingCost > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Ongkir:</span>
                        <span>Rp {(selectedOrder.shippingCost || 0).toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total:</span>
                      <span className="text-green-600">Rp {(selectedOrder.totalAmount || 0).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="border-t pt-4">
                  <h4 className="font-bold mb-2">Catatan</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="border-t pt-4">
                <h4 className="font-bold mb-3">Ubah Status Pesanan</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateOrderStatus(selectedOrder._id || selectedOrder.id, 'pending')}
                    className="gap-2"
                    disabled={selectedOrder.status === 'pending'}
                  >
                    <Clock className="w-4 h-4" />
                    Pending
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateOrderStatus(selectedOrder._id || selectedOrder.id, 'dikonfirmasi')}
                    className="gap-2"
                    disabled={selectedOrder.status === 'dikonfirmasi'}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Konfirmasi
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateOrderStatus(selectedOrder._id || selectedOrder.id, 'dikirim')}
                    className="gap-2"
                    disabled={selectedOrder.status === 'dikirim'}
                  >
                    <Truck className="w-4 h-4" />
                    Dikirim
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateOrderStatus(selectedOrder._id || selectedOrder.id, 'selesai')}
                    className="gap-2 border-green-300 text-green-700 hover:bg-green-50"
                    disabled={selectedOrder.status === 'selesai'}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Selesai
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateOrderStatus(selectedOrder._id || selectedOrder.id, 'dibatalkan')}
                    className="gap-2 border-red-300 text-red-700 hover:bg-red-50"
                    disabled={selectedOrder.status === 'dibatalkan'}
                  >
                    <XCircle className="w-4 h-4" />
                    Batalkan
                  </Button>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
              <Button 
                onClick={() => setShowDetailModal(false)}
                className="w-full"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
