// RajaOngkir API Service - Updated to use Komerce API V2
// Documentation: https://komerceapi.readme.io/reference/rajaongkir-api
// New Base URL: https://api.collaborator.komerce.id (Production)

import { 
  FALLBACK_PROVINCES, 
  FALLBACK_CITIES, 
  FALLBACK_SHIPPING_RATES, 
  calculateDistanceMultiplier 
} from './shippingFallback.js';

// Updated API Configuration for Komerce RajaOngkir V2
const KOMERCE_BASE_URL = 'https://api.collaborator.komerce.id';
const KOMERCE_SANDBOX_URL = 'https://api-sandbox.collaborator.komerce.id';

// API Keys - Need to get new keys from https://collaborator.komerce.id/profile?tab=api-key
export const RAJAONGKIR_CONFIG = {
  SHIPPING_COST_API_KEY: process.env.RAJAONGKIR_SHIPPING_KEY || 'ZkEZxeyR9d14ecc39dc26b266EVRZapb',
  DELIVERY_TRACKING_API_KEY: process.env.RAJAONGKIR_DELIVERY_KEY || '5zfBlgro9d14ecc39dc26b26yImiKeQg',
  BASE_URL: KOMERCE_BASE_URL,
  SANDBOX_URL: KOMERCE_SANDBOX_URL,
  USE_SANDBOX: false, // Set to true for testing
  USE_FALLBACK: false, // Try new API first, fallback if needed
  
  // New API endpoints for RajaOngkir V2
  ENDPOINTS: {
    PROVINCES: '/api/v1/destination/province',
    CITIES: '/api/v1/destination/city',
    DISTRICTS: '/api/v1/destination/district', 
    SUBDISTRICTS: '/api/v1/destination/subdistrict',
    COST_CALCULATION: '/api/v1/cost',
    TRACKING: '/api/v1/waybill'
  }
};

// Common headers for API requests  
export const getHeaders = (apiKey) => ({
  'key': apiKey
});

// Get all provinces using new Komerce API V2
export async function getProvinces() {
  console.log('=== FETCHING PROVINCES (Komerce API V2) ===');
  
  // Use fallback data if explicitly configured
  if (RAJAONGKIR_CONFIG.USE_FALLBACK) {
    console.log('Using fallback provinces data (configured)');
    return {
      success: true,
      provinces: FALLBACK_PROVINCES
    };
  }
  
  const baseUrl = RAJAONGKIR_CONFIG.USE_SANDBOX ? RAJAONGKIR_CONFIG.SANDBOX_URL : RAJAONGKIR_CONFIG.BASE_URL;
  const url = `${baseUrl}${RAJAONGKIR_CONFIG.ENDPOINTS.PROVINCES}`;
  
  console.log('API Key:', RAJAONGKIR_CONFIG.SHIPPING_COST_API_KEY);
  console.log('Base URL:', url);
  
  try {
    const headers = getHeaders(RAJAONGKIR_CONFIG.SHIPPING_COST_API_KEY);
    
    console.log('Request URL:', url);
    console.log('Request headers:', headers);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      // Handle different error codes
      if (response.status === 401) {
        console.log('❌ Unauthorized (401) - Invalid API key, switching to fallback');
      } else if (response.status === 410) {
        console.log('❌ API deprecated (410), switching to fallback data');
      } else {
        console.log(`❌ HTTP Error ${response.status}, switching to fallback`);
      }
      
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('Response error text:', errorText);
      
      // Switch to fallback on any error
      RAJAONGKIR_CONFIG.USE_FALLBACK = true;
      return {
        success: true,
        provinces: FALLBACK_PROVINCES
      };
    }

    const data = await response.json();
    console.log('✅ New API Response data:', data);
    
    // Handle new API response format
    if (data && data.data && Array.isArray(data.data)) {
      const provinces = data.data.map(province => ({
        province_id: province.id || province.province_id,
        province: province.name || province.province
      }));
      
      console.log('✅ Successfully fetched', provinces.length, 'provinces from new API');
      return {
        success: true,
        provinces: provinces
      };
    } else {
      console.log('❌ Unexpected response format, using fallback');
      RAJAONGKIR_CONFIG.USE_FALLBACK = true;
      return {
        success: true,
        provinces: FALLBACK_PROVINCES
      };
    }
  } catch (error) {
    console.error('❌ Error fetching provinces from new API, using fallback:', error.message);
    
    // Use fallback data on any error
    RAJAONGKIR_CONFIG.USE_FALLBACK = true;
    return {
      success: true,
      provinces: FALLBACK_PROVINCES
    };
  }
}

