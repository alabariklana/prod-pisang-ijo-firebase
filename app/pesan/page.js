'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ShippingCalculator from '@/components/ShippingCalculator';

export default function PesanPage() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) {
        console.error('Failed to fetch products:', res.statusText);
        setProducts([]);
        return;
      }
      const data = await res.json();
      setProducts(Array.isArray(data) ? data.filter(p => p?.available) : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const addToCart = (product) => {
    // normalisasi id: pakai product.id, kalau ada _id gunakan String(_id), kalau tidak ada buat fallback unik
    const pid = product.id ?? (product._id ? String(product._id) : undefined) ?? `${product.name}-${Date.now()}`;

    const existing = cart.find(item => item.id === pid);
    if (existing) {
      setCart(cart.map(item => 
        item.id === pid 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // simpan id yang sudah dinormalisasi agar unik saat render
      setCart([...cart, { ...product, id: pid, quantity: 1 }]);
    }
    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  const updateQuantity = (productId, delta) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    toast.success('Item dihapus dari keranjang');
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (Number(item.price || 0) * item.quantity), 0);
    const shippingCost = selectedShipping ? selectedShipping.cost : 0;
    return subtotal + shippingCost;
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + (Number(item.price || 0) * item.quantity), 0);
  };

  const getTotalWeight = () => {
    // Estimate weight based on quantity (default 500g per item if no weight specified)
    return cart.reduce((sum, item) => sum + (item.weight || 500) * item.quantity, 0);
  };

  const handleShippingSelected = (shippingData) => {
    setSelectedShipping(shippingData);
    toast.success(`Ongkir ${shippingData.courierName} - ${shippingData.service} dipilih`);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Keranjang masih kosong');
      return;
    }

    if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
      toast.error('Mohon lengkapi semua data');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: getSubtotal(),
        shippingCost: selectedShipping ? selectedShipping.cost : 0,
        totalAmount: calculateTotal(),
        shipping: selectedShipping,
        notes
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        const order = await res.json();
        toast.success(`Pesanan berhasil dibuat! Nomor Order: ${order.orderNumber || '-'}`);
        
        // Reset form
        setCart([]);
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
        setCustomerAddress('');
        setNotes('');
      } else {
        const errText = await res.text().catch(() => null);
        console.error('Order error:', res.status, errText);
        toast.error('Gagal membuat pesanan');
      }
    } catch (error) {
      console.error('Order exception:', error);
      toast.error('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

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

      {/* Header */}
      <section className="py-12 px-4 bg-green-700 text-white">
        <div className="container mx-auto max-w-6xl">
          <Link href="/" className="inline-flex items-center text-green-200 hover:text-white mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Home
          </Link>
          <h1 className="text-4xl font-bold">Form Pemesanan</h1>
          <p className="text-green-100 mt-2">Lengkapi form di bawah untuk memesan</p>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Selection */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Pilih Produk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productsLoading ? (
                    <div className="text-center py-8 text-gray-600">Memuat produk...</div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-8 text-gray-600">Tidak ada produk tersedia.</div>
                  ) : (
                    products.map((product, idx) => {
                      const key = product._id ?? product.id ?? product.slug ?? `${product.name}-${idx}`;
                      return (
                        <div key={String(key)} className="flex items-center justify-between p-4 border rounded-lg hover:border-green-600 transition">
                          <div className="flex-1">
                            <h3 className="font-semibold text-green-700">{product.name}</h3>
                            <p className="text-sm text-gray-600">
                              {product.description
                                ? (product.description.length > 60 ? product.description.substring(0, 60) + '...' : product.description)
                                : ''}
                            </p>
                            <p className="text-lg font-bold text-green-600 mt-2">
                              Rp {Number(product.price || 0).toLocaleString('id-ID')}
                            </p>
                          </div>
                          <Button 
                            onClick={() => addToCart(product)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })
                   )}
                </div>
              </CardContent>
            </Card>

            {/* Cart */}
            {cart.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Keranjang</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            Rp {Number(item.price || 0).toLocaleString('id-ID')} x {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Subtotal Produk:</span>
                        <span>Rp {getSubtotal().toLocaleString('id-ID')}</span>
                      </div>
                      {selectedShipping && (
                        <div className="flex justify-between items-center">
                          <span>Ongkir ({selectedShipping.courierName} - {selectedShipping.service}):</span>
                          <span>Rp {selectedShipping.cost.toLocaleString('id-ID')}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-xl font-bold pt-2 border-t">
                        <span>Total Bayar:</span>
                        <span className="text-green-600">Rp {calculateTotal().toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Customer Form & Shipping */}
          <div className="space-y-6">
            {/* Shipping Calculator */}
            {cart.length > 0 && (
              <ShippingCalculator
                onShippingSelected={handleShippingSelected}
                defaultWeight={getTotalWeight()}
                origin="268" // Makassar, Sulawesi Selatan - Kelurahan Banta-Bantaeng, Kecamatan Rappocini
              />
            )}

            <Card>
              <CardHeader>
                <CardTitle>Data Pemesan</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Nama Lengkap *</label>
                    <Input 
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</label>
                    <Input 
                      id="email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">No. Telepon *</label>
                    <Input 
                      id="phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="text-sm font-medium text-gray-700">Alamat Lengkap *</label>
                    <textarea
                      id="address"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Masukkan alamat lengkap untuk pengiriman"
                      rows={3}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="notes" className="text-sm font-medium text-gray-700">Catatan (Opsional)</label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Tambahan permintaan khusus"
                      rows={2}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                    disabled={loading || cart.length === 0}
                  >
                    {loading ? 'Memproses...' : `Pesan Sekarang (Rp ${calculateTotal().toLocaleString('id-ID')})`}
                  </Button>
                  
                  {cart.length > 0 && !selectedShipping && (
                    <div className="text-center text-amber-600 text-sm">
                      💡 Pilih ongkir di atas untuk melanjutkan pemesanan
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}