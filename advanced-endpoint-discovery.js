// Advanced Endpoint Discovery for Collaborator.komerce.id
// Trying different subdomain patterns and URL structures

const fetch = require('node-fetch');

async function advancedEndpointDiscovery() {
  console.log('🔬 ADVANCED ENDPOINT DISCOVERY');
  console.log('==============================');
  console.log('');
  
  const API_KEY = process.env.RAJAONGKIR_SHIPPING_KEY || 'ZkEZxeyR9d14ecc39dc26b266EVRZapb';
  console.log('API Key:', API_KEY);
  console.log('');
  
  // Test different subdomain patterns
  const baseUrls = [
    'https://api.collaborator.komerce.id',
    'https://rajaongkir.collaborator.komerce.id', 
    'https://collaborator.komerce.id/api',
    'https://api.komerce.id',
    'https://rajaongkir.komerce.id',
    'https://pro-api.collaborator.komerce.id',
    'https://starter.collaborator.komerce.id'
  ];
  
  const endpointPatterns = [
    '/province',
    '/provinces', 
    '/starter/province',
    '/basic/province',
    '/pro/province',
    '/api/province',
    '/api/v1/province',
    '/rajaongkir/province',
    '/rajaongkir/starter/province'
  ];
  
  console.log('🌐 TESTING DIFFERENT BASE URLS AND PATTERNS');
  console.log('===========================================');
  
  for (const baseUrl of baseUrls) {
    console.log(`\\n📡 Testing base: ${baseUrl}`);
    
    for (const endpoint of endpointPatterns) {
      const fullUrl = baseUrl + endpoint;
      
      try {
        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: { 'key': API_KEY },
          timeout: 5000
        });
        
        if (response.ok) {
          console.log(`✅ FOUND WORKING ENDPOINT: ${fullUrl}`);
          
          try {
            const data = await response.json();
            console.log('Response structure:', Object.keys(data));
            
            if (data.rajaongkir) {
              console.log('🎉 RAJAONGKIR FORMAT DETECTED!');
              console.log('Status:', data.rajaongkir.status);
              console.log('Results:', data.rajaongkir.results?.length || 0);
              
              // Test cost endpoint with same base
              const costEndpoint = endpoint.replace('province', 'cost');
              const costUrl = baseUrl + costEndpoint;
              
              console.log(`Testing cost endpoint: ${costUrl}`);
              
              const costResponse = await fetch(costUrl, {
                method: 'POST',
                headers: { 
                  'key': API_KEY,
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'origin=268&destination=152&weight=1000&courier=jne'
              });
              
              if (costResponse.ok) {
                console.log('✅ Cost endpoint also works!');
                const costData = await costResponse.json();
                
                if (costData.rajaongkir?.results?.[0]?.costs) {
                  console.log('🚀 FULL WORKING API FOUND!');
                  
                  return {
                    baseUrl,
                    provinceEndpoint: endpoint,
                    cityEndpoint: endpoint.replace('province', 'city'),
                    costEndpoint: costEndpoint,
                    sample: costData
                  };
                }
              }
            }
            
          } catch (jsonError) {
            console.log('❌ Invalid JSON response');
          }
          
        } else if (response.status === 401) {
          console.log(`🔑 ${fullUrl} - Unauthorized (API key issue)`);
        } else if (response.status !== 404) {
          console.log(`❓ ${fullUrl} - Status ${response.status}`);
        }
        
      } catch (error) {
        // Skip connection errors for cleaner output
        if (!error.message.includes('ENOTFOUND')) {
          console.log(`❌ ${fullUrl} - ${error.message}`);
        }
      }
    }
  }
  
  console.log('\\n\\n🤔 STILL NO WORKING ENDPOINTS?');
  console.log('================================');
  console.log('');
  console.log('Possible reasons:');
  console.log('1. API structure completely different from RajaOngkir');
  console.log('2. Requires different authentication method');  
  console.log('3. Account-specific API URLs');
  console.log('4. Need to activate API access first');
  console.log('5. Different request headers required');
  console.log('');
  console.log('💡 SUGGESTIONS:');
  console.log('1. Login ke collaborator.komerce.id dashboard');
  console.log('2. Cek dokumentasi API atau contoh integration');
  console.log('3. Contact support untuk URL yang benar');
  console.log('4. Screenshot error dari dashboard jika ada');
  console.log('');
  
  // Test if API key works with any authentication
  console.log('🧪 TESTING AUTHENTICATION METHODS');
  console.log('=================================');
  
  const authTests = [
    {
      name: 'Header: key',
      headers: { 'key': API_KEY }
    },
    {
      name: 'Header: X-API-Key', 
      headers: { 'X-API-Key': API_KEY }
    },
    {
      name: 'Header: Authorization Bearer',
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    },
    {
      name: 'Header: Authorization Basic',
      headers: { 'Authorization': `Basic ${Buffer.from(API_KEY + ':').toString('base64')}` }
    }
  ];
  
  for (const authTest of authTests) {
    try {
      const response = await fetch('https://api.collaborator.komerce.id/', {
        headers: authTest.headers
      });
      
      console.log(`${authTest.name}: ${response.status} ${response.statusText}`);
      
      if (response.status !== 404) {
        const text = await response.text();
        if (text.length < 200) {
          console.log('Response:', text);
        }
      }
    } catch (error) {
      console.log(`${authTest.name}: ${error.message}`);
    }
  }
  
  return null;
}

// Run discovery
advancedEndpointDiscovery().then(result => {
  if (result) {
    console.log('\\n\\n🎯 WORKING CONFIGURATION FOUND:');
    console.log('================================');
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log('\\n\\n❌ NO WORKING CONFIGURATION FOUND');
    console.log('Recommend: Contact collaborator.komerce.id support for correct API documentation');
  }
}).catch(console.error);