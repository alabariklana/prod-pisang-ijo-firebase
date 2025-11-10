// Test Integration API Shipping - Cek Origin dan API Status
const fetch = require('node-fetch');

async function checkAPIIntegration() {
  console.log('🔍 CEK INTEGRASI API SHIPPING SYSTEM');
  console.log('=====================================');
  console.log('');

  const baseUrl = 'http://localhost:3000/api/shipping';
  
  try {
    // Test 1: Provinces API
    console.log('1️⃣ TESTING PROVINCES API');
    console.log('-------------------------');
    const provincesResponse = await fetch(`${baseUrl}/provinces`);
    console.log(`Status: ${provincesResponse.status} ${provincesResponse.statusText}`);
    
    if (provincesResponse.ok) {
      const provincesData = await provincesResponse.json();
      console.log('✅ Provinces API Working');
      console.log(`   Total provinces: ${provincesData.data?.length || 0}`);
      
      if (provincesData.data?.length > 0) {
        console.log(`   First province: ${provincesData.data[0].province_id} - ${provincesData.data[0].province}`);
        console.log(`   Sample: Jakarta = ${provincesData.data.find(p => p.province.includes('Jakarta'))?.province_id || 'Not Found'}`);
      }
      console.log('');
      
      // Test 2: Cities API (Jakarta)
      console.log('2️⃣ TESTING CITIES API (Jakarta)');
      console.log('--------------------------------');
      const citiesResponse = await fetch(`${baseUrl}/cities?province_id=6`);
      console.log(`Status: ${citiesResponse.status} ${citiesResponse.statusText}`);
      
      if (citiesResponse.ok) {
        const citiesData = await citiesResponse.json();
        console.log('✅ Cities API Working');
        console.log(`   Total cities in Jakarta: ${citiesData.data?.length || 0}`);
        
        if (citiesData.data?.length > 0) {
          const jakartaPusat = citiesData.data.find(c => c.city_name === 'Jakarta Pusat');
          console.log(`   Jakarta Pusat: ID ${jakartaPusat?.city_id || 'Not Found'}`);
          console.log(`   First city: ${citiesData.data[0].city_id} - ${citiesData.data[0].city_name}`);
        }
        console.log('');
        
        // Test 3: Cost Calculation API
        console.log('3️⃣ TESTING COST CALCULATION API');
        console.log('--------------------------------');
        
        // Jakarta Pusat (152) ke Bandung (23)
        const costUrl = `${baseUrl}/cost?origin=152&destination=23&weight=1000&courier=jne`;
        console.log(`Testing: ${costUrl}`);
        
        const costResponse = await fetch(costUrl);
        console.log(`Status: ${costResponse.status} ${costResponse.statusText}`);
        
        if (costResponse.ok) {
          const costData = await costResponse.json();
          console.log('✅ Cost Calculation Working');
          
          if (costData.costs?.length > 0) {
            console.log(`   Available services: ${costData.costs.length}`);
            costData.costs.forEach(service => {
              console.log(`   - ${service.service}: Rp ${service.cost.toLocaleString()} (${service.etd})`);
            });
          }
          
          console.log('');
          
          // Test origin configuration
          console.log('4️⃣ CEK KONFIGURASI ORIGIN');
          console.log('-------------------------');
          
          // Test beberapa kombinasi origin-destination
          const testCases = [
            { origin: '152', destination: '153', desc: 'Jakarta Pusat → Jakarta Utara (Same Province)' },
            { origin: '152', destination: '23', desc: 'Jakarta Pusat → Bandung (Different Province)' },
            { origin: '152', destination: '444', desc: 'Jakarta Pusat → Surabaya (Different Province)' }
          ];
          
          for (const testCase of testCases) {
            const testUrl = `${baseUrl}/cost?origin=${testCase.origin}&destination=${testCase.destination}&weight=1000&courier=jne`;
            const testResponse = await fetch(testUrl);
            
            if (testResponse.ok) {
              const testData = await testResponse.json();
              const avgCost = testData.costs?.length > 0 ? 
                Math.round(testData.costs.reduce((sum, s) => sum + s.cost, 0) / testData.costs.length) : 0;
              
              console.log(`   ${testCase.desc}: Rp ${avgCost.toLocaleString()}`);
            }
          }
          
          console.log('');
          
        } else {
          const errorText = await costResponse.text();
          console.log('❌ Cost API Failed:', errorText);
        }
        
      } else {
        const errorText = await citiesResponse.text();
        console.log('❌ Cities API Failed:', errorText);
      }
      
    } else {
      const errorText = await provincesResponse.text();
      console.log('❌ Provinces API Failed:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Connection Error:', error.message);
    console.log('   Make sure server is running: npm run dev');
  }
  
  // Summary
  console.log('📋 RINGKASAN KONFIGURASI ORIGIN');
  console.log('===============================');
  console.log('Current Origin Configuration:');
  console.log('- DEFAULT_ORIGIN (rajaongkir.js): Jakarta Pusat (ID: 152)');
  console.log('- ShippingCalculator props: Jakarta Pusat (ID: 152)');
  console.log('- Page /pesan: Jakarta Pusat (ID: 152)');
  console.log('- Page /shipping: Jakarta Pusat (ID: 152)');
  console.log('');
  console.log('🏪 APAKAH TOKO ANDA DI JAKARTA PUSAT?');
  console.log('- Jika YA: Konfigurasi sudah benar');
  console.log('- Jika TIDAK: Perlu update origin di beberapa file');
  console.log('');
  console.log('📍 CARA UPDATE ORIGIN JIKA TOKO BUKAN DI JAKARTA:');
  console.log('1. Update DEFAULT_ORIGIN di lib/rajaongkir.js');
  console.log('2. Update origin prop di components/ShippingCalculator.js');
  console.log('3. Update origin di app/pesan/page.js');
  console.log('4. Update origin di app/shipping/page.js');
  console.log('5. Gunakan store-config.js untuk referensi kota');
}

// Run the test
checkAPIIntegration().catch(console.error);