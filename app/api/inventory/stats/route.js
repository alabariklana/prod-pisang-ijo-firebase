import { ApiResponse, handleApiError } from '@/lib/api-utils';
import { withDatabase } from '@/lib/mongodb';

/**
 * Calculate inventory statistics
 * @param {Array} products - Array of products with stock information
 * @returns {Object} Inventory statistics object
 */
function calculateInventoryStats(products) {
  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.isActive !== false).length,
    inactiveProducts: products.filter(p => p.isActive === false).length,
    inStockProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalStockValue: 0,
    categoriesBreakdown: {},
    lowStockItems: [],
    outOfStockItems: []
  };

  products.forEach(product => {
    const stock = product.stock || 0;
    const threshold = product.lowStockThreshold || 5;
    const isActive = product.isActive !== false;
    
    if (isActive) {
      if (stock === 0) {
        stats.outOfStockProducts++;
        stats.outOfStockItems.push({
          id: product._id.toString(),
          name: product.name,
          category: product.category,
          stock: stock
        });
      } else if (stock <= threshold) {
        stats.lowStockProducts++;
        stats.lowStockItems.push({
          id: product._id.toString(),
          name: product.name,
          category: product.category,
          stock: stock,
          threshold: threshold
        });
      } else {
        stats.inStockProducts++;
      }
    }
    
    stats.totalStockValue += stock;
    
    // Category breakdown
    const category = product.category || 'Uncategorized';
    if (!stats.categoriesBreakdown[category]) {
      stats.categoriesBreakdown[category] = {
        count: 0,
        inStock: 0,
        lowStock: 0,
        outOfStock: 0
      };
    }
    
    stats.categoriesBreakdown[category].count++;
    if (isActive) {
      if (stock === 0) {
        stats.categoriesBreakdown[category].outOfStock++;
      } else if (stock <= threshold) {
        stats.categoriesBreakdown[category].lowStock++;
      } else {
        stats.categoriesBreakdown[category].inStock++;
      }
    }
  });

  // Sort alerts by priority (out of stock first, then low stock)
  stats.lowStockItems.sort((a, b) => a.stock - b.stock);
  stats.outOfStockItems.sort((a, b) => a.name.localeCompare(b.name));

  return stats;
}

/**
 * GET /api/inventory/stats - Get inventory statistics
 */
export async function GET() {
  return withDatabase(async (db) => {
    try {
      // Get all products with stock info
      const products = await db.collection('products').find({}, {
        projection: { 
          name: 1, 
          stock: 1, 
          lowStockThreshold: 1, 
          isActive: 1,
          category: 1
        }
      }).toArray();

      const stats = calculateInventoryStats(products);

      return ApiResponse.success(stats, 'Statistik inventory berhasil dimuat');
    } catch (error) {
      return handleApiError(error, 'Gagal memuat statistik inventory');
    }
  });
}