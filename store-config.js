// Store Address Configuration
// Configure your store's location here for accurate shipping calculations

const STORE_CONFIG = {
  // Current store address - UPDATE THIS TO YOUR ACTUAL STORE LOCATION
  address: {
    name: "Pisang Ijo Store", // Your store name
    street: "Kelurahan Banta-Bantaeng, Kecamatan Rappocini", // Your street address
    city: "Makassar", // Your city
    province: "Sulawesi Selatan", // Your province  
    postalCode: "90221", // Postal code Rappocini, Makassar
    coordinates: {
      latitude: -5.1477, // Makassar latitude
      longitude: 119.4327 // Makassar longitude
    }
  },

  // RajaOngkir city configuration for shipping calculations
  // This determines the origin point for all shipping cost calculations
  shipping: {
    // Updated: Makassar (City ID: 268)
    originCityId: "268", // Makassar city ID (from fallback data)
    originCityName: "Makassar", // Your city
    originProvinceId: "28", // Sulawesi Selatan province ID 
    originProvinceName: "Sulawesi Selatan" // Your province
  },

  // Delivery zones and pricing (currently distance-based)
  zones: {
    local: {
      name: "Local Delivery (Same City)",
      basePrice: 10000,
      description: "Same city delivery"
    },
    regional: {
      name: "Regional Delivery (Same Province)", 
      basePrice: 15000,
      description: "Same province delivery"
    },
    national: {
      name: "National Delivery",
      basePrice: 25000,
      description: "Different province delivery"
    }
  },

  // Business hours for delivery estimation
  businessHours: {
    open: "08:00",
    close: "17:00", 
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  }
};

// Quick reference for major Indonesian cities
const MAJOR_CITIES_REFERENCE = {
  "Jakarta Pusat": { cityId: "152", provinceId: "6", province: "DKI Jakarta" },
  "Jakarta Selatan": { cityId: "154", provinceId: "6", province: "DKI Jakarta" },
  "Jakarta Timur": { cityId: "155", provinceId: "6", province: "DKI Jakarta" },
  "Jakarta Utara": { cityId: "153", provinceId: "6", province: "DKI Jakarta" },
  "Jakarta Barat": { cityId: "151", provinceId: "6", province: "DKI Jakarta" },
  "Surabaya": { cityId: "444", provinceId: "11", province: "Jawa Timur" },
  "Bandung": { cityId: "23", provinceId: "9", province: "Jawa Barat" },
  "Medan": { cityId: "249", provinceId: "21", province: "Sumatera Utara" },
  "Semarang": { cityId: "392", provinceId: "10", province: "Jawa Tengah" },
  "Makassar": { cityId: "228", provinceId: "32", province: "Sulawesi Selatan" },
  "Palembang": { cityId: "327", provinceId: "32", province: "Sumatera Selatan" },
  "Tangerang": { cityId: "455", provinceId: "9", province: "Banten" },
  "Depok": { cityId: "78", provinceId: "9", province: "Jawa Barat" },
  "Bekasi": { cityId: "25", provinceId: "9", province: "Jawa Barat" },
  "Yogyakarta": { cityId: "501", provinceId: "5", province: "DI Yogyakarta" }
};

// Helper function to update store location
function updateStoreLocation(cityName) {
  const cityInfo = MAJOR_CITIES_REFERENCE[cityName];
  if (cityInfo) {
    STORE_CONFIG.shipping.originCityId = cityInfo.cityId;
    STORE_CONFIG.shipping.originCityName = cityName;
    STORE_CONFIG.shipping.originProvinceId = cityInfo.provinceId;
    STORE_CONFIG.shipping.originProvinceName = cityInfo.province;
    
    console.log(`✅ Store location updated to: ${cityName}`);
    console.log(`   City ID: ${cityInfo.cityId}`);
    console.log(`   Province: ${cityInfo.province}`);
    return true;
  } else {
    console.log(`❌ City "${cityName}" not found in reference list`);
    console.log('Available cities:', Object.keys(MAJOR_CITIES_REFERENCE));
    return false;
  }
}

// Export configuration
module.exports = {
  STORE_CONFIG,
  MAJOR_CITIES_REFERENCE,
  updateStoreLocation
};

// Usage examples:
console.log('🏪 CURRENT STORE CONFIGURATION');
console.log('==============================');
console.log('Store Name:', STORE_CONFIG.address.name);
console.log('Address:', STORE_CONFIG.address.street);
console.log('City:', STORE_CONFIG.address.city);
console.log('Province:', STORE_CONFIG.address.province);
console.log('');
console.log('📦 SHIPPING ORIGIN:');
console.log('City ID:', STORE_CONFIG.shipping.originCityId);
console.log('City Name:', STORE_CONFIG.shipping.originCityName);
console.log('Province:', STORE_CONFIG.shipping.originProvinceName);
console.log('');
console.log('⚠️  IF YOUR STORE IS NOT IN JAKARTA PUSAT:');
console.log('   1. Update the address section with your real address');
console.log('   2. Update the shipping section with your city ID');
console.log('   3. Or use updateStoreLocation("Your City Name") function');
console.log('');
console.log('💡 Available major cities for quick setup:');
console.log(Object.keys(MAJOR_CITIES_REFERENCE).join(', '));