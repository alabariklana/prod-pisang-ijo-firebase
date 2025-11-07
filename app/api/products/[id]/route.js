import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

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

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = await connect();
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
    const item = await db.collection('products').findOne(query);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
  } catch (err) {
    console.error('GET /api/products/[id] error', err);
    return NextResponse.json({ error: 'Server error', detail: err?.message ?? null }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const db = await connect();
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
    const res = await db.collection('products').deleteOne(query);
    if (res.deletedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/products/[id] error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.category || body.price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, price' }, 
        { status: 400 }
      );
    }

    const db = await connect();
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
    
    const updateData = {
      name: body.name,
      category: body.category,
      price: Number(body.price),
      description: body.description || '',
      imageUrl: body.imageUrl || '',
      updatedAt: new Date(),
    };

    const result = await db.collection('products').updateOne(
      query,
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, updated: result.modifiedCount });
  } catch (err) {
    console.error('PUT /api/products/[id] error', err);
    return NextResponse.json(
      { error: 'Server error', detail: err?.message ?? null }, 
      { status: 500 }
    );
  }
}