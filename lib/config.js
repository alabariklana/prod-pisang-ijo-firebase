/**
 * @fileoverview Centralized configuration management for the entire application
 * Manages environment variables, business settings, API configurations, and validation
 * @author Pisang Ijo Evi
 * @version 1.0.0
 * 
 * @example
 * import { databaseConfig, businessSettings, apiConfig } from '@/lib/config';
 * 
 * // Use database configuration
 * console.log(databaseConfig.connectionString);
 * 
 * // Access business settings
 * console.log(businessSettings.defaultTax);
 * 
 * // Get API endpoints
 * console.log(apiConfig.rajaongkir.baseURL);
 */

/**
 * Validate required environment variables
 * @param {Array<string>} requiredVars - Array of required environment variable names
 * @throws {Error} If any required variables are missing
 */
function validateEnvironmentVariables(requiredVars) {
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

/**
 * Get environment variable with default value
 * @param {string} name - Environment variable name
 * @param {string} defaultValue - Default value if not set
 * @returns {string} Environment variable value
 */
function getEnvVar(name, defaultValue = '') {
  return process.env[name] || defaultValue;
}

/**
 * Get boolean environment variable
 * @param {string} name - Environment variable name
 * @param {boolean} defaultValue - Default value
 * @returns {boolean} Boolean value
 */
function getBooleanEnvVar(name, defaultValue = false) {
  const value = process.env[name];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Get numeric environment variable
 * @param {string} name - Environment variable name
 * @param {number} defaultValue - Default value
 * @returns {number} Numeric value
 */
function getNumericEnvVar(name, defaultValue = 0) {
  const value = process.env[name];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Application configuration
export const config = {
  // Environment
  env: getEnvVar('NODE_ENV', 'development'),
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Application
  app: {
    name: 'Pisang Ijo Evi',
    url: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
    baseUrl: getEnvVar('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000')
  },

  // Database
  database: {
    url: getEnvVar('MONGO_URL'),
    name: getEnvVar('DB_NAME', 'pisangijo'),
    options: {
      serverSelectionTimeoutMS: getNumericEnvVar('DB_SERVER_SELECTION_TIMEOUT', 10000),
      connectTimeoutMS: getNumericEnvVar('DB_CONNECT_TIMEOUT', 10000),
      maxPoolSize: getNumericEnvVar('DB_MAX_POOL_SIZE', 10),
      minPoolSize: getNumericEnvVar('DB_MIN_POOL_SIZE', 2)
    }
  },

  // Firebase
  firebase: {
    apiKey: getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY'),
    authDomain: getEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
    storageBucket: getEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID'),
    measurementId: getEnvVar('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID')
  },

  // Google Cloud Storage
  gcs: {
    projectId: getEnvVar('GCS_PROJECT_ID'),
    bucketName: getEnvVar('GCS_BUCKET_NAME'),
    serviceAccountKey: getEnvVar('GCS_SERVICE_ACCOUNT_KEY_BASE64'),
    useGcs: getBooleanEnvVar('USE_GCS', true),
    publicRead: getBooleanEnvVar('GCS_PUBLIC_READ', true),
    allowLocalFallback: getBooleanEnvVar('ALLOW_LOCAL_FALLBACK', true)
  },

  // Payment Gateway (Xendit)
  xendit: {
    secretKey: getEnvVar('XENDIT_SECRET_KEY'),
    publicKey: getEnvVar('XENDIT_PUBLIC_KEY'),
    webhookToken: getEnvVar('XENDIT_WEBHOOK_TOKEN'),
    baseUrl: 'https://api.xendit.co'
  },

  // Shipping (RajaOngkir)
  rajaongkir: {
    shippingKey: getEnvVar('RAJAONGKIR_SHIPPING_KEY'),
    deliveryKey: getEnvVar('RAJAONGKIR_DELIVERY_KEY'),
    baseUrl: 'https://api.rajaongkir.com'
  },

  // Email (Brevo)
  email: {
    apiKey: getEnvVar('BREVO_API_KEY'),
    senderEmail: getEnvVar('BREVO_SENDER_EMAIL'),
    senderName: getEnvVar('BREVO_SENDER_NAME', 'Pisang Ijo Evi')
  },

  // Social Media
  social: {
    facebookAppId: getEnvVar('NEXT_PUBLIC_FACEBOOK_APP_ID')
  },

  // Maps
  maps: {
    googleApiKey: getEnvVar('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY')
  },

  // Business settings
  business: {
    defaultOrigin: '268', // Makassar
    defaultCurrency: 'IDR',
    defaultTimezone: 'Asia/Makassar',
    lowStockThreshold: 5,
    maxCartItems: 50,
    orderExpirationHours: 24
  },

  // API settings
  api: {
    rateLimit: {
      windowMs: getNumericEnvVar('RATE_LIMIT_WINDOW_MS', 900000), // 15 minutes
      max: getNumericEnvVar('RATE_LIMIT_MAX', 100) // limit each IP to 100 requests per windowMs
    },
    pagination: {
      defaultLimit: 10,
      maxLimit: 100
    }
  }
};

// Validate critical environment variables in production
if (config.isProduction) {
  const requiredVars = [
    'MONGO_URL',
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
  ];
  
  validateEnvironmentVariables(requiredVars);
}

// Export utility functions
export { validateEnvironmentVariables, getEnvVar, getBooleanEnvVar, getNumericEnvVar };

// Export default configuration
export default config;