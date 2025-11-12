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

export async function POST() {
  try {
    const db = await connect();
    
    // Update all products that don't have stock fields
    const result = await db.collection('products').updateMany(
      {
        $or: [
          { stock: { $exists: false } },
          { lowStockThreshold: { $exists: false } },
          { isActive: { $exists: false } }
        ]
      },
      {
        $set: {
          stock: 0,
          lowStockThreshold: 5,
          isActive: true,
          updatedAt: new Date()
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} products with default stock values`);

    return NextResponse.json({
      ok: true,
      message: `Successfully updated ${result.modifiedCount} products with default stock values`,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    console.error('Migration error:', err);
    return NextResponse.json(
      { error: 'Migration failed', detail: err?.message ?? null }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await connect();
    
    // Check how many products need migration
    const productsWithoutStock = await db.collection('products').countDocuments({
      $or: [
        { stock: { $exists: false } },
        { lowStockThreshold: { $exists: false } },
        { isActive: { $exists: false } }
      ]
    });

    const totalProducts = await db.collection('products').countDocuments({});

    return NextResponse.json({
      totalProducts,
      productsWithoutStock,
      needsMigration: productsWithoutStock > 0
    });
  } catch (err) {
    console.error('Migration check error:', err);
    return NextResponse.json(
      { error: 'Migration check failed', detail: err?.message ?? null }, 
      { status: 500 }
    );
  }
}