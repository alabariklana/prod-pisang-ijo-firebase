#!/usr/bin/env node

/**
 * Development Environment Checker
 * Checks if all required environment variables are configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Development Environment...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  console.log('📋 Creating .env.local from template...\n');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env.local created');
    console.log('⚠️  Please edit .env.local with your actual configuration');
  } else {
    console.log('❌ .env.example template not found');
  }
  return;
}

// Load environment variables
require('dotenv').config({ path: envPath });

const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

const optionalVars = [
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  'NEXT_PUBLIC_FACEBOOK_APP_ID',
  'MONGO_URL',
  'BREVO_API_KEY',
  'GCS_SERVICE_ACCOUNT_KEY_BASE64'
];

const gcpVars = [
  'GCS_PROJECT_ID',
  'GCS_BUCKET_NAME', 
  'USE_GCS',
  'GCS_PUBLIC_READ',
  'ALLOW_LOCAL_FALLBACK'
];

console.log('📋 Required Environment Variables:');
let allRequired = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const isConfigured = value && value !== 'your-firebase-api-key-here' && value !== 'your-project-id';
  
  console.log(`${isConfigured ? '✅' : '❌'} ${varName}: ${isConfigured ? '✓ Configured' : '✗ Missing or placeholder'}`);
  
  if (!isConfigured) {
    allRequired = false;
  }
});

console.log('\n📋 Optional Environment Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  const isConfigured = value && !value.includes('your-') && !value.includes('api-key');
  
  console.log(`${isConfigured ? '✅' : '⚠️ '} ${varName}: ${isConfigured ? '✓ Configured' : '- Not configured'}`);
});

console.log('\n📋 Google Cloud Platform Variables:');
gcpVars.forEach(varName => {
  const value = process.env[varName];
  const isConfigured = value && value !== '' && !value.includes('your-');
  
  console.log(`${isConfigured ? '✅' : '⚠️ '} ${varName}: ${isConfigured ? '✓ Configured' : '- Not configured'}`);
});

console.log('\n' + '='.repeat(50));

if (allRequired) {
  console.log('🎉 Environment setup complete!');
  console.log('🚀 You can now run: npm run dev');
} else {
  console.log('⚠️  Environment setup incomplete');
  console.log('📖 Please check DEV_SETUP.md for configuration instructions');
  console.log('📝 Edit .env.local with your actual Firebase configuration');
}

console.log('='.repeat(50));