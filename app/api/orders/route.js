import { ApiResponse, handleApiError, validateRequiredFields } from '@/lib/api-utils';
import { withDatabase } from '@/lib/mongodb';

/**
 * GET /api/orders - Fetch all orders with pagination support
 */
export async function GET(request) {
  return withDatabase(async (db) => {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page')) || 1;
      const limit = parseInt(searchParams.get('limit')) || 20;
      const status = searchParams.get('status');
      const sort = searchParams.get('sort') || 'createdAt';
      const order = searchParams.get('order') === 'asc' ? 1 : -1;

      // Build filter
      const filter = {};
      if (status && status !== 'all') {
        filter.status = status;
      }

      // Build sort
      const sortObj = {};
      sortObj[sort] = order;

      const skip = (page - 1) * limit;

      // Execute query with pagination
      const [orders, total] = await Promise.all([
        db.collection('orders')
          .find(filter)
          .sort(sortObj)
          .skip(skip)
          .limit(limit)
          .toArray(),
        db.collection('orders').countDocuments(filter)
      ]);

      // Convert MongoDB _id to string for JSON serialization
      const ordersWithId = orders.map(order => ({
        ...order,
        _id: order._id.toString(),
        id: order._id.toString()
      }));

      const pagination = {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      };

      return ApiResponse.success({
        orders: ordersWithId,
        pagination
      }, 'Pesanan berhasil dimuat');

    } catch (error) {
      return handleApiError(error, 'Gagal memuat pesanan');
    }
  });
}

/**
 * Generate unique order number
 * @returns {string} Unique order number
 */
function generateOrderNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
}

/**
 * Validate order items
 * @param {Array} items - Order items array
 * @returns {Object} Validation result
 */
function validateOrderItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return { valid: false, error: 'Items harus berupa array dan tidak boleh kosong' };
  }

  for (const item of items) {
    const requiredItemFields = ['productId', 'name', 'quantity', 'price'];
    const validation = validateRequiredFields(item, requiredItemFields);
    if (!validation.valid) {
      return { valid: false, error: `Item tidak valid: ${validation.error}` };
    }

    if (Number(item.quantity) <= 0) {
      return { valid: false, error: 'Quantity item harus lebih dari 0' };
    }

    if (Number(item.price) <= 0) {
      return { valid: false, error: 'Harga item harus lebih dari 0' };
    }
  }

  return { valid: true };
}

/**
 * POST /api/orders - Create a new order
 */
export async function POST(request) {
  return withDatabase(async (db) => {
    try {
      const body = await request.json().catch(() => null);
      if (!body) {
        return ApiResponse.error('Invalid JSON format', 400);
      }

      const { 
        customerName, 
        customerEmail, 
        customerPhone, 
        customerAddress, 
        items, 
        subtotal, 
        shippingCost, 
        totalAmount, 
        shipping, 
        notes 
      } = body;

      // Validate required fields
      const requiredFields = {
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        items,
        subtotal,
        totalAmount
      };

      const fieldValidation = validateRequiredFields(requiredFields, Object.keys(requiredFields));
      if (!fieldValidation.valid) {
        return ApiResponse.error(fieldValidation.error, 400);
      }

      // Validate items
      const itemsValidation = validateOrderItems(items);
      if (!itemsValidation.valid) {
        return ApiResponse.error(itemsValidation.error, 400);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail)) {
        return ApiResponse.error('Format email tidak valid', 400);
      }

      // Calculate total to verify
      const calculatedSubtotal = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
      const calculatedTotal = calculatedSubtotal + Number(shippingCost || 0);

      if (Math.abs(calculatedTotal - Number(totalAmount)) > 0.01) {
        return ApiResponse.error('Total amount tidak sesuai dengan perhitungan', 400);
      }

      const orderNumber = generateOrderNumber();
      const orderDoc = {
        orderNumber,
        customerName: String(customerName).trim(),
        customerEmail: String(customerEmail).trim().toLowerCase(),
        customerPhone: String(customerPhone).trim(),
        customerAddress: String(customerAddress).trim(),
        items: items.map(item => ({
          productId: String(item.productId),
          name: String(item.name).trim(),
          quantity: Number(item.quantity),
          price: Number(item.price),
          total: Number(item.quantity) * Number(item.price)
        })),
        subtotal: Number(subtotal),
        shippingCost: Number(shippingCost || 0),
        totalAmount: Number(totalAmount),
        shipping: shipping || null,
        notes: notes ? String(notes).trim() : '',
        status: 'pending',
        paymentStatus: 'unpaid',
        trackingNumber: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('orders').insertOne(orderDoc);

      return ApiResponse.success({
        orderId: result.insertedId.toString(),
        orderNumber,
        status: 'pending',
        paymentStatus: 'unpaid'
      }, 'Pesanan berhasil dibuat', 201);

    } catch (error) {
      return handleApiError(error, 'Gagal membuat pesanan');
    }
  });
}