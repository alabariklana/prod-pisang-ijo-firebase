import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

// --- new / improved checks & connection handling ---
if (!process.env.MONGO_URL) {
  console.error('MONGO_URL is not set. Set MONGO_URL in .env.local (e.g. MONGO_URL="mongodb://localhost:27017")')
}

let client
let db

async function connectToMongo() {
  if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL is not configured')
  }

  if (!client) {
    // set a short serverSelectionTimeoutMS to fail fast during dev
    client = new MongoClient(process.env.MONGO_URL, { serverSelectionTimeoutMS: 5000 })
    try {
      await client.connect()
      db = client.db(process.env.DB_NAME || 'pisangijo')
      console.log('Connected to MongoDB:', process.env.DB_NAME || 'pisangijo')
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err?.message || err)
      // close client to allow retry on next request
      try { await client.close() } catch (_) {}
      client = null
      throw err
    }
  }
  return db
}

// Brevo API helper using fetch
async function callBrevoAPI(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json'
    }
  }
  
  if (body) {
    options.body = JSON.stringify(body)
  }
  
  const response = await fetch(`https://api.brevo.com/v3${endpoint}`, options)
  return response.json()
}

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`

  // quick guard: friendly error if env missing
  if (!process.env.MONGO_URL) {
    return handleCORS(NextResponse.json(
      { error: 'Server misconfigured: MONGO_URL not set. Set it in .env.local' },
      { status: 500 }
    ))
  }

  const method = request.method

  try {
    const db = await connectToMongo()

    // ============ PRODUCTS ENDPOINTS ============
    
    // GET /api/products - Get all products
    if (route === '/products' && method === 'GET') {
      const products = await db.collection('products').find({}).toArray()
      const cleanedProducts = products.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleanedProducts))
    }

    // POST /api/products - Create new product
    if (route === '/products' && method === 'POST') {
      const body = await request.json()
      const product = {
        id: uuidv4(),
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
        description: body.description || '',
        price: body.price || 0,
        image: body.image || '',
        category: body.category || 'Pisang Ijo',
        available: body.available !== undefined ? body.available : true,
        createdAt: new Date()
      }
      await db.collection('products').insertOne(product)
      const { _id, ...cleanedProduct } = product
      return handleCORS(NextResponse.json(cleanedProduct, { status: 201 }))
    }

    // GET /api/products/:slug - Get product by slug
    if (route.startsWith('/products/') && method === 'GET') {
      const slug = path[1]
      const product = await db.collection('products').findOne({ slug })
      if (!product) {
        return handleCORS(NextResponse.json({ error: 'Product not found' }, { status: 404 }))
      }
      const { _id, ...cleanedProduct } = product
      return handleCORS(NextResponse.json(cleanedProduct))
    }

    // PUT /api/products/:id - Update product
    if (route.startsWith('/products/') && method === 'PUT') {
      const id = path[1]
      const body = await request.json()
      const updateData = {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        image: body.image,
        category: body.category,
        available: body.available
      }
      await db.collection('products').updateOne({ id }, { $set: updateData })
      return handleCORS(NextResponse.json({ success: true, id }))
    }

    // DELETE /api/products/:id - Delete product
    if (route.startsWith('/products/') && method === 'DELETE') {
      const id = path[1]
      await db.collection('products').deleteOne({ id })
      return handleCORS(NextResponse.json({ success: true }))
    }

    // ============ ORDERS ENDPOINTS ============
    
    // GET /api/orders - Get all orders
    if (route === '/orders' && method === 'GET') {
      const orders = await db.collection('orders').find({}).sort({ createdAt: -1 }).toArray()
      const cleanedOrders = orders.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleanedOrders))
    }

    // POST /api/orders - Create new order
    if (route === '/orders' && method === 'POST') {
      const body = await request.json()
      const orderNumber = `PJ-${Date.now()}`
      const order = {
        id: uuidv4(),
        orderNumber,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        customerAddress: body.customerAddress,
        items: body.items || [],
        totalAmount: body.totalAmount || 0,
        status: 'pending',
        notes: body.notes || '',
        createdAt: new Date()
      }
      await db.collection('orders').insertOne(order)
      
      // Save customer info
      const customer = await db.collection('customers').findOne({ email: body.customerEmail })
      if (!customer) {
        await db.collection('customers').insertOne({
          id: uuidv4(),
          name: body.customerName,
          email: body.customerEmail,
          phone: body.customerPhone,
          address: body.customerAddress,
          totalOrders: 1,
          createdAt: new Date()
        })
      } else {
        await db.collection('customers').updateOne(
          { email: body.customerEmail },
          { $inc: { totalOrders: 1 } }
        )
      }
      
      const { _id, ...cleanedOrder } = order
      return handleCORS(NextResponse.json(cleanedOrder, { status: 201 }))
    }

    // GET /api/orders/:id - Get order by ID
    if (route.startsWith('/orders/') && path.length === 2 && method === 'GET') {
      const id = path[1]
      const order = await db.collection('orders').findOne({ id })
      if (!order) {
        return handleCORS(NextResponse.json({ error: 'Order not found' }, { status: 404 }))
      }
      const { _id, ...cleanedOrder } = order
      return handleCORS(NextResponse.json(cleanedOrder))
    }

    // PUT /api/orders/:id/status - Update order status
    if (route.match(/^\/orders\/[^\/]+\/status$/) && method === 'PUT') {
      const id = path[1]
      const body = await request.json()
      await db.collection('orders').updateOne(
        { id },
        { $set: { status: body.status } }
      )
      return handleCORS(NextResponse.json({ success: true, id, status: body.status }))
    }

    // ============ CUSTOMERS ENDPOINTS ============
    
    // GET /api/customers - Get all customers
    if (route === '/customers' && method === 'GET') {
      const customers = await db.collection('customers').find({}).toArray()
      const cleanedCustomers = customers.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleanedCustomers))
    }

    // ============ NEWSLETTER ENDPOINTS ============
    
    // GET /api/newsletter/subscribers - Get all subscribers
    if (route === '/newsletter/subscribers' && method === 'GET') {
      const subscribers = await db.collection('newsletter').find({}).toArray()
      const cleanedSubscribers = subscribers.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleanedSubscribers))
    }

    // POST /api/newsletter/subscribe - Subscribe to newsletter
    if (route === '/newsletter/subscribe' && method === 'POST') {
      const body = await request.json()
      
      // Check if already subscribed
      const existing = await db.collection('newsletter').findOne({ email: body.email })
      if (existing) {
        return handleCORS(NextResponse.json({ message: 'Already subscribed' }))
      }

      // Add to database
      const subscriber = {
        id: uuidv4(),
        email: body.email,
        active: true,
        subscribedAt: new Date()
      }
      await db.collection('newsletter').insertOne(subscriber)

      // Add to Brevo
      try {
        await callBrevoAPI('/contacts', 'POST', {
          email: body.email,
          listIds: [2],
          updateEnabled: true
        })
      } catch (error) {
        console.error('Brevo error:', error)
      }

      const { _id, ...cleanedSubscriber } = subscriber
      return handleCORS(NextResponse.json(cleanedSubscriber, { status: 201 }))
    }

    // POST /api/newsletter/broadcast - Send broadcast email
    if (route === '/newsletter/broadcast' && method === 'POST') {
      const body = await request.json()
      
      try {
        const result = await callBrevoAPI('/smtp/email', 'POST', {
          sender: { name: "Pisang Ijo Evi", email: body.senderEmail || "noreply@pisangijo.com" },
          to: body.recipients || [],
          subject: body.subject,
          htmlContent: body.htmlContent
        })
        
        return handleCORS(NextResponse.json({ success: true, messageId: result.messageId }))
      } catch (error) {
        console.error('Brevo broadcast error:', error)
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
    }

    // ============ STATISTICS ENDPOINTS ============
    
    // GET /api/statistics - Get dashboard statistics
    if (route === '/statistics' && method === 'GET') {
      const totalOrders = await db.collection('orders').countDocuments()
      const totalCustomers = await db.collection('customers').countDocuments()
      const totalProducts = await db.collection('products').countDocuments()
      
      const orders = await db.collection('orders').find({}).toArray()
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
      
      const pendingOrders = await db.collection('orders').countDocuments({ status: 'pending' })
      const completedOrders = await db.collection('orders').countDocuments({ status: 'selesai' })
      const shippedOrders = await db.collection('orders').countDocuments({ status: 'dikirim' })
      
      const recentOrders = await db.collection('orders')
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray()
      
      const cleanedRecentOrders = recentOrders.map(({ _id, ...rest }) => rest)
      
      return handleCORS(NextResponse.json({
        totalOrders,
        totalCustomers,
        totalProducts,
        totalRevenue,
        ordersByStatus: {
          pending: pendingOrders,
          selesai: completedOrders,
          dikirim: shippedOrders
        },
        recentOrders: cleanedRecentOrders
      }))
    }

    // Route not found
    return handleCORS(NextResponse.json(
      { error: `Route ${route} not found` }, 
      { status: 404 }
    ))

  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json(
      { error: "Internal server error", message: error.message }, 
      { status: 500 }
    ))
  }
}

// Export all HTTP methods
export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute