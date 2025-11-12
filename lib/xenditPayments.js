import { NextResponse } from 'next/server';
import { 
  XENDIT_BASE_URL, 
  getXenditHeaders, 
  generateExternalId,
  calculateTotalAmount,
  PAYMENT_METHODS,
  BANK_CODES,
  EWALLET_TYPES,
  RETAIL_OUTLETS
} from '@/lib/xendit';

// Create Virtual Account Payment
export async function createVirtualAccount(orderData) {
  const { orderId, amount, customerInfo, bankCode = BANK_CODES.BCA } = orderData;
  
  const externalId = generateExternalId(orderId);
  const { totalAmount } = calculateTotalAmount(amount, PAYMENT_METHODS.VIRTUAL_ACCOUNT);
  
  const payload = {
    external_id: externalId,
    bank_code: bankCode,
    name: customerInfo.name || 'Pisang Ijo Customer',
    expected_amount: totalAmount,
    expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    is_closed: true,
    description: `Pembayaran untuk pesanan ${orderId} - Pisang Ijo`
  };

  try {
    const response = await fetch(`${XENDIT_BASE_URL}/callback_virtual_accounts`, {
      method: 'POST',
      headers: getXenditHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Xendit API Error: ${response.status} ${error}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: {
        paymentId: result.id,
        externalId: result.external_id,
        bankCode: result.bank_code,
        accountNumber: result.account_number,
        amount: result.expected_amount,
        expirationDate: result.expiration_date,
        status: result.status
      }
    };
  } catch (error) {
    console.error('Create Virtual Account Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Create E-Wallet Payment
export async function createEwalletPayment(orderData) {
  const { orderId, amount, customerInfo, ewalletType = EWALLET_TYPES.OVO } = orderData;
  
  const externalId = generateExternalId(orderId);
  const { totalAmount } = calculateTotalAmount(amount, PAYMENT_METHODS.EWALLET);
  
  const payload = {
    external_id: externalId,
    amount: totalAmount,
    phone: customerInfo.phone,
    ewallet_type: ewalletType,
    callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/callback`,
    redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?order_id=${orderId}`
  };

  try {
    const response = await fetch(`${XENDIT_BASE_URL}/ewallets`, {
      method: 'POST',
      headers: getXenditHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Xendit API Error: ${response.status} ${error}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: {
        paymentId: result.id,
        externalId: result.external_id,
        ewalletType: result.ewallet_type,
        amount: result.amount,
        checkoutUrl: result.checkout_url,
        status: result.status
      }
    };
  } catch (error) {
    console.error('Create E-Wallet Payment Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Create Retail Outlet Payment
export async function createRetailOutletPayment(orderData) {
  const { orderId, amount, customerInfo, retailOutletName = RETAIL_OUTLETS.ALFAMART } = orderData;
  
  const externalId = generateExternalId(orderId);
  const { totalAmount } = calculateTotalAmount(amount, PAYMENT_METHODS.RETAIL_OUTLET);
  
  const payload = {
    external_id: externalId,
    retail_outlet_name: retailOutletName,
    name: customerInfo.name || 'Pisang Ijo Customer',
    expected_amount: totalAmount,
    expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    description: `Pembayaran untuk pesanan ${orderId} - Pisang Ijo`
  };

  try {
    const response = await fetch(`${XENDIT_BASE_URL}/fixed_payment_code`, {
      method: 'POST', 
      headers: getXenditHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Xendit API Error: ${response.status} ${error}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: {
        paymentId: result.id,
        externalId: result.external_id,
        retailOutletName: result.retail_outlet_name,
        paymentCode: result.payment_code,
        amount: result.expected_amount,
        expirationDate: result.expiration_date,
        status: result.status
      }
    };
  } catch (error) {
    console.error('Create Retail Outlet Payment Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Create QR Code Payment
export async function createQRPayment(orderData) {
  const { orderId, amount, customerInfo } = orderData;
  
  const externalId = generateExternalId(orderId);
  const { totalAmount } = calculateTotalAmount(amount, PAYMENT_METHODS.QR_CODE);
  
  const payload = {
    external_id: externalId,
    type: 'DYNAMIC',
    currency: 'IDR',
    amount: totalAmount,
    callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/callback`
  };

  try {
    const response = await fetch(`${XENDIT_BASE_URL}/qr_codes`, {
      method: 'POST',
      headers: getXenditHeaders(), 
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Xendit API Error: ${response.status} ${error}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: {
        paymentId: result.id,
        externalId: result.external_id,
        qrString: result.qr_string,
        amount: result.amount,
        status: result.status
      }
    };
  } catch (error) {
    console.error('Create QR Payment Error:', error);
    return {
      success: false, 
      error: error.message
    };
  }
}

// Get Payment Status
export async function getPaymentStatus(paymentId, paymentMethod) {
  try {
    let endpoint;
    
    switch (paymentMethod) {
      case PAYMENT_METHODS.VIRTUAL_ACCOUNT:
        endpoint = `/v2/virtual_accounts/${paymentId}`;
        break;
      case PAYMENT_METHODS.EWALLET:
        endpoint = `/ewallets/${paymentId}`;
        break;
      case PAYMENT_METHODS.RETAIL_OUTLET:
        endpoint = `/fixed_payment_code/${paymentId}`;
        break;
      case PAYMENT_METHODS.QR_CODE:
        endpoint = `/qr_codes/${paymentId}`;
        break;
      default:
        throw new Error('Invalid payment method');
    }

    const response = await fetch(`${XENDIT_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getXenditHeaders()
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Xendit API Error: ${response.status} ${error}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Get Payment Status Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}