// Get cities by province ID using new Komerce API V2
export async function getCities(provinceId) {
  console.log('=== FETCHING CITIES (Komerce API V2) ===');
  console.log('Province ID:', provinceId);
  
  // Use fallback data if explicitly configured
  if (RAJAONGKIR_CONFIG.USE_FALLBACK) {
    console.log('Using fallback cities data for province:', provinceId);
    const cities = FALLBACK_CITIES[provinceId] || [];
    return {
      success: true,
      cities: cities
    };
  }
  
  const baseUrl = RAJAONGKIR_CONFIG.USE_SANDBOX ? RAJAONGKIR_CONFIG.SANDBOX_URL : RAJAONGKIR_CONFIG.BASE_URL;
  const url = `${baseUrl}${RAJAONGKIR_CONFIG.ENDPOINTS.CITIES}?province_id=${provinceId}`;
  
  try {
    const headers = getHeaders(RAJAONGKIR_CONFIG.SHIPPING_COST_API_KEY);
    
    console.log('Request URL:', url);
    console.log('Request headers:', headers);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      // Handle different error codes
      if (response.status === 401) {
        console.log('❌ Unauthorized (401) - Invalid API key, switching to fallback');
      } else if (response.status === 410) {
        console.log('❌ Cities API deprecated (410), switching to fallback data');
      } else {
        console.log(`❌ HTTP Error ${response.status}, switching to fallback`);
      }
      
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('Response error text:', errorText);
      
      // Switch to fallback on any error
      RAJAONGKIR_CONFIG.USE_FALLBACK = true;
      const cities = FALLBACK_CITIES[provinceId] || [];
      return {
        success: true,
        cities: cities
      };
    }

    const data = await response.json();
    console.log('✅ Cities API Response data:', data);
    
    // Handle new API response format
    if (data && data.data && Array.isArray(data.data)) {
      const cities = data.data.map(city => ({
        city_id: city.id || city.city_id,
        city_name: city.name || city.city_name,
        type: city.type || 'Kota',
        postal_code: city.postal_code || ''
      }));
      
      console.log('✅ Successfully fetched', cities.length, 'cities from new API');
      return {
        success: true,
        cities: cities
      };
    } else {
      console.log('❌ Unexpected cities response format, using fallback');
      RAJAONGKIR_CONFIG.USE_FALLBACK = true;
      const cities = FALLBACK_CITIES[provinceId] || [];
      return {
        success: true,
        cities: cities
      };
    }
  } catch (error) {
    console.error('❌ Error fetching cities from new API, using fallback:', error.message);
    
    // Use fallback data on any error
    RAJAONGKIR_CONFIG.USE_FALLBACK = true;
    const cities = FALLBACK_CITIES[provinceId] || [];
    return {
      success: true,
      cities: cities
    };
  }
}

