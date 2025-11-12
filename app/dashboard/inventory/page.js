'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StockStatus, StockQuantity, StockIndicator } from '@/components/StockStatus';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Package,
  Plus,
  Minus,
  Edit3,
  BarChart3,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { toast } from 'sonner';

export default function InventoryManagementPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [inventoryStats, setInventoryStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, statusFilter, categoryFilter, sortBy]);

  const fetchData = async () => {
    try {
      const [productsRes, statsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/inventory/stats')
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setInventoryStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data inventory');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => {
        const stock = product.stock || 0;
        const threshold = product.lowStockThreshold || 5;
        
        switch (statusFilter) {
          case 'in_stock':
            return stock > threshold;
          case 'low_stock':
            return stock > 0 && stock <= threshold;
          case 'out_of_stock':
            return stock === 0;
          case 'inactive':
            return product.isActive === false;
          default:
            return true;
        }
      });
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stock_asc':
          return (a.stock || 0) - (b.stock || 0);
        case 'stock_desc':
          return (b.stock || 0) - (a.stock || 0);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'price':
          return (a.price || 0) - (b.price || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const updateStock = async (productId, newStock, action = 'set') => {
    try {
      // Fallback: Use regular product API if stock API fails
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          // Get current product data first
          ...(products.find(p => (p._id || p.id) === productId) || {}),
          // Update stock based on action
          stock: action === 'set' ? newStock : 
                action === 'add' ? (products.find(p => (p._id || p.id) === productId)?.stock || 0) + newStock :
                Math.max(0, (products.find(p => (p._id || p.id) === productId)?.stock || 0) - newStock),
          lowStockThreshold: products.find(p => (p._id || p.id) === productId)?.lowStockThreshold || 5,
          isActive: products.find(p => (p._id || p.id) === productId)?.isActive !== false
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Stock update failed:', res.status, errorText);
        throw new Error(`Failed to update stock: ${res.status} ${errorText}`);
      }

      const result = await res.json();
      
      // Update local state - calculate new stock based on action
      const currentProduct = products.find(p => (p._id || p.id) === productId);
      const currentStock = currentProduct?.stock || 0;
      
      let finalStock;
      if (action === 'set') {
        finalStock = newStock;
      } else if (action === 'add') {
        finalStock = currentStock + newStock;
      } else if (action === 'subtract') {
        finalStock = Math.max(0, currentStock - newStock);
      }

      setProducts(prevProducts => 
        prevProducts.map(product => 
          (product._id === productId || product.id === productId)
            ? { ...product, stock: finalStock }
            : product
        )
      );

      // Refresh stats
      const statsRes = await fetch('/api/inventory/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setInventoryStats(statsData);
      }

      toast.success('Stok berhasil diupdate');
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Gagal mengupdate stok');
    }
  };

  const getCategories = () => {
    const categories = [...new Set(products.map(p => p.category))].filter(Boolean);
    return categories.sort();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data inventory...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard')} 
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> 
              Kembali ke Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manajemen Inventory</h1>
              <p className="text-sm text-gray-600">Kelola stok dan monitoring produk</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <Button onClick={() => router.push('/dashboard/products')} className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Kelola Produk
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {inventoryStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Stok Tersedia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">
                  {inventoryStats.inStockProducts}
                </div>
                <p className="text-xs text-gray-500">dari {inventoryStats.totalProducts} produk</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  Stok Rendah
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-700">
                  {inventoryStats.lowStockProducts}
                </div>
                <p className="text-xs text-gray-500">perlu restok segera</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  Stok Habis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700">
                  {inventoryStats.outOfStockProducts}
                </div>
                <p className="text-xs text-gray-500">tidak dapat dijual</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Total Stok
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700">
                  {inventoryStats.totalStockValue}
                </div>
                <p className="text-xs text-gray-500">unit tersedia</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Cari Produk</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Nama atau kategori..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Status Stok</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="in_stock">Stok Tersedia</SelectItem>
                    <SelectItem value="low_stock">Stok Rendah</SelectItem>
                    <SelectItem value="out_of_stock">Stok Habis</SelectItem>
                    <SelectItem value="inactive">Produk Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Kategori</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {getCategories().map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Urutkan</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Urutkan berdasarkan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nama A-Z</SelectItem>
                    <SelectItem value="category">Kategori</SelectItem>
                    <SelectItem value="stock_desc">Stok Tertinggi</SelectItem>
                    <SelectItem value="stock_asc">Stok Terendah</SelectItem>
                    <SelectItem value="price">Harga</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setCategoryFilter('all');
                    setSortBy('name');
                  }}
                  className="w-full flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Reset Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Daftar Produk ({filteredProducts.length} dari {products.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {products.length === 0 ? 'Belum ada produk.' : 'Tidak ada produk yang sesuai dengan filter.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map(product => (
                  <ProductRow 
                    key={product._id || product.id} 
                    product={product} 
                    onUpdateStock={updateStock}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProductRow({ product, onUpdateStock }) {
  const [isEditing, setIsEditing] = useState(false);
  const [stockInput, setStockInput] = useState('');

  // Ensure product has required stock fields with defaults
  const stock = Number(product.stock) || 0;
  const threshold = Number(product.lowStockThreshold) || 5;
  const isActive = product.isActive !== false; // default to true if undefined
  const productId = product._id || product.id;

  const handleStockUpdate = (action, amount = 1) => {
    if (action === 'set') {
      const newStock = parseInt(stockInput) || 0;
      onUpdateStock(productId, newStock, 'set');
      setIsEditing(false);
    } else {
      onUpdateStock(productId, amount, action);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <StockIndicator stock={stock} lowStockThreshold={threshold} />
        
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <Package className="w-6 h-6 text-gray-400" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm">{product.name}</h3>
            {product.isActive === false && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                Nonaktif
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-2">
            {product.category} • Rp {(product.price || 0).toLocaleString('id-ID')}
          </p>
          <StockQuantity stock={stock} lowStockThreshold={threshold} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              placeholder={stock.toString()}
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              className="w-20 h-8"
              autoFocus
            />
            <Button 
              size="sm" 
              onClick={() => handleStockUpdate('set')}
              className="h-8"
            >
              ✓
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              className="h-8"
            >
              ✕
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleStockUpdate('subtract', 1)}
              disabled={stock === 0}
              className="h-8 w-8 p-0"
            >
              <Minus className="w-3 h-3" />
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setStockInput(stock.toString());
                setIsEditing(true);
              }}
              className="h-8 px-3 flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              {stock}
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleStockUpdate('add', 1)}
              className="h-8 w-8 p-0"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}