'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AddAddressModal from '@/components/AddAddressModal';
import ProfilePhotoUpload from '@/components/ProfilePhotoUpload';
import { 
  User, 
  Package, 
  MapPin, 
  Gift, 
  Ticket, 
  Share2, 
  Heart, 
  Bell, 
  Trophy,
  LogOut,
  ShoppingCart,
  Calendar,
  ChevronRight,
  Star,
  Award,
  TrendingUp,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function MemberPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [memberData, setMemberData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [profilePhotoURL, setProfilePhotoURL] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        fetchMemberData(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchMemberData = async (currentUser) => {
    try {
      const response = await fetch(`/api/member?email=${currentUser.email}`);
      const data = await response.json();
      
      if (data.success) {
        setMemberData(data.member);
        setOrders(data.orders || []);
        setVouchers(data.vouchers || []);
        
        // Set profile photo from member data or user
        setProfilePhotoURL(data.member?.photoURL || currentUser.photoURL || null);
      }

      // Fetch addresses
      await fetchAddresses(currentUser.email);
    } catch (error) {
      console.error('Error fetching member data:', error);
      toast.error('Gagal memuat data member');
    }
  };

  const fetchAddresses = async (email) => {
    try {
      const response = await fetch(`/api/member/addresses?email=${email}`);
      const data = await response.json();
      
      if (data.success) {
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Yakin ingin menghapus alamat ini?')) return;

    try {
      const response = await fetch(`/api/member/addresses?id=${addressId}&email=${user.email}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Alamat berhasil dihapus');
        fetchAddresses(user.email);
      } else {
        toast.error(data.error || 'Gagal menghapus alamat');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Gagal menghapus alamat');
    }
  };

  const handleShareReferral = async () => {
    const shareText = `Yuk cobain Pisang Ijo Evi yang enak! 🍌\n\nDaftar pakai kode referral saya: ${memberData?.referralCode}\n\nKamu dapat 30 poin bonus langsung! 🎁\n\nhttps://pisang-ijo.com/signup`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ajak Teman ke Pisang Ijo Evi',
          text: shareText
        });
        toast.success('Berhasil share referral code!');
      } catch (error) {
        if (error.name !== 'AbortError') {
          copyToClipboard(shareText);
        }
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Referral code disalin ke clipboard!');
  };

  const handleCopyVoucher = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Kode voucher ${code} disalin!`);
  };

  const handlePhotoUpdated = (newPhotoURL) => {
    setProfilePhotoURL(newPhotoURL);
    toast.success('Foto profil berhasil diperbarui!');
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast.success('Logout berhasil');
      router.push('/');
    } catch (error) {
      toast.error('Logout gagal');
    }
  };

  const getMemberBadge = (level) => {
    const badges = {
      Rookie: { color: '#CD7F32', icon: '🥉' },
      Silver: { color: '#C0C0C0', icon: '🥈' },
      Gold: { color: '#FFD700', icon: '🥇' },
      Platinum: { color: '#E5E4E2', icon: '💎' },
      Master: { color: '#214929', icon: '👑' }
    };
    return badges[level] || badges.Rookie;
  };

  const getNextLevel = (currentLevel) => {
    const levels = ['Rookie', 'Silver', 'Gold', 'Platinum', 'Master'];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : 'Master';
  };

  const getPointsToNextLevel = (points) => {
    if (points >= 500) return 0; // Already Master
    if (points >= 300) return 500 - points; // To Master
    if (points >= 150) return 300 - points; // To Platinum
    if (points >= 50) return 150 - points; // To Gold
    return 50 - points; // To Silver
  };

  if (loading || !memberData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EBDEC5' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#214929' }}></div>
      </div>
    );
  }

  const badge = getMemberBadge(memberData.level);
  const nextLevel = getNextLevel(memberData.level);
  const pointsToNextLevel = getPointsToNextLevel(memberData.points);
  const progressPercentage = memberData.level === 'Master' 
    ? 100 
    : ((memberData.points / (memberData.points + pointsToNextLevel)) * 100).toFixed(0);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EBDEC5' }}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair), serif', color: '#214929' }}>
                Member Area
              </h1>
            </Link>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="gap-2"
              style={{ borderColor: '#214929', color: '#214929' }}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Section */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <ProfilePhotoUpload
                  currentPhotoURL={profilePhotoURL}
                  userEmail={user.email}
                  userName={user.displayName}
                  onPhotoUpdated={handlePhotoUpdated}
                />
                <div 
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg"
                  style={{ backgroundColor: badge.color }}
                >
                  {badge.icon}
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair), serif', color: '#214929' }}>
                  {user.displayName || 'Member'}
                </h2>
                <p className="text-gray-600 mb-1">{user.email}</p>
                <p className="text-sm text-gray-500 flex items-center gap-2 justify-center md:justify-start">
                  <Calendar className="w-4 h-4" />
                  Member sejak {new Date(memberData.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </p>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: badge.color + '20', color: badge.color }}>
                  <Trophy className="w-4 h-4" />
                  Level {memberData.level}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#214929' }}>{memberData.totalOrders}</p>
                  <p className="text-sm text-gray-600">Total Pesanan</p>
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#214929' }}>{memberData.points}</p>
                  <p className="text-sm text-gray-600">Poin</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loyalty Points & Progress */}
        <Card className="mb-6" style={{ borderColor: '#FCD900', borderWidth: '2px' }}>
          <CardHeader style={{ backgroundColor: '#FCD900' + '20' }}>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2" style={{ color: '#214929' }}>
                  <Gift className="w-5 h-5" />
                  Poin & Reward
                </CardTitle>
                <CardDescription>Kumpulkan poin dan dapatkan hadiah menarik!</CardDescription>
              </div>
              <Award className="w-8 h-8" style={{ color: '#FCD900' }} />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Kamu punya {memberData.points} Poin!</span>
                <span className="text-sm text-gray-600">Target: {nextLevel}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 rounded-full transition-all"
                  style={{ width: `${progressPercentage}%`, backgroundColor: '#214929' }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {memberData.level === 'Master' 
                  ? '🏆 Selamat! Kamu sudah mencapai level tertinggi!' 
                  : `Tinggal ${pointsToNextLevel} poin lagi untuk level ${nextLevel}! 🎯`
                }
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#EBDEC5' }}>
                <p className="text-sm text-gray-600 mb-1">Reward Tersedia</p>
                <p className="font-bold" style={{ color: '#214929' }}>🍌 Cup Pisang Ijo Gratis (150 poin)</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#EBDEC5' }}>
                <p className="text-sm text-gray-600 mb-1">Reward Spesial</p>
                <p className="font-bold" style={{ color: '#214929' }}>🎁 Diskon 20% (300 poin)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Vouchers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#214929' }}>
                <Ticket className="w-5 h-5" />
                Voucher Saya
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vouchers.length > 0 ? (
                  vouchers.map((voucher) => (
                    <div 
                      key={voucher._id}
                      className="p-3 rounded-lg border-2 border-dashed flex justify-between items-center"
                      style={{ borderColor: '#214929' }}
                    >
                      <div>
                        <p className="font-bold" style={{ color: '#214929' }}>{voucher.code}</p>
                        <p className="text-sm text-gray-600">{voucher.discount}</p>
                        <p className="text-xs text-gray-500">
                          Valid: {new Date(voucher.validUntil).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        style={{ backgroundColor: '#214929' }}
                        onClick={() => handleCopyVoucher(voucher.code)}
                      >
                        Salin
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">Belum ada voucher tersedia</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Referral */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#214929' }}>
                <Share2 className="w-5 h-5" />
                Ajak Teman
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#EBDEC5' }}>
                <p className="text-sm text-gray-600 mb-2">Kode Referral Kamu</p>
                <p className="text-2xl font-bold mb-3" style={{ color: '#214929', fontFamily: 'monospace' }}>
                  {memberData.referralCode}
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <Button 
                    variant="outline"
                    style={{ borderColor: '#214929', color: '#214929' }}
                    onClick={() => copyToClipboard(memberData.referralCode)}
                  >
                    📋 Salin Kode
                  </Button>
                  <Button 
                    style={{ backgroundColor: '#214929' }}
                    onClick={handleShareReferral}
                  >
                    📤 Share
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  🎁 Ajak teman dan kalian berdua dapat 30 poin!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order History */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2" style={{ color: '#214929' }}>
                <Package className="w-5 h-5" />
                Riwayat Pesanan
              </CardTitle>
              <Link href="/dashboard/orders">
                <Button variant="outline" size="sm" style={{ borderColor: '#214929', color: '#214929' }}>
                  Lihat Semua
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} className="p-4 rounded-lg border hover:shadow-md transition">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-bold" style={{ color: '#214929' }}>{order.orderNumber}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'selesai' 
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'dikirim'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <p className="text-sm text-gray-700 mt-1">
                          {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-bold text-lg" style={{ color: '#214929' }}>
                            Rp {order.total.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <Button 
                          size="sm"
                          style={{ backgroundColor: '#214929' }}
                        >
                          Pesan Lagi
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Belum ada pesanan</p>
                  <Link href="/menu">
                    <Button className="mt-4" style={{ backgroundColor: '#214929' }}>
                      Mulai Belanja
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: '#214929' }}>
              <MapPin className="w-5 h-5" />
              Alamat Favorit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {addresses.length > 0 && addresses.map((address) => (
                <div key={address._id} className="p-4 rounded-lg border hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold" style={{ color: '#214929' }}>{address.label}</p>
                        {address.isDefault && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                            Utama
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{address.address}</p>
                      {address.notes && (
                        <p className="text-xs text-gray-500 italic">Catatan: {address.notes}</p>
                      )}
                      {address.latitude && address.longitude && (
                        <a 
                          href={`https://www.google.com/maps?q=${address.latitude},${address.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-1 inline-flex items-center gap-1"
                        >
                          <MapPin className="w-3 h-3" />
                          Lihat di Maps
                        </a>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteAddress(address._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setShowAddAddressModal(true)}
                className="p-4 rounded-lg border-2 border-dashed hover:bg-gray-50 transition flex items-center justify-center gap-2" 
                style={{ borderColor: '#214929', color: '#214929' }}
              >
                <MapPin className="w-5 h-5" />
                Tambah Alamat Favorit
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Wishlist & Notifications */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#214929' }}>
                <Heart className="w-5 h-5" />
                Wishlist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="mb-3">Belum ada produk favorit</p>
                <Link href="/menu">
                  <Button variant="outline" style={{ borderColor: '#214929', color: '#214929' }}>
                    Jelajahi Menu
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#214929' }}>
                <Bell className="w-5 h-5" />
                Notifikasi & Promo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#EBDEC5' }}>
                  <p className="text-sm font-medium mb-1" style={{ color: '#214929' }}>🎉 Promo Mingguan!</p>
                  <p className="text-xs text-gray-600">Diskon 15% untuk semua menu special weekend ini</p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#EBDEC5' }}>
                  <p className="text-sm font-medium mb-1" style={{ color: '#214929' }}>🎂 Special Birthday!</p>
                  <p className="text-xs text-gray-600">Dapatkan voucher ulang tahun spesial bulan ini</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Add Address Modal */}
      <AddAddressModal
        isOpen={showAddAddressModal}
        onClose={() => setShowAddAddressModal(false)}
        userEmail={user?.email}
        onAddressAdded={() => fetchAddresses(user.email)}
      />
    </div>
  );
}
