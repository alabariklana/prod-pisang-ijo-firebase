'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  Gift, 
  Award, 
  Percent,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  // Point Settings
  const [pointSettings, setPointSettings] = useState({
    pointsPerPurchase: 10, // Poin per Rp 1000
    minimumPurchaseForPoints: 10000, // Minimum pembelian untuk dapat poin
    pointsToRupiah: 100, // 100 poin = Rp 1000
    minimumRedeemPoints: 500 // Minimum poin untuk redeem
  });

  // Promo Settings
  const [promos, setPromos] = useState([]);
  const [newPromo, setNewPromo] = useState({
    code: '',
    description: '',
    discountType: 'percentage', // percentage or fixed
    discountValue: 0,
    minimumPurchase: 0,
    maxDiscount: 0, // For percentage type
    validFrom: '',
    validUntil: '',
    maxUsage: 0,
    usageCount: 0,
    isActive: true
  });
  const [editingPromo, setEditingPromo] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/dashboard');
    } else if (user) {
      fetchSettings();
      fetchPromos();
    }
  }, [user, loading, router]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings/points');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setPointSettings(data.settings);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchPromos = async () => {
    try {
      const res = await fetch('/api/promos');
      if (res.ok) {
        const data = await res.json();
        setPromos(data.promos || []);
      }
    } catch (error) {
      console.error('Error fetching promos:', error);
    }
  };

  const handleSavePointSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pointSettings)
      });

      if (res.ok) {
        toast.success('Pengaturan poin berhasil disimpan!');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  const handleAddPromo = async () => {
    if (!newPromo.code || !newPromo.description || !newPromo.discountValue) {
      toast.error('Mohon lengkapi data promo');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPromo)
      });

      if (res.ok) {
        const data = await res.json();
        setPromos([...promos, data.promo]);
        setNewPromo({
          code: '',
          description: '',
          discountType: 'percentage',
          discountValue: 0,
          minimumPurchase: 0,
          maxDiscount: 0,
          validFrom: '',
          validUntil: '',
          maxUsage: 0,
          usageCount: 0,
          isActive: true
        });
        toast.success('Promo berhasil ditambahkan!');
      } else {
        throw new Error('Failed to add promo');
      }
    } catch (error) {
      console.error('Error adding promo:', error);
      toast.error('Gagal menambahkan promo');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePromo = async (promoId) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/promos/${promoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPromo)
      });

      if (res.ok) {
        const data = await res.json();
        setPromos(promos.map(p => p._id === promoId ? data.promo : p));
        setEditingPromo(null);
        toast.success('Promo berhasil diupdate!');
      } else {
        throw new Error('Failed to update promo');
      }
    } catch (error) {
      console.error('Error updating promo:', error);
      toast.error('Gagal mengupdate promo');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePromo = async (promoId) => {
    if (!confirm('Yakin ingin menghapus promo ini?')) return;

    try {
      const res = await fetch(`/api/promos/${promoId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setPromos(promos.filter(p => p._id !== promoId));
        toast.success('Promo berhasil dihapus!');
      } else {
        throw new Error('Failed to delete promo');
      }
    } catch (error) {
      console.error('Error deleting promo:', error);
      toast.error('Gagal menghapus promo');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/home">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Settings className="w-6 h-6" />
                  Pengaturan Promo & Poin
                </h1>
                <p className="text-sm text-gray-600">Kelola promo dan sistem poin member</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Point Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  Pengaturan Poin Member
                </CardTitle>
                <CardDescription>
                  Atur sistem poin untuk member loyal Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poin per Rp 1.000 pembelian
                  </label>
                  <Input
                    type="number"
                    value={pointSettings.pointsPerPurchase}
                    onChange={(e) => setPointSettings({
                      ...pointSettings,
                      pointsPerPurchase: parseInt(e.target.value) || 0
                    })}
                    placeholder="10"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Contoh: 10 poin = member dapat 10 poin untuk setiap pembelian Rp 1.000
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum pembelian untuk dapat poin (Rp)
                  </label>
                  <Input
                    type="number"
                    value={pointSettings.minimumPurchaseForPoints}
                    onChange={(e) => setPointSettings({
                      ...pointSettings,
                      minimumPurchaseForPoints: parseInt(e.target.value) || 0
                    })}
                    placeholder="10000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Pembelian minimal untuk mendapatkan poin
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nilai tukar poin ke Rupiah
                  </label>
                  <Input
                    type="number"
                    value={pointSettings.pointsToRupiah}
                    onChange={(e) => setPointSettings({
                      ...pointSettings,
                      pointsToRupiah: parseInt(e.target.value) || 0
                    })}
                    placeholder="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Contoh: 100 = 100 poin dapat ditukar dengan Rp 1.000
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum poin untuk redeem
                  </label>
                  <Input
                    type="number"
                    value={pointSettings.minimumRedeemPoints}
                    onChange={(e) => setPointSettings({
                      ...pointSettings,
                      minimumRedeemPoints: parseInt(e.target.value) || 0
                    })}
                    placeholder="500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Poin minimal yang harus dimiliki untuk dapat ditukar
                  </p>
                </div>

                <Button 
                  onClick={handleSavePointSettings}
                  disabled={saving}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Menyimpan...' : 'Simpan Pengaturan Poin'}
                </Button>

                {/* Preview */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-sm text-blue-900 mb-2">Preview Perhitungan:</h4>
                  <div className="space-y-1 text-xs text-blue-800">
                    <p>• Belanja Rp 50.000 = {Math.floor(50000 / 1000) * pointSettings.pointsPerPurchase} poin</p>
                    <p>• {pointSettings.minimumRedeemPoints} poin = Rp {(pointSettings.minimumRedeemPoints / pointSettings.pointsToRupiah * 1000).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Promo Management */}
          <div className="space-y-6">
            {/* Add New Promo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-red-600" />
                  Tambah Promo Baru
                </CardTitle>
                <CardDescription>
                  Buat kode promo untuk member
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kode Promo
                    </label>
                    <Input
                      value={newPromo.code}
                      onChange={(e) => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})}
                      placeholder="DISKON50"
                      className="uppercase"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi
                    </label>
                    <Input
                      value={newPromo.description}
                      onChange={(e) => setNewPromo({...newPromo, description: e.target.value})}
                      placeholder="Diskon 50% untuk pembelian pertama"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipe Diskon
                    </label>
                    <select
                      value={newPromo.discountType}
                      onChange={(e) => setNewPromo({...newPromo, discountType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="percentage">Persentase (%)</option>
                      <option value="fixed">Nominal (Rp)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nilai Diskon
                    </label>
                    <Input
                      type="number"
                      value={newPromo.discountValue}
                      onChange={(e) => setNewPromo({...newPromo, discountValue: parseInt(e.target.value) || 0})}
                      placeholder={newPromo.discountType === 'percentage' ? '50' : '50000'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min. Pembelian (Rp)
                    </label>
                    <Input
                      type="number"
                      value={newPromo.minimumPurchase}
                      onChange={(e) => setNewPromo({...newPromo, minimumPurchase: parseInt(e.target.value) || 0})}
                      placeholder="100000"
                    />
                  </div>

                  {newPromo.discountType === 'percentage' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max. Diskon (Rp)
                      </label>
                      <Input
                        type="number"
                        value={newPromo.maxDiscount}
                        onChange={(e) => setNewPromo({...newPromo, maxDiscount: parseInt(e.target.value) || 0})}
                        placeholder="50000"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Berlaku Dari
                    </label>
                    <Input
                      type="date"
                      value={newPromo.validFrom}
                      onChange={(e) => setNewPromo({...newPromo, validFrom: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Berlaku Hingga
                    </label>
                    <Input
                      type="date"
                      value={newPromo.validUntil}
                      onChange={(e) => setNewPromo({...newPromo, validUntil: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max. Penggunaan
                    </label>
                    <Input
                      type="number"
                      value={newPromo.maxUsage}
                      onChange={(e) => setNewPromo({...newPromo, maxUsage: parseInt(e.target.value) || 0})}
                      placeholder="100"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleAddPromo}
                  disabled={saving}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {saving ? 'Menambahkan...' : 'Tambah Promo'}
                </Button>
              </CardContent>
            </Card>

            {/* Promo List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="w-5 h-5 text-green-600" />
                  Daftar Promo Aktif
                </CardTitle>
                <CardDescription>
                  {promos.length} promo tersedia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {promos.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      Belum ada promo. Tambahkan promo pertama Anda!
                    </p>
                  ) : (
                    promos.map((promo) => (
                      <div key={promo._id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono font-bold text-lg text-green-700">
                                {promo.code}
                              </span>
                              {promo.isActive ? (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                  Aktif
                                </span>
                              ) : (
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  Nonaktif
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{promo.description}</p>
                            <div className="text-xs text-gray-500 space-y-1">
                              <p>
                                Diskon: {promo.discountType === 'percentage' 
                                  ? `${promo.discountValue}% (max ${promo.maxDiscount?.toLocaleString('id-ID')})`
                                  : `Rp ${promo.discountValue.toLocaleString('id-ID')}`
                                }
                              </p>
                              <p>Min. Belanja: Rp {promo.minimumPurchase.toLocaleString('id-ID')}</p>
                              <p>Penggunaan: {promo.usageCount || 0} / {promo.maxUsage || '∞'}</p>
                              {promo.validFrom && promo.validUntil && (
                                <p>
                                  Berlaku: {new Date(promo.validFrom).toLocaleDateString('id-ID')} - {new Date(promo.validUntil).toLocaleDateString('id-ID')}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingPromo(promo)}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeletePromo(promo._id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
