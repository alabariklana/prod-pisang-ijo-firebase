// Force External API Test - Memaksa sistem untuk hit API RajaOngkir eksternal
const fetch = require('node-fetch');

async function forceExternalAPITest() {
  console.log('🔥 FORCING EXTERNAL RAJAONGKIR API TEST');
  console.log('=====================================');
  console.log('');
  
  // API Keys from env
  const API_KEY = 'ZkEZxeyR9d14ecc39dc26b266EVRZapb';
  console.log('API Key:', API_KEY);
  console.log('');
  
  // Test all possible API endpoints that might work
  const testEndpoints = [
    // Old RajaOngkir (should be 410)
    {
      name: 'Old RajaOngkir Cost API',
      url: 'https://api.rajaongkir.com/starter/cost',
      method: 'POST',
      headers: { 'key': API_KEY, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'origin=268&destination=152&weight=1000&courier=jne'
    },
    
    // New Komerce API attempts
    {
      name: 'Komerce Cost API V1',
      url: 'https://api.collaborator.komerce.id/api/v1/cost',
      method: 'POST', 
      headers: { 'key': API_KEY, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'origin=268&destination=152&weight=1000&courier=jne'
    },
    
    {
      name: 'Komerce Cost API V2',
      url: 'https://api.collaborator.komerce.id/cost',
      method: 'POST',
      headers: { 'key': API_KEY, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'origin=268&destination=152&weight=1000&courier=jne'
    },
    
    // Test provinces to verify key
    {
      name: 'Komerce Provinces Check',
      url: 'https://api.collaborator.komerce.id/api/v1/destination/province',
      method: 'GET',
      headers: { 'key': API_KEY }
    }
  ];
  
  console.log('🧪 TESTING EXTERNAL API ENDPOINTS');
  console.log('==================================');
  
  for (const test of testEndpoints) {
    console.log(`\\n${test.name}:`);
    console.log(`URL: ${test.url}`);
    
    try {
      const options = {
        method: test.method,
        headers: test.headers
      };
      
      if (test.body) {
        options.body = test.body;
        console.log(`Body: ${test.body}`);
      }
      
      const response = await fetch(test.url, options);
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (response.status === 410) {
        console.log('❌ API DEPRECATED - This explains 0 hits!');
        const errorText = await response.text();
        console.log('Message:', errorText.substring(0, 200) + '...');
      } else if (response.status === 404) {
        console.log('❌ ENDPOINT NOT FOUND - Wrong URL');
      } else if (response.status === 401) {
        console.log('❌ UNAUTHORIZED - Invalid API Key');
      } else if (response.ok) {
        console.log('✅ SUCCESS! API Key works!');
        const data = await response.text();
        console.log('Response preview:', data.substring(0, 300) + '...');
      } else {
        console.log('❓ OTHER ERROR');
        const errorText = await response.text();
        console.log('Error:', errorText.substring(0, 200));
      }
      
    } catch (error) {
      console.log('❌ NETWORK ERROR:', error.message);
    }
  }
  
  console.log('\\n\\n📊 ANALISIS PENYEBAB 0 HITS');
  console.log('============================');
  console.log('');
  
  console.log('🔍 KEMUNGKINAN PENYEBAB:');
  console.log('');
  console.log('1. ❌ API DEPRECATED (HTTP 410)');
  console.log('   - RajaOngkir lama sudah tidak aktif');
  console.log('   - Sistem otomatis switch ke fallback');
  console.log('   - No hits karena API tidak pernah berhasil');
  console.log('');
  
  console.log('2. ❌ WRONG ENDPOINT (HTTP 404)');
  console.log('   - URL API berubah atau salah');
  console.log('   - Endpoint baru belum ditemukan');
  console.log('   - Langsung fallback tanpa hit');
  console.log('');
  
  console.log('3. ❌ INVALID API KEY (HTTP 401)'); 
  console.log('   - API key expired atau wrong');
  console.log('   - Need new key dari collaborator.komerce.id');
  console.log('   - Sistem fallback karena auth failed');
  console.log('');
  
  console.log('4. ✅ FALLBACK BY DESIGN');
  console.log('   - System memang didesain untuk fallback');
  console.log('   - Reliable tanpa external dependency');
  console.log('   - 0 hits adalah normal behavior');
  console.log('');
  
  console.log('💡 REKOMENDASI:');
  console.log('===============');
  console.log('');
  console.log('Jika tujuannya mendapatkan API hits:');
  console.log('1. Buat account baru di collaborator.komerce.id');
  console.log('2. Generate API key baru');
  console.log('3. Update .env.local dengan key baru');
  console.log('4. Test dengan endpoint yang benar');
  console.log('');
  console.log('Jika sistem current sudah memuaskan:');
  console.log('1. Tetap gunakan fallback system');
  console.log('2. Reliable dan cepat untuk users');
  console.log('3. Tidak perlu khawatir API downtime');
  console.log('4. 0 hits bukan masalah teknis');
}

// Run the test
forceExternalAPITest().catch(console.error);