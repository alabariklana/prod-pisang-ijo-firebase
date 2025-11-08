#!/usr/bin/env node

/**
 * Firebase Authentication Test Script
 * Tests Firebase configuration and authentication setup
 */

require('dotenv').config({ path: '.env.local' });

const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

console.log('🔍 Testing Firebase Authentication Configuration...\n');

console.log('📋 Firebase Configuration:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  const isConfigured = value && value !== 'your-firebase-api-key-here' && value !== 'your-project-id';
  
  console.log(`${isConfigured ? '✅' : '❌'} ${varName}: ${isConfigured ? '✓ Configured' : '✗ Missing or placeholder'}`);
});

console.log('\n🔐 Expected Firebase Auth Domain:');
console.log(`✅ Auth Domain: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`);

console.log('\n📝 Next Steps:');
console.log('1. Go to Firebase Console: https://console.firebase.google.com/project/pisang-ijo-evi/authentication');
console.log('2. Enable Authentication → Sign-in method → Google');
console.log('3. Add authorized domains:');
console.log('   - localhost (for development)');
console.log('   - pisang-ijo-evi.firebaseapp.com');
console.log('   - prod-pisang-ijo-firebase--pisang-ijo-evi.asia-southeast1.hosted.app');
console.log('4. Set project support email in Google provider settings');

console.log('\n🚀 Production URL where this will work:');
console.log('   https://prod-pisang-ijo-firebase--pisang-ijo-evi.asia-southeast1.hosted.app');