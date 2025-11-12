// Xendit configuration and utilities
const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY;
const XENDIT_PUBLIC_KEY = process.env.XENDIT_PUBLIC_KEY;
const XENDIT_WEBHOOK_TOKEN = process.env.XENDIT_WEBHOOK_TOKEN;

if (!XENDIT_SECRET_KEY) {
  console.warn('XENDIT_SECRET_KEY not found in environment variables');
}

// Xendit API Base URL
const XENDIT_BASE_URL = 'https://api.xendit.co';

// Payment Methods Available
export const PAYMENT_METHODS = {
  VIRTUAL_ACCOUNT: 'VIRTUAL_ACCOUNT',
  EWALLET: 'EWALLET', 
  CREDIT_CARD: 'CREDIT_CARD',
  RETAIL_OUTLET: 'RETAIL_OUTLET',
  QR_CODE: 'QR_CODE'
};

// Bank Codes for Virtual Account
export const BANK_CODES = {
  BCA: 'BCA',
  BNI: 'BNI', 
  BRI: 'BRI',
  MANDIRI: 'MANDIRI',
  PERMATA: 'PERMATA',
  BJB: 'BJB'
};

// E-Wallet Types
export const EWALLET_TYPES = {
  OVO: 'OVO',
  DANA: 'DANA', 
  LINKAJA: 'LINKAJA',
  SHOPEEPAY: 'SHOPEEPAY',
  GOPAY: 'GOPAY'
};

// Retail Outlet Codes
export const RETAIL_OUTLETS = {
  ALFAMART: 'ALFAMART',
  INDOMARET: 'INDOMARET'
};

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  EXPIRED: 'EXPIRED', 
  FAILED: 'FAILED'
};

// Utility function to create Xendit headers
export function getXenditHeaders() {
  return {
    'Authorization': `Basic ${Buffer.from(XENDIT_SECRET_KEY + ':').toString('base64')}`,
    'Content-Type': 'application/json'
  };
}

// Generate external ID for transactions
export function generateExternalId(orderId) {
  const timestamp = Date.now();
  return `pisang-ijo-${orderId}-${timestamp}`;
}

// Calculate total amount including admin fee
export function calculateTotalAmount(orderAmount, paymentMethod = null) {
  let adminFee = 0;
  
  // Admin fee structure (sesuaikan dengan kebutuhan)
  switch (paymentMethod) {
    case PAYMENT_METHODS.VIRTUAL_ACCOUNT:
      adminFee = 4000; // Rp 4,000 for VA
      break;
    case PAYMENT_METHODS.EWALLET:
      adminFee = Math.max(2000, orderAmount * 0.007); // 0.7% min Rp 2,000
      break;
    case PAYMENT_METHODS.CREDIT_CARD:
      adminFee = orderAmount * 0.029; // 2.9%
      break;
    case PAYMENT_METHODS.RETAIL_OUTLET:
      adminFee = 2500; // Rp 2,500 for retail outlets
      break;
    case PAYMENT_METHODS.QR_CODE:
      adminFee = orderAmount * 0.007; // 0.7%
      break;
    default:
      adminFee = 0;
  }
  
  return {
    orderAmount,
    adminFee: Math.ceil(adminFee),
    totalAmount: orderAmount + Math.ceil(adminFee)
  };
}

// Format currency for display
export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

// Validate webhook signature
export function validateWebhookSignature(rawBody, signature) {
  if (!XENDIT_WEBHOOK_TOKEN) return false;
  
  const crypto = require('crypto');
  const hash = crypto
    .createHmac('sha256', XENDIT_WEBHOOK_TOKEN)
    .update(rawBody)
    .digest('hex');
    
  return hash === signature;
}

export { XENDIT_BASE_URL, XENDIT_SECRET_KEY, XENDIT_PUBLIC_KEY };