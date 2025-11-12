import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { 
  createVirtualAccount,
  createEwalletPayment, 
  createRetailOutletPayment,
  createQRPayment 
} from '@/lib/xenditPayments';
import { PAYMENT_METHODS } from '@/lib/xendit';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      orderId, 
      amount, 
      paymentMethod,
      customerInfo,
      items = [],
      // Payment method specific data
      bankCode,
      ewalletType,
      retailOutletName
    } = body;

    // Validation
    if (!orderId || !amount || !paymentMethod || !customerInfo) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!customerInfo.name || !customerInfo.email) {
      return NextResponse.json(
        { success: false, error: 'Customer name and email are required' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Create order record in database
    const order = {
      orderId,
      amount: parseFloat(amount),
      paymentMethod,
      customerInfo,
      items,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('orders').insertOne(order);

    // Create payment based on method
    let paymentResult;
    const orderData = {
      orderId,
      amount: parseFloat(amount),
      customerInfo,
      bankCode,
      ewalletType,
      retailOutletName
    };

    switch (paymentMethod) {
      case PAYMENT_METHODS.VIRTUAL_ACCOUNT:
        paymentResult = await createVirtualAccount(orderData);
        break;
      case PAYMENT_METHODS.EWALLET:
        if (!customerInfo.phone) {
          return NextResponse.json(
            { success: false, error: 'Phone number is required for e-wallet payment' },
            { status: 400 }
          );
        }
        paymentResult = await createEwalletPayment(orderData);
        break;
      case PAYMENT_METHODS.RETAIL_OUTLET:
        paymentResult = await createRetailOutletPayment(orderData);
        break;
      case PAYMENT_METHODS.QR_CODE:
        paymentResult = await createQRPayment(orderData);
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid payment method' },
          { status: 400 }
        );
    }

    if (!paymentResult.success) {
      // Update order status to failed
      await db.collection('orders').updateOne(
        { orderId },
        { 
          $set: { 
            status: 'failed',
            error: paymentResult.error,
            updatedAt: new Date()
          }
        }
      );

      return NextResponse.json(
        { success: false, error: paymentResult.error },
        { status: 500 }
      );
    }

    // Update order with payment details
    await db.collection('orders').updateOne(
      { orderId },
      { 
        $set: { 
          paymentId: paymentResult.data.paymentId,
          paymentData: paymentResult.data,
          updatedAt: new Date()
        }
      }
    );

    // Reduce stock for ordered items
    if (items && items.length > 0) {
      for (const item of items) {
        await db.collection('products').updateOne(
          { _id: item.productId, stock: { $gte: item.quantity } },
          { 
            $inc: { stock: -item.quantity },
            $set: { updatedAt: new Date() }
          }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        paymentMethod,
        payment: paymentResult.data
      }
    });

  } catch (error) {
    console.error('Create Payment Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get payment status
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const order = await db.collection('orders').findOne({ orderId });
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.orderId,
        status: order.status,
        amount: order.amount,
        paymentMethod: order.paymentMethod,
        paymentData: order.paymentData,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error('Get Payment Status Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}