import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'pisangijo';

let client;
let db;
async function connect() {
  if (!MONGO_URL) throw new Error('MONGO_URL not set');
  if (!client) {
    client = new MongoClient(MONGO_URL, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    db = client.db(DB_NAME);
  }
  return db;
}

export async function GET(request) {
  try {
    const db = await connect();
    
    // Fetch all orders, sorted by creation date (newest first)
    const orders = await db.collection('orders')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Convert MongoDB _id to string for JSON serialization
    const ordersWithId = orders.map(order => ({
      ...order,
      _id: order._id.toString(),
      id: order._id.toString()
    }));

    return NextResponse.json(ordersWithId, { status: 200 });
  } catch (err) {
    console.error('GET /api/orders error:', err);
    return NextResponse.json({ error: 'Gagal memuat pesanan', detail: err?.message ?? null }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

    const { customerName, customerEmail, customerPhone, customerAddress, items, totalAmount } = body;

    if (!customerName || !customerEmail || !customerPhone || !customerAddress || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await connect();

    const orderNumber = `ORD-${Date.now()}`;
    const doc = {
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      items,
      totalAmount: Number(totalAmount) || 0,
      notes: body.notes || '',
      status: 'pending',
      createdAt: new Date()
    };

    const res = await db.collection('orders').insertOne(doc);

    return NextResponse.json({ ok: true, orderId: res.insertedId.toString(), orderNumber }, { status: 201 });
  } catch (err) {
    console.error('POST /api/orders error:', err);
    return NextResponse.json({ error: 'Gagal membuat pesanan', detail: err?.message ?? null }, { status: 500 });
  }
}