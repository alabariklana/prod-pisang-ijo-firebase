import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'pisangijo';

let client;
let db;
async function connect() {
  if (!MONGO_URL) throw new Error('MONGO_URL not set');
  if (!client) {
    // build options; allow insecure TLS in dev only when explicitly enabled
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
      // tampilkan detail supaya terlihat di terminal dev
      console.error('MongoDB connect error:', e);
      console.error(e?.stack);
      // rethrow supaya route handler bisa merespon 500 dengan detail
      throw e;
    }
  }
  return db;
}

export async function GET() {
  try {
    const db = await connect();
    const products = await db.collection('products').find({}).toArray();
    return NextResponse.json(products, { status: 200 });
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

    const { name, category, price, description = '', imageUrl = '' } = body;

    if (!name || !category || (price === undefined || price === null || price === '')) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice)) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }

    const doc = {
      name,
      category,
      price: numericPrice,
      description,
      imageUrl,
      createdAt: new Date()
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