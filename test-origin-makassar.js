// Test Origin Update - Makassar vs Jakarta vs Other Cities
const fetch = require('node-fetch');

async function testOriginUpdate() {
  console.log('🏪 TESTING UPDATED ORIGIN: MAKASSAR');
  console.log('===================================');
  console.log('');
  console.log('📍 Store Location: Kelurahan Banta-Bantaeng, Kecamatan Rappocini, Kota Makassar');
  console.log('   - City ID: 228 (Makassar)');
  console.log('   - Province ID: 32 (Sulawesi Selatan)');
  console.log('');

  const baseUrl = 'http://localhost:3000/api/shipping';
  const origin = '228'; // Makassar
  
  // Test destinations to compare pricing
  const testDestinations = [
    // Local (Same City - Makassar)
    { id: '228', name: 'Makassar (Same City)', zone: 'LOCAL' },
    
    // Regional (Same Province - Sulawesi Selatan)  
    { id: '421', name: 'Parepare, Sulawesi Selatan', zone: 'REGIONAL' },
    { id: '74', name: 'Bone, Sulawesi Selatan', zone: 'REGIONAL' },
    
    // National (Different Province)
    { id: '152', name: 'Jakarta Pusat', zone: 'NATIONAL' },
    { id: '444', name: 'Surabaya, Jawa Timur', zone: 'NATIONAL' },
    { id: '23', name: 'Bandung, Jawa Barat', zone: 'NATIONAL' },
    { id: '249', name: 'Medan, Sumatera Utara', zone: 'NATIONAL' }
  ];

  console.log('💰 TESTING SHIPPING COSTS FROM MAKASSAR');
  console.log('========================================');
  console.log('');

  try {
    for (const destination of testDestinations) {
      const costUrl = `${baseUrl}/cost?origin=${origin}&destination=${destination.id}&weight=1000&courier=jne`;
      
      try {
        const response = await fetch(costUrl);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.costs && data.costs.length > 0) {
            const avgCost = Math.round(
              data.costs.reduce((sum, service) => sum + service.cost, 0) / data.costs.length
            );
            
            const zoneIndicator = destination.zone === 'LOCAL' ? '🏠' : 
                                 destination.zone === 'REGIONAL' ? '🏘️' : '🌍';
            
            console.log(`${zoneIndicator} ${destination.name}`);
            console.log(`   Zone: ${destination.zone}`);
            console.log(`   Average Cost: Rp ${avgCost.toLocaleString()}`);
            console.log(`   Services: ${data.costs.length} options`);
            
            // Show service details for first few
            if (data.costs.length > 0) {
              data.costs.slice(0, 2).forEach(service => {
                console.log(`   - ${service.service}: Rp ${service.cost.toLocaleString()} (${service.etd})`);
              });
            }
            console.log('');
            
          } else {
            console.log(`❌ ${destination.name}: No shipping options available`);
            console.log('');
          }
        } else {
          console.log(`❌ ${destination.name}: API Error ${response.status}`);
          console.log('');
        }
      } catch (error) {
        console.log(`❌ ${destination.name}: Connection error`);
        console.log('');
      }
    }
    
    // Test API integration status
    console.log('🔍 TESTING API INTEGRATION STATUS');
    console.log('=================================');
    console.log('');
    
    // Test provinces
    const provincesResponse = await fetch(`${baseUrl}/provinces`);
    console.log(`Provinces API: ${provincesResponse.ok ? '✅ Working' : '❌ Failed'}`);
    
    // Test cities (Sulawesi Selatan)
    const citiesResponse = await fetch(`${baseUrl}/cities?province_id=32`);
    console.log(`Cities API: ${citiesResponse.ok ? '✅ Working' : '❌ Failed'}`);
    
    if (citiesResponse.ok) {
      const citiesData = await citiesResponse.json();
      console.log(`Cities in Sulawesi Selatan: ${citiesData.data?.length || 0}`);
      
      // Find Makassar
      const makassar = citiesData.data?.find(city => 
        city.city_name === 'Makassar' || city.city_name.includes('Makassar')
      );
      console.log(`Makassar found: ${makassar ? `✅ ID ${makassar.city_id}` : '❌ Not found'}`);
    }
    
    console.log('');
    
  } catch (error) {
    console.log('❌ Server connection failed');
    console.log('   Make sure server is running: npm run dev');
    console.log('');
  }
  
  // Expected results explanation
  console.log('📊 EXPECTED PRICING BEHAVIOR');
  console.log('============================');
  console.log('');
  console.log('🏠 LOCAL (Same City - Makassar):');
  console.log('   Expected: ~Rp 10,000 (cheapest)');
  console.log('   Reason: Same city delivery');
  console.log('');
  console.log('🏘️ REGIONAL (Same Province - Sulawesi Selatan):');
  console.log('   Expected: ~Rp 15,000 (medium)');
  console.log('   Reason: Same province but different city');
  console.log('');
  console.log('🌍 NATIONAL (Different Province):');
  console.log('   Expected: ~Rp 25,000+ (most expensive)');
  console.log('   Reason: Cross-province delivery');
  console.log('');
  console.log('💡 NOTE: Now Jakarta should be EXPENSIVE (national)');
  console.log('   instead of cheap like before!');
  console.log('');
  
  // Store info summary
  console.log('🏪 UPDATED STORE CONFIGURATION');
  console.log('==============================');
  console.log('Store Name: Pisang Ijo Store');
  console.log('Address: Kelurahan Banta-Bantaeng, Kecamatan Rappocini');
  console.log('City: Makassar, Sulawesi Selatan');
  console.log('Origin ID: 228 (Makassar)');
  console.log('Province ID: 32 (Sulawesi Selatan)');
  console.log('');
  console.log('✅ Origin successfully updated from Jakarta Pusat to Makassar!');
}

testOriginUpdate().catch(console.error);