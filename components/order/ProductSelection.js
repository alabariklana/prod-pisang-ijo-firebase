'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Product Search and Filter Component
 * @param {Object} props - Component props
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.onSearchChange - Search change handler
 * @param {string} props.selectedCategory - Selected category
 * @param {Function} props.onCategoryChange - Category change handler
 * @param {Array} props.categories - Available categories
 * @returns {JSX.Element}
 */
export function ProductSearchFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories
}) {
  return (
    <div className="space-y-3 mb-4">
      <div>
        <Input
          placeholder="Cari produk..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange('')}
          >
            Semua
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Product Card Component
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data
 * @param {Function} props.onAddToCart - Add to cart handler
 * @returns {JSX.Element}
 */
export function ProductCard({ product, onAddToCart }) {
  const getStockStatus = () => {
    if (product.stock === undefined) {
      return { color: 'bg-blue-100 text-blue-700', text: 'Tersedia' };
    }
    
    if (product.stock <= 0) {
      return { color: 'bg-red-100 text-red-700', text: 'Habis' };
    }
    
    if (product.stock <= (product.lowStockThreshold || 5)) {
      return { color: 'bg-yellow-100 text-yellow-700', text: `Sisa ${product.stock}` };
    }
    
    return { color: 'bg-green-100 text-green-700', text: `Stok: ${product.stock}` };
  };

  const stockStatus = getStockStatus();
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:border-green-600 transition">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-green-700">{product.name}</h3>
          {product.category && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              {product.category}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-2">
          {product.description
            ? (product.description.length > 60 
                ? product.description.substring(0, 60) + '...' 
                : product.description)
            : 'Produk berkualitas tinggi'}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-green-600">
            Rp {Number(product.price || 0).toLocaleString('id-ID')}
          </p>
          <div className="text-xs text-gray-500">
            <span className={`px-2 py-1 rounded ${stockStatus.color}`}>
              {stockStatus.text}
            </span>
          </div>
        </div>
      </div>
      <Button 
        onClick={() => onAddToCart(product)}
        className="bg-green-600 hover:bg-green-700 ml-4"
        disabled={isOutOfStock}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

/**
 * Product Selection Component
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
export function ProductSelection({
  products,
  filteredProducts,
  productsLoading,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onAddToCart
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Pilih Produk 
          <span className="text-sm font-normal text-gray-500">
            {searchQuery || selectedCategory ? 
              `${filteredProducts.length} dari ${products.length} produk` :
              `${products.length} produk tersedia`
            }
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ProductSearchFilter
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          categories={categories}
        />

        <div className="space-y-4">
          {productsLoading ? (
            <div className="text-center py-8 text-gray-600">Memuat produk...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              {searchQuery || selectedCategory ? 
                'Tidak ada produk yang sesuai dengan pencarian.' : 
                'Tidak ada produk tersedia.'
              }
            </div>
          ) : (
            filteredProducts.map((product, idx) => {
              const key = product._id ?? product.id ?? product.slug ?? `${product.name}-${idx}`;
              return (
                <ProductCard
                  key={String(key)}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// PropTypes for type checking
ProductSearchFilter.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    category: PropTypes.string,
    stock: PropTypes.number,
    lowStockThreshold: PropTypes.number,
    slug: PropTypes.string
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired
};

ProductSelection.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  filteredProducts: PropTypes.arrayOf(PropTypes.object).isRequired,
  productsLoading: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAddToCart: PropTypes.func.isRequired
};