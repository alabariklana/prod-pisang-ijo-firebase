// Load environment variables first
require('dotenv').config({ path: '.env.local' });

// Test script untuk memverifikasi koneksi Xendit API
const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY;

if (!XENDIT_SECRET_KEY) {
  console.error('❌ XENDIT_SECRET_KEY tidak ditemukan di environment variables');
  process.exit(1);
}

console.log('🔑 Xendit API Key detected:', XENDIT_SECRET_KEY.substring(0, 20) + '...');

// Test basic API connection
async function testXenditConnection() {
  try {
    console.log('🧪 Testing Xendit API connection...');
    
    const headers = {
      'Authorization': `Basic ${Buffer.from(XENDIT_SECRET_KEY + ':').toString('base64')}`,
      'Content-Type': 'application/json'
    };

    // Test dengan mengambil balance (read-only operation)
    const response = await fetch('https://api.xendit.co/balance', {
      method: 'GET',
      headers
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Xendit API connection successful!');
      console.log('💰 Account Balance:', data.balance || 'N/A');
      return true;
    } else {
      const error = await response.text();
      console.log('❌ Xendit API Error:', response.status, error);
      return false;
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return false;
  }
}

// Test Virtual Account creation (dry run)
async function testVirtualAccountCreation() {
  try {
    console.log('🧪 Testing Virtual Account creation...');
    
    const headers = {
      'Authorization': `Basic ${Buffer.from(XENDIT_SECRET_KEY + ':').toString('base64')}`,
      'Content-Type': 'application/json'
    };

    const testPayload = {
      external_id: `TEST_${Date.now()}`,
      bank_code: 'BCA',
      name: 'Test Customer',
      expected_amount: 50000,
      expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      is_closed: true,
      description: 'Test Virtual Account - Pisang Ijo'
    };

    const response = await fetch('https://api.xendit.co/callback_virtual_accounts', {
      method: 'POST',
      headers,
      body: JSON.stringify(testPayload)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Virtual Account creation test successful!');
      console.log('🏦 Test VA Number:', data.account_number);
      console.log('💳 Bank:', data.bank_code);
      console.log('💰 Amount:', data.expected_amount);
      return true;
    } else {
      const error = await response.text();
      console.log('❌ Virtual Account creation failed:', response.status, error);
      return false;
    }
  } catch (error) {
    console.error('❌ Virtual Account test failed:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Xendit API Tests...\n');
  
  const connectionTest = await testXenditConnection();
  console.log('');
  
  if (connectionTest) {
    const vaTest = await testVirtualAccountCreation();
    console.log('');
    
    if (connectionTest && vaTest) {
      console.log('🎉 All tests passed! Xendit integration is ready.');
    } else {
      console.log('⚠️ Some tests failed. Check your configuration.');
    }
  } else {
    console.log('❌ Basic connection failed. Check your API key.');
  }
}

runTests();