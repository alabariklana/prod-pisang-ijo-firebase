import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'pisangijo';

let client;
let db;
async function connect() {
  if (!MONGO_URL) throw new Error('MONGO_URL not set');
  if (!client) {
    const opts = { serverSelectionTimeoutMS: 5000 };
    if (process.env.NODE_ENV !== 'production' && process.env.DISABLE_TLS_VERIFY === 'true') {
      opts.tls = true;
      opts.tlsAllowInvalidCertificates = true;
    }
    client = new MongoClient(MONGO_URL, opts);
    await client.connect();
    db = client.db(DB_NAME);
  }
  return db;
}

export async function GET() {
  try {
    const db = await connect();
    
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

    // Calculate inventory statistics
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

    return NextResponse.json(stats);
  } catch (err) {
    console.error('GET /api/inventory/stats error:', err);
    return NextResponse.json(
      { error: 'Gagal memuat statistik inventory', detail: err?.message ?? null }, 
      { status: 500 }
    );
  }
}