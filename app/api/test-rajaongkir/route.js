import { NextResponse } from 'next/server';

export async function GET() {
  console.log('=== TESTING RAJAONGKIR API ===');
  
  const API_KEY = process.env.RAJAONGKIR_SHIPPING_KEY || 'ZkEZxeyR9d14ecc39dc26b266EVRZapb';
  const BASE_URL = 'https://api.rajaongkir.com/starter';
  
  console.log('Testing with API Key:', API_KEY);
  console.log('Base URL:', BASE_URL);
  
  try {
    // Test 1: Basic province fetch
    console.log('--- TEST 1: Basic Province Fetch ---');
    
    const response = await fetch(`${BASE_URL}/province`, {
      method: 'GET',
      headers: {
        'key': API_KEY
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Raw response text:', responseText);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('Parsed response:', responseData);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON response from RajaOngkir',
        rawResponse: responseText,
        apiKey: API_KEY
      });
    }
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      data: responseData,
      apiKey: API_KEY,
      baseUrl: BASE_URL
    });
    
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      apiKey: API_KEY,
      baseUrl: BASE_URL
    });
  }
}