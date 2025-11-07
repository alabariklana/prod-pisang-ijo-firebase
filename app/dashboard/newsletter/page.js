'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Mail, 
  Search, 
  Download, 
  Send,
  Trash2,
  Users,
  UserCheck,
  UserX,
  Calendar,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const ALLOWED_ADMINS = ['alaunasbariklana@gmail.com', 'zelvidiana@gmail.com'];

export default function NewsletterPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, unsubscribed: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showBlastModal, setShowBlastModal] = useState(false);
  const [blastSubject, setBlastSubject] = useState('');
  const [blastMessage, setBlastMessage] = useState('');
  const [sending, setSending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser || !ALLOWED_ADMINS.includes(currentUser.email)) {
        router.push('/dashboard');
      } else {
        setUser(currentUser);
        fetchSubscribers();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/newsletter/subscribers');
      const data = await response.json();
      
      if (data.success) {
        setSubscribers(data.subscribers || []);
        setStats(data.stats || { total: 0, active: 0, unsubscribed: 0 });
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Gagal memuat data subscriber');
    }
  };

  const handleDelete = async (email) => {
    if (!confirm(`Yakin ingin menghapus ${email} dari newsletter?`)) return;

    try {
      const response = await fetch(`/api/newsletter/subscribers?email=${email}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Subscriber berhasil dihapus');
        fetchSubscribers();
      } else {
        toast.error(data.error || 'Gagal menghapus subscriber');
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast.error('Gagal menghapus subscriber');
    }
  };

  const handleSendBlast = async () => {
    if (!blastSubject || !blastMessage) {
      toast.error('Subject dan pesan harus diisi');
      return;
    }

    if (!confirm(`Kirim email ke ${stats.active} subscriber aktif?`)) return;

    setSending(true);
    try {
      const response = await fetch('/api/newsletter/send-blast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: blastSubject,
          message: blastMessage,
          targetStatus: 'active'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        setShowBlastModal(false);
        setBlastSubject('');
        setBlastMessage('');
      } else {
        toast.error(data.error || 'Gagal mengirim email blast');
      }
    } catch (error) {
      console.error('Error sending blast:', error);
      toast.error('Gagal mengirim email blast');
    } finally {
      setSending(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Email', 'Status', 'Tanggal Subscribe', 'Source'];
    const rows = filteredSubscribers.map(s => [
      s.email,
      s.status,
      new Date(s.subscribedAt).toLocaleDateString('id-ID'),
      s.source || 'website'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Data berhasil diexport!');
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || subscriber.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
          <Link href="/dashboard/home">
            <Button variant="outline" className="mb-4" style={{ borderColor: '#214929', color: '#214929' }}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair), serif', color: '#214929' }}>
                Newsletter Management
              </h1>
              <p className="text-gray-600">Kelola subscriber dan kirim email blast</p>
            </div>
            <Button 
              onClick={() => setShowBlastModal(true)}
              style={{ backgroundColor: '#214929' }}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              Kirim Email Blast
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Subscribers</p>
                  <p className="text-3xl font-bold" style={{ color: '#214929' }}>{stats.total}</p>
                </div>
                <Users className="w-12 h-12" style={{ color: '#214929', opacity: 0.2 }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active</p>
                  <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                </div>
                <UserCheck className="w-12 h-12 text-green-600" style={{ opacity: 0.2 }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Unsubscribed</p>
                  <p className="text-3xl font-bold text-red-600">{stats.unsubscribed}</p>
                </div>
                <UserX className="w-12 h-12 text-red-600" style={{ opacity: 0.2 }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Cari email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-md"
                style={{ borderColor: '#214929' }}
              >
                <option value="all">Semua Status</option>
                <option value="active">Active</option>
                <option value="unsubscribed">Unsubscribed</option>
              </select>
              <Button 
                onClick={exportToCSV}
                variant="outline"
                style={{ borderColor: '#214929', color: '#214929' }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscribers List */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#214929' }}>
              Daftar Subscribers ({filteredSubscribers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredSubscribers.length > 0 ? (
                filteredSubscribers.map((subscriber) => (
                  <div 
                    key={subscriber._id} 
                    className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="font-medium" style={{ color: '#214929' }}>{subscriber.email}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            subscriber.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {subscriber.status}
                          </span>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(subscriber.subscribedAt).toLocaleDateString('id-ID', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(subscriber.email)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Mail className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Tidak ada subscriber yang ditemukan</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Blast Modal */}
      {showBlastModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold" style={{ color: '#214929' }}>
                Kirim Email Blast
              </h2>
              <button 
                onClick={() => setShowBlastModal(false)} 
                className="hover:bg-gray-100 rounded-full p-2"
                disabled={sending}
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-800">
                  📧 Email akan dikirim ke <strong>{stats.active} subscriber aktif</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject Email *</label>
                <Input
                  type="text"
                  value={blastSubject}
                  onChange={(e) => setBlastSubject(e.target.value)}
                  placeholder="Promo Spesial Minggu Ini!"
                  disabled={sending}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Pesan Email *</label>
                <textarea
                  value={blastMessage}
                  onChange={(e) => setBlastMessage(e.target.value)}
                  placeholder="Tulis pesan email Anda di sini... (mendukung HTML)"
                  rows={10}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled={sending}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tips: Gunakan HTML untuk formatting yang lebih baik
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowBlastModal(false)}
                  disabled={sending}
                  className="flex-1"
                  style={{ borderColor: '#214929', color: '#214929' }}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSendBlast}
                  disabled={sending || !blastSubject || !blastMessage}
                  className="flex-1"
                  style={{ backgroundColor: '#214929' }}
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Kirim Sekarang
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
