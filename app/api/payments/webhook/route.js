import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { validateWebhookSignature } from '@/lib/xendit';

export async function POST(request) {
  try {
    const body = await request.text();
    const headers = request.headers;

    // Verify webhook signature
    const signature = headers.get('x-callback-token');
    const isValidWebhook = validateWebhookSignature(body, signature);
    
    if (!isValidWebhook) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const webhookData = JSON.parse(body);
    console.log('Webhook received:', webhookData);

    const { db } = await connectToDatabase();

    // Handle different webhook events
    switch (webhookData.event) {
      case 'payment.paid':
        await handlePaymentPaid(db, webhookData);
        break;
      case 'payment.expired':
        await handlePaymentExpired(db, webhookData);
        break;
      case 'payment.failed':
        await handlePaymentFailed(db, webhookData);
        break;
      default:
        console.log('Unhandled webhook event:', webhookData.event);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handlePaymentPaid(db, webhookData) {
  try {
    const { external_id, amount, payment_method } = webhookData;
    
    // Extract order ID from external_id (format: PISANGIJO_ORDERID_TIMESTAMP)
    const orderIdMatch = external_id.match(/^PISANGIJO_(.+)_\d+$/);
    if (!orderIdMatch) {
      console.error('Invalid external_id format:', external_id);
      return;
    }
    
    const orderId = orderIdMatch[1];

    // Update order status
    const updateResult = await db.collection('orders').updateOne(
      { orderId },
      { 
        $set: { 
          status: 'paid',
          paidAt: new Date(),
          updatedAt: new Date(),
          webhookData
        }
      }
    );

    if (updateResult.matchedCount === 0) {
      console.error('Order not found:', orderId);
      return;
    }

    // Get order details to process stock updates
    const order = await db.collection('orders').findOne({ orderId });
    
    if (order && order.items) {
      // Create inventory transaction log
      const inventoryTransaction = {
        orderId,
        type: 'sale',
        items: order.items,
        amount,
        paymentMethod: payment_method,
        createdAt: new Date()
      };
      
      await db.collection('inventory_transactions').insertOne(inventoryTransaction);

      // Update product stock and sales count
      for (const item of order.items) {
        await db.collection('products').updateOne(
          { _id: item.productId },
          { 
            $inc: { 
              salesCount: item.quantity,
              totalRevenue: item.price * item.quantity 
            },
            $set: { 
              updatedAt: new Date(),
              lastSoldAt: new Date()
            }
          }
        );
      }
    }

    console.log(`Payment successful for order: ${orderId}`);
    
    // TODO: Send confirmation email/SMS to customer
    // TODO: Trigger order fulfillment process

  } catch (error) {
    console.error('Handle Payment Paid Error:', error);
  }
}

async function handlePaymentExpired(db, webhookData) {
  try {
    const { external_id } = webhookData;
    
    const orderIdMatch = external_id.match(/^PISANGIJO_(.+)_\d+$/);
    if (!orderIdMatch) {
      console.error('Invalid external_id format:', external_id);
      return;
    }
    
    const orderId = orderIdMatch[1];

    // Update order status
    await db.collection('orders').updateOne(
      { orderId },
      { 
        $set: { 
          status: 'expired',
          expiredAt: new Date(),
          updatedAt: new Date(),
          webhookData
        }
      }
    );

    // Restore stock for expired order
    const order = await db.collection('orders').findOne({ orderId });
    
    if (order && order.items) {
      for (const item of order.items) {
        await db.collection('products').updateOne(
          { _id: item.productId },
          { 
            $inc: { stock: item.quantity },
            $set: { updatedAt: new Date() }
          }
        );
      }
    }

    console.log(`Payment expired for order: ${orderId}`);

  } catch (error) {
    console.error('Handle Payment Expired Error:', error);
  }
}

async function handlePaymentFailed(db, webhookData) {
  try {
    const { external_id, failure_reason } = webhookData;
    
    const orderIdMatch = external_id.match(/^PISANGIJO_(.+)_\d+$/);
    if (!orderIdMatch) {
      console.error('Invalid external_id format:', external_id);
      return;
    }
    
    const orderId = orderIdMatch[1];

    // Update order status
    await db.collection('orders').updateOne(
      { orderId },
      { 
        $set: { 
          status: 'failed',
          failureReason: failure_reason,
          failedAt: new Date(),
          updatedAt: new Date(),
          webhookData
        }
      }
    );

    // Restore stock for failed order
    const order = await db.collection('orders').findOne({ orderId });
    
    if (order && order.items) {
      for (const item of order.items) {
        await db.collection('products').updateOne(
          { _id: item.productId },
          { 
            $inc: { stock: item.quantity },
            $set: { updatedAt: new Date() }
          }
        );
      }
    }

    console.log(`Payment failed for order: ${orderId}, reason: ${failure_reason}`);

  } catch (error) {
    console.error('Handle Payment Failed Error:', error);
  }
}