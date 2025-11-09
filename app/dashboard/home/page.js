'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  LogOut, 
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  Mail,
  FileText,
  Settings,
  Gift
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function DashboardHome() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/dashboard');
    } else if (user) {
      fetchStatistics();
    }
  }, [user, loading, router]);

  const fetchStatistics = async () => {
    try {
      const res = await fetch('/api/statistics');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast.error('Gagal memuat statistik');
    } finally {
      setLoadingStats(false);
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

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
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
              <Link href="/">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700 transition">
                  <span className="text-white text-lg font-bold">PJ</span>
                </div>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard Admin</h1>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Selamat Datang, {user.displayName?.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-600">
            Berikut adalah ringkasan bisnis Pisang Ijo Evi hari ini
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <Card className="hover:shadow-lg transition">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Pesanan
              </CardTitle>
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats?.totalOrders || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                Semua pesanan
              </p>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          <Card className="hover:shadow-lg transition">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Pendapatan
              </CardTitle>
              <DollarSign className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                Rp {(stats?.totalRevenue || 0).toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Dari semua transaksi
              </p>
            </CardContent>
          </Card>

          {/* Total Customers */}
          <Link href="/dashboard/members">
            <Card className="hover:shadow-lg transition cursor-pointer hover:border-green-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Member
                </CardTitle>
                <Users className="w-5 h-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats?.totalCustomers || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Klik untuk kelola member →
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Total Products */}
          <Card className="hover:shadow-lg transition">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Produk
              </CardTitle>
              <Package className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats?.totalProducts || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Produk aktif
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Order Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.ordersByStatus?.pending || 0}
              </div>
              <p className="text-xs text-gray-500">Menunggu konfirmasi</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Dikirim</CardTitle>
              <Truck className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.ordersByStatus?.dikirim || 0}
              </div>
              <p className="text-xs text-gray-500">Sedang dalam pengiriman</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Selesai</CardTitle>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.ordersByStatus?.selesai || 0}
              </div>
              <p className="text-xs text-gray-500">Pesanan selesai</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>Kelola bisnis Anda dengan mudah</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <Link href="/dashboard/hero-slides" className="block">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-blue-300 hover:bg-blue-50">
                  <Settings className="w-6 h-6 text-blue-600" />
                  <span className="text-sm text-blue-700 font-medium">Hero Slides</span>
                </Button>
              </Link>
              <Link href="/dashboard/products" className="block">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Package className="w-6 h-6" />
                  <span className="text-sm">Kelola Produk</span>
                </Button>
              </Link>
              <Link href="/dashboard/orders" className="block">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="text-sm">Lihat Pesanan</span>
                </Button>
              </Link>
              <Link href="/dashboard/members" className="block">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Users className="w-6 h-6" />
                  <span className="text-sm">Kelola Member</span>
                </Button>
              </Link>
              <Link href="/dashboard/blog" className="block">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <FileText className="w-6 h-6" />
                  <span className="text-sm">Blog</span>
                </Button>
              </Link>
              <Link href="/dashboard/newsletter" className="block">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Mail className="w-6 h-6" />
                  <span className="text-sm">Newsletter</span>
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
              <Link href="/dashboard/settings" className="block">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-green-300 hover:bg-green-50">
                  <Gift className="w-6 h-6 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">Promo & Poin</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pesanan Terbaru</CardTitle>
                <CardDescription>5 pesanan terakhir</CardDescription>
              </div>
              <Link href="/dashboard/orders">
                <Button variant="outline" size="sm">Lihat Semua</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <Link 
                    key={order.id} 
                    href="/dashboard/orders"
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        Rp {order.totalAmount?.toLocaleString('id-ID')}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        order.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'dikirim'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada pesanan</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}