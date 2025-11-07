'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Gift,
  Trophy,
  Package,
  MapPin,
  Share2,
  Award,
  TrendingUp,
  Edit,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

const ALLOWED_ADMINS = ['alaunasbariklana@gmail.com', 'zelvidiana@gmail.com'];

export default function MemberDetailPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedPoints, setEditedPoints] = useState(0);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser || !ALLOWED_ADMINS.includes(currentUser.email)) {
        router.push('/dashboard');
      } else {
        setUser(currentUser);
        fetchMemberDetail();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchMemberDetail = async () => {
    try {
      const response = await fetch(`/api/admin/members/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setMember(data.member);
        setEditedPoints(data.member.points || 0);
        setOrders(data.orders || []);
        setAddresses(data.addresses || []);
        setVouchers(data.vouchers || []);
      }
    } catch (error) {
      console.error('Error fetching member detail:', error);
      toast.error('Gagal memuat data member');
    }
  };

  const handleSavePoints = async () => {
    try {
      const response = await fetch(`/api/admin/members/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: parseInt(editedPoints) })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Poin berhasil diupdate!');
        setMember({ ...member, points: parseInt(editedPoints), level: data.newLevel });
        setEditMode(false);
      } else {
        toast.error(data.error || 'Gagal update poin');
      }
    } catch (error) {
      console.error('Error updating points:', error);
      toast.error('Gagal update poin');
    }
  };

  const getMemberBadge = (level) => {
    const badges = {
      Rookie: { color: '#CD7F32', icon: '🥉', bg: '#F4E4D7' },
      Silver: { color: '#C0C0C0', icon: '🥈', bg: '#F0F0F0' },
      Gold: { color: '#FFD700', icon: '🥇', bg: '#FFF9E6' },
      Platinum: { color: '#E5E4E2', icon: '💎', bg: '#F8F8F8' },
      Master: { color: '#214929', icon: '👑', bg: '#E8F5E9' }
    };
    return badges[level] || badges.Rookie;
  };

  if (loading || !member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#214929' }}></div>
      </div>
    );
  }

  const badge = getMemberBadge(member.level);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EBDEC5' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard/members">
            <Button variant="outline" className="mb-4" style={{ borderColor: '#214929', color: '#214929' }}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair), serif', color: '#214929' }}>
            Detail Member
          </h1>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                {member.photoURL ? (
                  <Image
                    src={member.photoURL}
                    alt={member.name || member.email}
                    width={120}
                    height={120}
                    className="w-30 h-30 rounded-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-30 h-30 rounded-full flex items-center justify-center text-white text-4xl font-bold"
                    style={{ backgroundColor: '#214929', width: '120px', height: '120px' }}
                  >
                    {member.name?.charAt(0)?.toUpperCase() || member.email?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div 
                  className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg"
                  style={{ backgroundColor: badge.color }}
                >
                  {badge.icon}
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#214929' }}>
                  {member.name || 'Member'}
                </h2>
                <div className="space-y-2 mb-3">
                  <p className="flex items-center gap-2 text-gray-600 justify-center md:justify-start">
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 justify-center md:justify-start">
                    <Calendar className="w-4 h-4" />
                    Bergabung {new Date(member.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 justify-center md:justify-start">
                    <Gift className="w-4 h-4" />
                    Kode Referral: <span className="font-mono font-bold" style={{ color: '#214929' }}>{member.referralCode}</span>
                  </p>
                  {member.referredBy && (
                    <p className="flex items-center gap-2 text-gray-600 justify-center md:justify-start">
                      <Share2 className="w-4 h-4" />
                      Direferensikan oleh: {member.referredBy}
                    </p>
                  )}
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: badge.bg, color: badge.color }}>
                  <Trophy className="w-4 h-4" />
                  Level {member.level}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#EBDEC5' }}>
                  <Package className="w-6 h-6 mx-auto mb-2" style={{ color: '#214929' }} />
                  <p className="text-2xl font-bold" style={{ color: '#214929' }}>{orders.length}</p>
                  <p className="text-sm text-gray-600">Total Pesanan</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#EBDEC5' }}>
                  <Gift className="w-6 h-6 mx-auto mb-2" style={{ color: '#FCD900' }} />
                  {editMode ? (
                    <Input
                      type="number"
                      value={editedPoints}
                      onChange={(e) => setEditedPoints(e.target.value)}
                      className="w-20 mx-auto text-center font-bold text-xl"
                    />
                  ) : (
                    <p className="text-2xl font-bold" style={{ color: '#214929' }}>{member.points}</p>
                  )}
                  <p className="text-sm text-gray-600">Poin</p>
                  {!editMode ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditMode(true)}
                      className="mt-2"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2 mt-2 justify-center">
                      <Button
                        size="sm"
                        onClick={handleSavePoints}
                        style={{ backgroundColor: '#214929' }}
                      >
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditMode(false);
                          setEditedPoints(member.points);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#214929' }}>
                <Package className="w-5 h-5" />
                Riwayat Pesanan ({orders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <div key={order._id} className="p-3 rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold" style={{ color: '#214929' }}>
                          {order.orderNumber || 'N/A'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'selesai' || order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'dikirim' || order.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('id-ID')}
                      </p>
                      <p className="text-sm font-medium mt-1">
                        Rp {(order.totalAmount || 0).toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">Belum ada pesanan</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#214929' }}>
                <MapPin className="w-5 h-5" />
                Alamat Tersimpan ({addresses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {addresses.length > 0 ? (
                  addresses.map((address) => (
                    <div key={address._id} className="p-3 rounded-lg border">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-bold" style={{ color: '#214929' }}>{address.label}</p>
                        {address.isDefault && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                            Utama
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{address.address}</p>
                      {address.notes && (
                        <p className="text-xs text-gray-500 italic mt-1">Catatan: {address.notes}</p>
                      )}
                      {address.latitude && address.longitude && (
                        <a 
                          href={`https://www.google.com/maps?q=${address.latitude},${address.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                        >
                          Lihat di Maps →
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">Belum ada alamat tersimpan</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vouchers */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#214929' }}>
                <Award className="w-5 h-5" />
                Voucher Member ({vouchers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {vouchers.length > 0 ? (
                  vouchers.map((voucher) => (
                    <div 
                      key={voucher._id}
                      className="p-3 rounded-lg border-2 border-dashed"
                      style={{ borderColor: voucher.used ? '#ccc' : '#214929' }}
                    >
                      <p className="font-bold mb-1" style={{ color: voucher.used ? '#999' : '#214929' }}>
                        {voucher.code}
                      </p>
                      <p className="text-sm text-gray-600">{voucher.discount}</p>
                      <p className="text-xs text-gray-500">
                        Valid: {new Date(voucher.validUntil).toLocaleDateString('id-ID')}
                      </p>
                      {voucher.used && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 mt-2 inline-block">
                          Sudah digunakan
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4 col-span-full">Belum ada voucher</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
