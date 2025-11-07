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
    console.log('Connected to MongoDB (statistics)');
  }
  return db;
}

export async function GET() {
  try {
    if (!MONGO_URL) {
      // fallback sample data when Mongo not configured
      return NextResponse.json({
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        ordersByStatus: {
          pending: 0,
          dikonfirmasi: 0,
          dikirim: 0,
          selesai: 0,
          dibatalkan: 0
        },
        recentOrders: []
      });
    }

    const db = await connect();
    const ordersColl = db.collection('orders');
    const productsColl = db.collection('products');

    // Get all orders
    const orders = await ordersColl.find({}).toArray();
    
    // Count total orders
    const totalOrders = orders.length;
    
    // Count products
    const totalProducts = await productsColl.countDocuments();
    
    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    // Count unique customers
    const uniqueCustomers = new Set(orders.map(order => order.customerEmail));
    const totalCustomers = uniqueCustomers.size;
    
    // Count orders by status
    const ordersByStatus = {
      pending: orders.filter(o => o.status === 'pending').length,
      dikonfirmasi: orders.filter(o => o.status === 'dikonfirmasi').length,
      dikirim: orders.filter(o => o.status === 'dikirim').length,
      selesai: orders.filter(o => o.status === 'selesai').length,
      dibatalkan: orders.filter(o => o.status === 'dibatalkan').length
    };
    
    // Get 5 most recent orders
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(order => ({
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt
      }));

    return NextResponse.json({
      totalOrders,
      totalProducts,
      totalRevenue,
      totalCustomers,
      ordersByStatus,
      recentOrders
    });
  } catch (err) {
    console.error('GET /api/statistics error', err);
    return NextResponse.json({ error: 'Gagal memuat statistik' }, { status: 500 });
  }
}