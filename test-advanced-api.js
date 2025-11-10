// Advanced API Testing - Multiple URL patterns
// Testing different possible endpoint structures

async function testMultipleEndpoints() {
  console.log('🔍 ADVANCED API ENDPOINT TESTING');
  console.log('=================================');
  console.log('');

  const API_KEY = process.env.RAJAONGKIR_SHIPPING_KEY || 'ZkEZxeyR9d14ecc39dc26b266EVRZapb';
  
  // Different possible base URLs and endpoint patterns
  const testConfigs = [
    // Original RajaOngkir
    {
      name: 'Original RajaOngkir (Deprecated)',
      baseUrl: 'https://api.rajaongkir.com',
      provinceEndpoint: '/starter/province',
      cityEndpoint: '/starter/city',
      costEndpoint: '/starter/cost',
      headers: { 'key': API_KEY }
    },
    
    // New Komerce API patterns
    {
      name: 'Komerce V1 - Pattern 1',
      baseUrl: 'https://api.collaborator.komerce.id',
      provinceEndpoint: '/api/v1/destination/province',
      cityEndpoint: '/api/v1/destination/city',
      costEndpoint: '/api/v1/cost',
      headers: { 'key': API_KEY, 'Content-Type': 'application/json' }
    },
    
    {
      name: 'Komerce V1 - Pattern 2',
      baseUrl: 'https://api.collaborator.komerce.id',
      provinceEndpoint: '/v1/destination/province',
      cityEndpoint: '/v1/destination/city', 
      costEndpoint: '/v1/cost',
      headers: { 'key': API_KEY, 'Content-Type': 'application/json' }
    },
    
    {
      name: 'Komerce V1 - Pattern 3',
      baseUrl: 'https://api.collaborator.komerce.id',
      provinceEndpoint: '/destination/province',
      cityEndpoint: '/destination/city',
      costEndpoint: '/cost',
      headers: { 'key': API_KEY, 'Content-Type': 'application/json' }
    },
    
    // Alternative headers
    {
      name: 'Komerce with Authorization Header',
      baseUrl: 'https://api.collaborator.komerce.id',
      provinceEndpoint: '/api/v1/destination/province',
      cityEndpoint: '/api/v1/destination/city',
      costEndpoint: '/api/v1/cost',
      headers: { 
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json' 
      }
    },
    
    {
      name: 'Komerce with X-API-Key Header',
      baseUrl: 'https://api.collaborator.komerce.id',
      provinceEndpoint: '/api/v1/destination/province',
      cityEndpoint: '/api/v1/destination/city',
      costEndpoint: '/api/v1/cost',
      headers: { 
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json' 
      }
    },

    // Sandbox versions
    {
      name: 'Sandbox V1',
      baseUrl: 'https://api-sandbox.collaborator.komerce.id',
      provinceEndpoint: '/api/v1/destination/province',
      cityEndpoint: '/api/v1/destination/city',
      costEndpoint: '/api/v1/cost',
      headers: { 'key': API_KEY, 'Content-Type': 'application/json' }
    }
  ];

  for (const config of testConfigs) {
    console.log(`\n🧪 Testing: ${config.name}`);
    console.log(''.padEnd(50, '-'));
    
    const provinceUrl = config.baseUrl + config.provinceEndpoint;
    console.log(`URL: ${provinceUrl}`);
    console.log(`Headers:`, Object.keys(config.headers).map(k => `${k}: ${k.includes('key') || k.includes('Authorization') ? config.headers[k].substring(0, 10) + '...' : config.headers[k]}`).join(', '));
    
    try {
      const response = await fetch(provinceUrl, {
        method: 'GET',
        headers: config.headers
      });
      
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ SUCCESS!');
        console.log('Response keys:', Object.keys(data));
        
        if (data.data && Array.isArray(data.data)) {
          console.log(`Found ${data.data.length} provinces`);
          console.log('First province:', data.data[0]);
        }
        
        // If this works, test cities too
        const cityUrl = config.baseUrl + config.cityEndpoint + '?province_id=6';
        console.log(`\n   Testing cities: ${cityUrl}`);
        
        const cityResponse = await fetch(cityUrl, {
          method: 'GET',
          headers: config.headers
        });
        
        console.log(`   Cities Status: ${cityResponse.status} ${cityResponse.statusText}`);
        
        if (cityResponse.ok) {
          const cityData = await cityResponse.json();
          console.log('   ✅ Cities also work!');
          if (cityData.data) {
            console.log(`   Found ${cityData.data.length} cities in Jakarta`);
          }
        }
        
        console.log('\n🎉 WORKING CONFIGURATION FOUND!');
        console.log('Use this configuration in your rajaongkir.js file');
        break;
        
      } else {
        const errorText = await response.text();
        console.log(`❌ Failed: ${response.status}`);
        
        if (response.status === 401) {
          console.log('   → Authentication issue');
        } else if (response.status === 404) {
          console.log('   → Endpoint not found');
        } else if (response.status === 403) {
          console.log('   → Access forbidden');
        } else if (response.status === 410) {
          console.log('   → Service discontinued');
        }
        
        // Show first part of error for debugging
        if (errorText.length < 200) {
          console.log('   Error:', errorText);
        }
      }
      
    } catch (error) {
      console.log(`❌ Connection Error: ${error.message}`);
    }
  }

  console.log('\n\n🤔 WHAT IF NONE OF THEM WORK?');
  console.log('===============================');
  console.log('1. Your API key might be expired or invalid');
  console.log('2. You might need a new account at collaborator.komerce.id');
  console.log('3. The API structure might be completely different');
  console.log('4. Your fallback system is actually the best solution right now');
  console.log('');
  console.log('💡 RECOMMENDATION:');
  console.log('Since your fallback system works perfectly and covers all Indonesian');
  console.log('provinces and cities, you might want to stick with it and use the');
  console.log('zone-based pricing system instead of trying to fix the API.');
  console.log('');
  console.log('Your current system provides:');
  console.log('✅ All 34 Indonesian provinces');
  console.log('✅ 500+ cities with accurate data');
  console.log('✅ Zone-based shipping calculation');
  console.log('✅ Fallback when APIs are down');
  console.log('✅ No dependency on external services');
  console.log('✅ Always available and fast');
}

testMultipleEndpoints().catch(console.error);