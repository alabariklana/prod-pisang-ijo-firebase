import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

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
      console.warn('WARNING: TLS verification disabled for MongoDB (DISABLE_TLS_VERIFY=true). Use only in development.');
    }

    try {
      console.info('Connecting to MongoDB...', MONGO_URL?.startsWith('mongodb+srv') ? 'using SRV' : 'using standard URI');
      client = new MongoClient(MONGO_URL, opts);
      await client.connect();
      db = client.db(DB_NAME);
      console.info('MongoDB connected, db:', DB_NAME);
    } catch (e) {
      console.error('MongoDB connect error:', e);
      console.error(e?.stack);
      throw e;
    }
  }
  return db;
}

// Update stock quantity only
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { stock, action = 'set' } = body; // action: 'set', 'add', 'subtract'
    
    if (stock === undefined || stock === null) {
      return NextResponse.json(
        { error: 'Stock quantity is required' }, 
        { status: 400 }
      );
    }

    const numericStock = Number(stock);
    if (Number.isNaN(numericStock)) {
      return NextResponse.json({ error: 'Invalid stock quantity' }, { status: 400 });
    }

    const database = await connect();
    if (!database) {
      throw new Error('Failed to connect to database');
    }
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
    
    let updateOperation;
    
    switch (action) {
      case 'add':
        updateOperation = { 
          $inc: { stock: numericStock },
          $set: { updatedAt: new Date() }
        };
        break;
      case 'subtract':
        // Ensure stock doesn't go negative
        const currentProduct = await database.collection('products').findOne(query);
        if (!currentProduct) {
          return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        
        const newStock = Math.max(0, (currentProduct.stock || 0) - numericStock);
        updateOperation = { 
          $set: { 
            stock: newStock,
            updatedAt: new Date() 
          }
        };
        break;
      case 'set':
      default:
        if (numericStock < 0) {
          return NextResponse.json({ error: 'Stock cannot be negative' }, { status: 400 });
        }
        updateOperation = { 
          $set: { 
            stock: numericStock,
            updatedAt: new Date() 
          }
        };
        break;
    }

    // First ensure the product exists and has stock fields
    const existingProduct = await database.collection('products').findOne(query);
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // If product doesn't have stock fields, initialize them first
    if (existingProduct.stock === undefined || existingProduct.lowStockThreshold === undefined || existingProduct.isActive === undefined) {
      await database.collection('products').updateOne(query, {
        $set: {
          stock: existingProduct.stock || 0,
          lowStockThreshold: existingProduct.lowStockThreshold || 5,
          isActive: existingProduct.isActive !== false,
          updatedAt: new Date()
        }
      });
    }

    const result = await database.collection('products').updateOne(query, updateOperation);

    // Get updated product to return new stock value
    const updatedProduct = await database.collection('products').findOne(query);
    
    return NextResponse.json({ 
      ok: true, 
      updated: result.modifiedCount,
      newStock: updatedProduct?.stock || 0
    });
  } catch (err) {
    console.error('PUT /api/products/[id]/stock error', err);
    return NextResponse.json(
      { error: 'Server error', detail: err?.message ?? null }, 
      { status: 500 }
    );
  }
}

// Get stock info for specific product
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const database = await connect();
    if (!database) {
      throw new Error('Failed to connect to database');
    }
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
    
    const product = await database.collection('products').findOne(
      query,
      { projection: { name: 1, stock: 1, lowStockThreshold: 1, isActive: 1 } }
    );
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const stockStatus = getStockStatus(product.stock || 0, product.lowStockThreshold || 5);
    
    return NextResponse.json({
      id: product._id.toString(),
      name: product.name,
      stock: product.stock || 0,
      lowStockThreshold: product.lowStockThreshold || 5,
      isActive: product.isActive !== false,
      stockStatus
    });
  } catch (err) {
    console.error('GET /api/products/[id]/stock error', err);
    return NextResponse.json(
      { error: 'Server error', detail: err?.message ?? null }, 
      { status: 500 }
    );
  }
}

function getStockStatus(stock, threshold) {
  if (stock === 0) return 'out_of_stock';
  if (stock <= threshold) return 'low_stock';
  return 'in_stock';
}