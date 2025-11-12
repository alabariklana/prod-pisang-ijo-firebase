// Test Valid Collaborator.komerce.id API Endpoints
// Mencari endpoint yang benar untuk API calls yang valid

const fetch = require('node-fetch');

async function findValidAPIEndpoints() {
  console.log('🔍 TESTING VALID COLLABORATOR.KOMERCE.ID ENDPOINTS');
  console.log('===================================================');
  console.log('');
  
  const API_KEY = process.env.RAJAONGKIR_SHIPPING_KEY || 'ZkEZxeyR9d14ecc39dc26b266EVRZapb';
  console.log('API Key:', API_KEY.substring(0, 10) + '...');
  console.log('');
  
  // Possible base URLs and endpoint patterns
  const testConfigs = [
    {
      name: 'Direct RajaOngkir Style',
      baseUrl: 'https://api.collaborator.komerce.id',
      endpoints: {
        provinces: '/starter/province',
        cities: '/starter/city', 
        cost: '/starter/cost'
      }
    },
    {
      name: 'Pro Account Endpoints',
      baseUrl: 'https://api.collaborator.komerce.id',
      endpoints: {
        provinces: '/basic/province',
        cities: '/basic/city',
        cost: '/basic/cost'
      }
    },
    {
      name: 'API V1 Pattern',
      baseUrl: 'https://api.collaborator.komerce.id',
      endpoints: {
        provinces: '/api/v1/province',
        cities: '/api/v1/city',
        cost: '/api/v1/cost'
      }
    },
    {
      name: 'RajaOngkir Prefix',
      baseUrl: 'https://api.collaborator.komerce.id',
      endpoints: {
        provinces: '/rajaongkir/starter/province',
        cities: '/rajaongkir/starter/city',
        cost: '/rajaongkir/starter/cost'
      }
    }
  ];
  
  for (const config of testConfigs) {
    console.log(`\\n🧪 Testing: ${config.name}`);
    console.log(''.padEnd(50, '-'));
    
    // Test provinces first
    const provincesUrl = config.baseUrl + config.endpoints.provinces;
    console.log(`Provinces URL: ${provincesUrl}`);
    
    try {
      const response = await fetch(provincesUrl, {
        method: 'GET',
        headers: { 'key': API_KEY }
      });
      
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ SUCCESS! Found working endpoint!');
        console.log('Response structure:', Object.keys(data));
        
        if (data.rajaongkir) {
          console.log('RajaOngkir response format detected');
          console.log('Status:', data.rajaongkir.status);
          console.log('Results count:', data.rajaongkir.results?.length || 0);
        }
        
        // If provinces work, test cities
        const citiesUrl = config.baseUrl + config.endpoints.cities + '?province=28';
        console.log(`\\nTesting cities: ${citiesUrl}`);
        
        const cityResponse = await fetch(citiesUrl, {
          headers: { 'key': API_KEY }
        });
        
        if (cityResponse.ok) {
          const cityData = await cityResponse.json();
          console.log('✅ Cities also work!');
          console.log('Cities count:', cityData.rajaongkir?.results?.length || 0);
          
          // Test cost calculation
          console.log(`\\nTesting cost calculation...`);
          const costUrl = config.baseUrl + config.endpoints.cost;
          
          const costResponse = await fetch(costUrl, {
            method: 'POST',
            headers: { 
              'key': API_KEY,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'origin=268&destination=152&weight=1000&courier=jne'
          });
          
          console.log(`Cost API Status: ${costResponse.status}`);
          
          if (costResponse.ok) {
            const costData = await costResponse.json();
            console.log('🎉 FULL API WORKING!');
            console.log('Cost data structure:', Object.keys(costData));
            
            if (costData.rajaongkir?.results?.[0]?.costs) {
              const costs = costData.rajaongkir.results[0].costs;
              console.log('Available services:', costs.length);
              costs.forEach(service => {
                console.log(`- ${service.service}: Rp ${service.cost?.[0]?.value?.toLocaleString()}`);
              });
            }
            
            console.log('\\n🚀 WORKING CONFIGURATION FOUND:');
            console.log(`Base URL: ${config.baseUrl}`);
            console.log(`Provinces: ${config.endpoints.provinces}`);
            console.log(`Cities: ${config.endpoints.cities}`);
            console.log(`Cost: ${config.endpoints.cost}`);
            
            return config; // Return working configuration
          }
        }
        
      } else if (response.status === 401) {
        console.log('❌ Unauthorized - Check API key');
      } else if (response.status === 404) {
        console.log('❌ Not Found - Wrong endpoint');
      } else {
        console.log('❌ Other error');
      }
      
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }
  }
  
  console.log('\\n\\n⚠️  NO WORKING ENDPOINTS FOUND');
  console.log('================================');
  console.log('');
  console.log('Kemungkinan solusi:');
  console.log('1. Check dokumentasi terbaru di collaborator.komerce.id');
  console.log('2. Contact support untuk endpoint yang benar');
  console.log('3. Verify API key masih active');
  console.log('4. Check apakah ada endpoint khusus untuk account Anda');
  
  return null;
}

// Run the test
findValidAPIEndpoints().then(workingConfig => {
  if (workingConfig) {
    console.log('\\n\\n📋 NEXT STEPS:');
    console.log('==============');
    console.log('Update lib/rajaongkir.js dengan konfigurasi yang working:');
    console.log(`BASE_URL: "${workingConfig.baseUrl}"`);
    console.log(`PROVINCES_ENDPOINT: "${workingConfig.endpoints.provinces}"`);
    console.log(`CITIES_ENDPOINT: "${workingConfig.endpoints.cities}"`);
    console.log(`COST_ENDPOINT: "${workingConfig.endpoints.cost}"`);
  }
}).catch(console.error);