'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Trophy, 
  Gift, 
  Calendar,
  Mail,
  Phone,
  MapPin,
  Eye,
  Ban,
  CheckCircle,
  Filter,
  Download,
  TrendingUp,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

const ALLOWED_ADMINS = ['alaunasbariklana@gmail.com', 'zelvidiana@gmail.com'];

export default function MembersPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    rookie: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
    master: 0,
    totalPoints: 0
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser || !ALLOWED_ADMINS.includes(currentUser.email)) {
        router.push('/dashboard');
      } else {
        setUser(currentUser);
        fetchMembers();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/admin/members');
      const data = await response.json();
      
      if (data.success) {
        setMembers(data.members || []);
        calculateStats(data.members || []);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Gagal memuat data member');
    }
  };

  const calculateStats = (memberList) => {
    const stats = {
      total: memberList.length,
      rookie: memberList.filter(m => m.level === 'Rookie').length,
      silver: memberList.filter(m => m.level === 'Silver').length,
      gold: memberList.filter(m => m.level === 'Gold').length,
      platinum: memberList.filter(m => m.level === 'Platinum').length,
      master: memberList.filter(m => m.level === 'Master').length,
      totalPoints: memberList.reduce((sum, m) => sum + (m.points || 0), 0)
    };
    setStats(stats);
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.name && member.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLevel = filterLevel === 'all' || member.level === filterLevel;
    
    return matchesSearch && matchesLevel;
  });

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

  const exportToCSV = () => {
    const headers = ['Email', 'Nama', 'Level', 'Poin', 'Total Pesanan', 'Kode Referral', 'Bergabung'];
    const rows = filteredMembers.map(m => [
      m.email,
      m.name || '-',
      m.level,
      m.points,
      m.totalOrders,
      m.referralCode,
      new Date(m.createdAt).toLocaleDateString('id-ID')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `members_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Data member berhasil diexport!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#214929' }}></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EBDEC5' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair), serif', color: '#214929' }}>
                Manajemen Member
              </h1>
              <p className="text-gray-600">Kelola dan pantau semua member Pisang Ijo Evi</p>
            </div>
            <Link href="/dashboard/home">
              <Button variant="outline" style={{ borderColor: '#214929', color: '#214929' }}>
                Kembali ke Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2" style={{ color: '#214929' }} />
              <p className="text-2xl font-bold" style={{ color: '#214929' }}>{stats.total}</p>
              <p className="text-xs text-gray-600">Total Member</p>
            </CardContent>
          </Card>
          
          <Card style={{ backgroundColor: getMemberBadge('Rookie').bg }}>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl mb-2">{getMemberBadge('Rookie').icon}</div>
              <p className="text-xl font-bold" style={{ color: getMemberBadge('Rookie').color }}>{stats.rookie}</p>
              <p className="text-xs text-gray-600">Rookie</p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: getMemberBadge('Silver').bg }}>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl mb-2">{getMemberBadge('Silver').icon}</div>
              <p className="text-xl font-bold" style={{ color: getMemberBadge('Silver').color }}>{stats.silver}</p>
              <p className="text-xs text-gray-600">Silver</p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: getMemberBadge('Gold').bg }}>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl mb-2">{getMemberBadge('Gold').icon}</div>
              <p className="text-xl font-bold" style={{ color: getMemberBadge('Gold').color }}>{stats.gold}</p>
              <p className="text-xs text-gray-600">Gold</p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: getMemberBadge('Platinum').bg }}>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl mb-2">{getMemberBadge('Platinum').icon}</div>
              <p className="text-xl font-bold" style={{ color: getMemberBadge('Platinum').color }}>{stats.platinum}</p>
              <p className="text-xs text-gray-600">Platinum</p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: getMemberBadge('Master').bg }}>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl mb-2">{getMemberBadge('Master').icon}</div>
              <p className="text-xl font-bold" style={{ color: getMemberBadge('Master').color }}>{stats.master}</p>
              <p className="text-xs text-gray-600">Master</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Gift className="w-8 h-8 mx-auto mb-2" style={{ color: '#FCD900' }} />
              <p className="text-2xl font-bold" style={{ color: '#214929' }}>{stats.totalPoints.toLocaleString()}</p>
              <p className="text-xs text-gray-600">Total Poin</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Cari member (email atau nama)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-4 py-2 border rounded-md"
                style={{ borderColor: '#214929' }}
              >
                <option value="all">Semua Level</option>
                <option value="Rookie">🥉 Rookie</option>
                <option value="Silver">🥈 Silver</option>
                <option value="Gold">🥇 Gold</option>
                <option value="Platinum">💎 Platinum</option>
                <option value="Master">👑 Master</option>
              </select>
              <Button 
                onClick={exportToCSV}
                style={{ backgroundColor: '#214929' }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => {
              const badge = getMemberBadge(member.level);
              return (
                <Card key={member._id} className="hover:shadow-lg transition">
                  <CardContent className="pt-6">
                    {/* Profile Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        {member.photoURL ? (
                          <Image
                            src={member.photoURL}
                            alt={member.name || member.email}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
                            style={{ backgroundColor: '#214929' }}
                          >
                            {member.name?.charAt(0)?.toUpperCase() || member.email?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                        <div 
                          className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-sm shadow"
                          style={{ backgroundColor: badge.color }}
                        >
                          {badge.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate" style={{ color: '#214929' }}>
                          {member.name || 'Member'}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">{member.email}</p>
                        <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: badge.bg, color: badge.color }}>
                          <Trophy className="w-3 h-3" />
                          {member.level}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-lg" style={{ backgroundColor: '#EBDEC5' }}>
                      <div className="text-center">
                        <p className="text-xl font-bold" style={{ color: '#214929' }}>{member.points || 0}</p>
                        <p className="text-xs text-gray-600">Poin</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold" style={{ color: '#214929' }}>{member.totalOrders || 0}</p>
                        <p className="text-xs text-gray-600">Pesanan</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold" style={{ color: '#214929' }}>
                          {member.referredBy ? '✓' : '-'}
                        </p>
                        <p className="text-xs text-gray-600">Referral</p>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Bergabung: {new Date(member.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Gift className="w-4 h-4" />
                        Kode Referral: <span className="font-mono font-bold" style={{ color: '#214929' }}>{member.referralCode}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <Link href={`/dashboard/members/${member._id}`}>
                      <Button 
                        className="w-full"
                        variant="outline"
                        style={{ borderColor: '#214929', color: '#214929' }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Lihat Detail
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Tidak ada member yang ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