// Calculate shipping cost
export async function calculateShippingCost({
  origin,
  destination, 
  weight,
  courier = 'jne' // jne, pos, tiki
}) {
  console.log('=== CALCULATING SHIPPING COST ===');
  console.log('Params:', { origin, destination, weight, courier });
  
  // Use fallback calculation if API is deprecated or unavailable
  if (RAJAONGKIR_CONFIG.USE_FALLBACK) {
    console.log('Using fallback shipping cost calculation');
    return calculateFallbackShippingCost(origin, destination, weight, courier);
  }
  
  try {
    const formData = new URLSearchParams({
      origin: origin,
      destination: destination,
      weight: weight,
      courier: courier
    });

    const headers = {
      ...getHeaders(RAJAONGKIR_CONFIG.SHIPPING_COST_API_KEY),
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    console.log('Request headers:', headers);
    console.log('Form data:', formData.toString());

    const response = await fetch(`${RAJAONGKIR_CONFIG.BASE_URL}/cost`, {
      method: 'POST',
      headers: headers,
      body: formData
    });

    console.log('Shipping cost response status:', response.status);

    if (!response.ok) {
      // If API returns 410 (deprecated), switch to fallback
      if (response.status === 410) {
        console.log('Shipping cost API deprecated (410), switching to fallback');
        RAJAONGKIR_CONFIG.USE_FALLBACK = true;
        return calculateFallbackShippingCost(origin, destination, weight, courier);
      }
      
      const errorText = await response.text();
      console.error('Shipping cost error text:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Shipping cost response data:', data);
    
    if (data.rajaongkir && data.rajaongkir.status && data.rajaongkir.status.code === 200) {
      return {
        success: true,
        costs: data.rajaongkir.results
      };
    } else {
      const errorMsg = data.rajaongkir?.status?.description || 'Unknown error';
      console.error('Shipping cost API Error:', errorMsg);
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error('Error calculating shipping cost, using fallback:', error);
    
    // Use fallback calculation on any error
    return calculateFallbackShippingCost(origin, destination, weight, courier);
  }
}

// Fallback shipping cost calculation
function calculateFallbackShippingCost(origin, destination, weight, courier) {
  console.log('Calculating fallback shipping cost');
  
  const courierData = FALLBACK_SHIPPING_RATES[courier.toLowerCase()];
  if (!courierData) {
    return {
      success: false,
      error: `Courier ${courier} not supported`
    };
  }
  
  // Calculate distance multiplier
  const distanceMultiplier = calculateDistanceMultiplier(origin, destination);
  console.log('Distance multiplier:', distanceMultiplier);
  
  // Convert weight to kg (minimum 1kg)
  const weightKg = Math.max(1, Math.ceil(weight / 1000));
  console.log('Weight in kg:', weightKg);
  
  // Calculate costs for each service
  const services = courierData.services.map(service => {
    const baseCost = service.baseRate * weightKg * distanceMultiplier;
    return {
      service: service.service,
      description: service.description,
      cost: [{
        value: Math.round(baseCost),
        etd: service.etd,
        note: 'Estimasi (fallback calculation)'
      }]
    };
  });
  
  const result = [{
    code: courier.toLowerCase(),
    name: courierData.name,
    costs: services
  }];
  
  console.log('Fallback calculation result:', result);
  
  return {
    success: true,
    costs: result
  };
}

// Track delivery/waybill
export async function trackDelivery(waybill, courier) {
  console.log('=== TRACKING DELIVERY ===');
  console.log('Waybill:', waybill, 'Courier:', courier);
  
  try {
    const formData = new URLSearchParams({
      waybill: waybill,
      courier: courier
    });

    const headers = {
      ...getHeaders(RAJAONGKIR_CONFIG.DELIVERY_TRACKING_API_KEY),
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    console.log('Tracking headers:', headers);

    const response = await fetch(`${RAJAONGKIR_CONFIG.BASE_URL}/waybill`, {
      method: 'POST',
      headers: headers,
      body: formData
    });

    console.log('Tracking response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Tracking error text:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Tracking response data:', data);
    
    if (data.rajaongkir && data.rajaongkir.status && data.rajaongkir.status.code === 200) {
      return {
        success: true,
        tracking: data.rajaongkir.result
      };
    } else {
      const errorMsg = data.rajaongkir?.status?.description || 'Unknown error';
      console.error('Tracking API Error:', errorMsg);
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error('Error tracking delivery:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Helper function to format shipping services
export function formatShippingServices(costs) {
  if (!costs || !costs.length) return [];
  
  return costs.map(courierData => ({
    courier: courierData.code.toUpperCase(),
    courierName: courierData.name,
    services: courierData.costs.map(service => ({
      service: service.service,
      description: service.description,
      cost: service.cost[0].value,
      etd: service.cost[0].etd,
      note: service.cost[0].note || ''
    }))
  }));
}

// Helper function to get default shipping origin (your store location)
export const DEFAULT_ORIGIN = {
  // Store location: Makassar, Sulawesi Selatan
  // Kelurahan Banta-Bantaeng, Kecamatan Rappocini, Kota Makassar
  cityId: '268', // Makassar city ID (from fallback data)
  cityName: 'Makassar',
  provinceId: '28',
  provinceName: 'Sulawesi Selatan'
};

export default {
  getProvinces,
  getCities,
  calculateShippingCost,
  trackDelivery,
  formatShippingServices,
  DEFAULT_ORIGIN,
  RAJAONGKIR_CONFIG
};