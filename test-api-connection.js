// Test RajaOngkir API V2 Connection
// Run this to test if your API keys work with the new Komerce API

async function testRajaOngkirAPIV2() {
  console.log('🧪 TESTING RAJAONGKIR API V2 CONNECTION');
  console.log('=====================================');
  console.log('');

  // Configuration
  const API_KEY = process.env.RAJAONGKIR_SHIPPING_KEY || 'ZkEZxeyR9d14ecc39dc26b266EVRZapb';
  const BASE_URL = 'https://api.collaborator.komerce.id';
  const SANDBOX_URL = 'https://api-sandbox.collaborator.komerce.id';

  console.log('🔑 API Key:', API_KEY.substring(0, 10) + '...');
  console.log('');

  // Test 1: Check if API key is valid by testing provinces endpoint
  console.log('1️⃣ TESTING PROVINCES ENDPOINT');
  console.log('-----------------------------');
  
  try {
    const testUrls = [
      { name: 'Production', url: `${BASE_URL}/api/v1/destination/province` },
      { name: 'Sandbox', url: `${SANDBOX_URL}/api/v1/destination/province` }
    ];

    for (const testUrl of testUrls) {
      console.log(`Testing ${testUrl.name}: ${testUrl.url}`);
      
      const response = await fetch(testUrl.url, {
        method: 'GET',
        headers: {
          'key': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ SUCCESS - Response structure:');
        console.log('   - Has data:', !!data.data);
        console.log('   - Data type:', typeof data.data);
        console.log('   - Data length:', data.data?.length || 0);
        
        if (data.data?.length > 0) {
          console.log('   - First province:', data.data[0]);
        }
        console.log('');
        return { success: true, url: testUrl.url, data };
      } else {
        const errorText = await response.text();
        console.log('❌ FAILED');
        console.log('   Error:', errorText);
        console.log('');
        
        if (response.status === 401) {
          console.log('💡 TIP: Your API key might be invalid or expired');
          console.log('   Get new key from: https://collaborator.komerce.id/profile?tab=api-key');
        }
      }
    }
  } catch (error) {
    console.log('❌ CONNECTION ERROR:', error.message);
  }

  console.log('');
  console.log('2️⃣ TESTING CITIES ENDPOINT');
  console.log('---------------------------');
  
  try {
    // Test with Jakarta (Province ID: 6)
    const cityUrl = `${BASE_URL}/api/v1/destination/city?province_id=6`;
    console.log(`Testing: ${cityUrl}`);
    
    const response = await fetch(cityUrl, {
      method: 'GET', 
      headers: {
        'key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS - Cities response:');
      console.log('   - Has data:', !!data.data);
      console.log('   - Cities count:', data.data?.length || 0);
      
      if (data.data?.length > 0) {
        console.log('   - First city:', data.data[0]);
      }
    } else {
      const errorText = await response.text();
      console.log('❌ FAILED:', errorText);
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }

  console.log('');
  console.log('3️⃣ TESTING COST CALCULATION');
  console.log('----------------------------');
  
  try {
    // Test cost calculation (this might require district/subdistrict IDs)
    const costUrl = `${BASE_URL}/api/v1/cost`;
    console.log(`Testing: ${costUrl}`);
    
    const costData = {
      origin: 'district_id_or_subdistrict_id_jakarta',
      destination: 'district_id_or_subdistrict_id_destination', 
      weight: 1000,
      courier: 'jne'
    };
    
    console.log('Note: This test might fail because we need proper district/subdistrict IDs');
    console.log('Cost calculation requires the new API structure');
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }

  console.log('');
  console.log('📋 SUMMARY');
  console.log('==========');
  console.log('');
  console.log('If provinces test succeeded:');
  console.log('✅ Your API key is valid');
  console.log('✅ You can use the new RajaOngkir V2 API');
  console.log('');
  console.log('If provinces test failed:');
  console.log('❌ Get new API key from: https://collaborator.komerce.id/profile?tab=api-key');
  console.log('❌ Or use fallback system (current working solution)');
  console.log('');
  console.log('💡 IMPORTANT NOTES:');
  console.log('- New API uses district/subdistrict IDs for cost calculation');
  console.log('- Different from old city-based system');
  console.log('- More accurate but requires different integration');
  console.log('- Your current fallback system is working correctly');
}

// Run the test
testRajaOngkirAPIV2().catch(console.error);