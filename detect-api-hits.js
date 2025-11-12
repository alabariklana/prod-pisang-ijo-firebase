// Test API Hit Detection - Monitoring RajaOngkir API Calls
const fetch = require('node-fetch');

async function detectAPIHits() {
  console.log('🕵️ DETECTING RAJAONGKIR API HITS');
  console.log('=================================');
  console.log('');
  console.log('Tujuan: Mengecek apakah API RajaOngkir eksternal benar-benar dipanggil');
  console.log('atau langsung menggunakan fallback system');
  console.log('');

  const baseUrl = 'http://localhost:3000';
  
  // Test 1: Monitor API calls saat load provinces
  console.log('1️⃣ TESTING PROVINCES API CALL');
  console.log('------------------------------');
  
  try {
    const start = Date.now();
    const response = await fetch(`${baseUrl}/api/shipping/provinces`);
    const end = Date.now();
    const duration = end - start;
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Response received in ${duration}ms`);
      console.log(`   Provinces loaded: ${data.data?.length || 0}`);
      
      // Analyze response time to detect if external API was called
      if (duration < 100) {
        console.log('⚡ VERY FAST - Likely using FALLBACK data (local)');
      } else if (duration < 500) {
        console.log('🚀 FAST - Might be cached or local fallback');
      } else {
        console.log('🐌 SLOW - Likely called external API (good!)');
      }
      
    } else {
      console.log(`❌ API Error: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }
  
  console.log('');
  
  // Test 2: Monitor cities API call
  console.log('2️⃣ TESTING CITIES API CALL (Sulawesi Selatan)');
  console.log('-----------------------------------------------');
  
  try {
    const start = Date.now();
    const response = await fetch(`${baseUrl}/api/shipping/cities?province_id=28`);
    const end = Date.now();
    const duration = end - start;
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Response received in ${duration}ms`);
      console.log(`   Cities loaded: ${data.data?.length || 0}`);
      
      if (duration < 100) {
        console.log('⚡ VERY FAST - Using FALLBACK data (tidak hit external API)');
      } else {
        console.log('🐌 SLOWER - Might have tried external API first');
      }
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('');
  
  // Test 3: Monitor cost calculation - This is the MAIN API that should hit RajaOngkir
  console.log('3️⃣ TESTING COST CALCULATION (Most Important)');
  console.log('----------------------------------------------');
  
  try {
    const start = Date.now();
    const response = await fetch(`${baseUrl}/api/shipping/cost?origin=268&destination=152&weight=1000&courier=jne`);
    const end = Date.now();
    const duration = end - start;
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Response received in ${duration}ms`);
      console.log(`   Services available: ${data.costs?.length || 0}`);
      
      if (data.costs && data.costs.length > 0) {
        const firstCost = data.costs[0];
        console.log(`   First service: ${firstCost.name || firstCost.code}`);
        
        // Check if this looks like real RajaOngkir data or fallback
        if (firstCost.costs && Array.isArray(firstCost.costs)) {
          const services = firstCost.costs;
          console.log(`   Available options: ${services.length}`);
          
          // Real RajaOngkir usually returns specific service names
          const serviceNames = services.map(s => s.service || s.name).join(', ');
          console.log(`   Service types: ${serviceNames}`);
          
          // Analyze service names to detect if it's real API or fallback
          const hasRealServices = serviceNames.includes('REG') || serviceNames.includes('YES') || serviceNames.includes('OKE');
          if (hasRealServices) {
            console.log('✅ LOOKS LIKE REAL RAJAONGKIR DATA - API Hit detected!');
          } else {
            console.log('⚠️  LOOKS LIKE FALLBACK DATA - No external API hit');
          }
        }
      }
      
      // Response time analysis
      if (duration < 200) {
        console.log('⚡ VERY FAST - Likely fallback calculation (NO API HIT)');
      } else if (duration > 1000) {
        console.log('🐌 SLOW - Probably tried external API (GOOD - API HIT!)');
      } else {
        console.log('🚀 MEDIUM - Could be cached or fast external API');
      }
      
    } else {
      console.log(`❌ Cost API Error: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('');
  console.log('📊 ANALISIS HASIL');
  console.log('=================');
  console.log('');
  console.log('🔍 INDIKASI NO API HIT (0 hits di RajaOngkir):');
  console.log('   - Response time sangat cepat (<100ms)');
  console.log('   - Service names generic (JNE, TIKI, POS)');
  console.log('   - Costs berupa range/estimasi bukan real rates');
  console.log('   - Fallback system langsung digunakan');
  console.log('');
  console.log('✅ INDIKASI API HIT BERHASIL:');
  console.log('   - Response time lebih lambat (>500ms)');  
  console.log('   - Service names spesifik (REG, YES, OKE, CTC)');
  console.log('   - Costs berupa tarif real dari courier');
  console.log('   - Error handling menunjukkan percobaan API eksternal');
  console.log('');
  console.log('💡 KEMUNGKINAN PENYEBAB 0 HITS:');
  console.log('1. API Key tidak valid/expired');
  console.log('2. Base URL RajaOngkir berubah');
  console.log('3. System langsung ke fallback tanpa coba API');
  console.log('4. Environment variable tidak terbaca');
  console.log('5. Firewall/network blocking API calls');
}

// Run the detection
detectAPIHits().catch(console.error);