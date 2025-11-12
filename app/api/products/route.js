import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'pisangijo';

let client;
let db;
async function connect() {
  if (!MONGO_URL) throw new Error('MONGO_URL not set');
  
  // Always try to establish connection if db is not available
  if (!client || !db) {
    // Reset client if connection failed previously
    if (client && !db) {
      try {
        await client.close();
      } catch (e) {
        console.warn('Error closing previous client:', e.message);
      }
      client = null;
    }

    // build options; allow insecure TLS in dev only when explicitly enabled
    const opts = { 
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10
    };
    if (process.env.NODE_ENV !== 'production' && process.env.DISABLE_TLS_VERIFY === 'true') {
      opts.tls = true;
      opts.tlsAllowInvalidCertificates = true;
      console.warn('WARNING: TLS verification disabled for MongoDB (DISABLE_TLS_VERIFY=true). Use only in development.');
    }

    try {
      console.info('Connecting to MongoDB...', MONGO_URL?.startsWith('mongodb+srv') ? 'using SRV' : 'using standard URI');
      client = new MongoClient(MONGO_URL, opts);
      await client.connect();
      db = client.db(DB_NAME);
      console.info('MongoDB connected, db:', DB_NAME);
    } catch (e) {
      // Reset variables on error
      client = null;
      db = null;
      // tampilkan detail supaya terlihat di terminal dev
      console.error('MongoDB connect error:', e);
      console.error(e?.stack);
      // rethrow supaya route handler bisa merespon 500 dengan detail
      throw e;
    }
  }

  if (!db) {
    throw new Error('Database connection not available');
  }

  return db;
}

export async function GET() {
  try {
    const database = await connect();
    if (!database) {
      throw new Error('Failed to establish database connection');
    }
    
    const products = await database.collection('products').find({}).toArray();
    
    // Ensure all products have stock fields for menu display
    const productsWithStock = products.map(product => ({
      ...product,
      stock: Number(product.stock) || 0,
      lowStockThreshold: Number(product.lowStockThreshold) || 5,
      isActive: product.isActive !== false // default to true if undefined
    }));
    
    return NextResponse.json(productsWithStock, { status: 200 });
  } catch (err) {
    // lebih detail supaya terlihat di terminal dev
    console.error('GET /api/products error:', err);
    console.error(err.stack);
    return NextResponse.json({ error: 'Gagal memuat produk', detail: err?.message ?? null }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = await connect();

    // request body harus JSON dari client
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Bad request: invalid JSON' }, { status: 400 });
    }

    const { 
      name, 
      category, 
      price, 
      description = '', 
      imageUrl = '', 
      stock = 0,
      lowStockThreshold = 5,
      isActive = true 
    } = body;

    if (!name || !category || (price === undefined || price === null || price === '')) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice)) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }

    const numericStock = Number(stock);
    if (Number.isNaN(numericStock) || numericStock < 0) {
      return NextResponse.json({ error: 'Invalid stock quantity' }, { status: 400 });
    }

    const numericLowStockThreshold = Number(lowStockThreshold);
    if (Number.isNaN(numericLowStockThreshold) || numericLowStockThreshold < 0) {
      return NextResponse.json({ error: 'Invalid low stock threshold' }, { status: 400 });
    }

    const doc = {
      name,
      category,
      price: numericPrice,
      description,
      imageUrl,
      stock: numericStock,
      lowStockThreshold: numericLowStockThreshold,
      isActive: Boolean(isActive),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const res = await db.collection('products').insertOne(doc);
    return NextResponse.json({ ok: true, id: res.insertedId.toString() }, { status: 201 });
  } catch (err) {
    // lebih detail supaya terlihat di terminal dev
    console.error('POST /api/products error:', err);
    console.error(err.stack);
    return NextResponse.json({ error: 'Gagal menyimpan produk', detail: err?.message ?? null }, { status: 500 });
  }
}