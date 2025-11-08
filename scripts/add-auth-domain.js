#!/usr/bin/env node

/**
 * Add Authorized Domain to Firebase Authentication
 * This script provides the exact steps to add authorized domains
 */

console.log('🔐 Adding Authorized Domain to Firebase Authentication\n');

console.log('📋 Current Project: pisang-ijo-evi');
console.log('🌐 Domain to Add: prod-pisang-ijo-firebase--pisang-ijo-evi.asia-southeast1.hosted.app\n');

console.log('🛠 Manual Steps (Recommended):');
console.log('1. Open Firebase Console:');
console.log('   https://console.firebase.google.com/project/pisang-ijo-evi/authentication/settings');
console.log('');
console.log('2. Scroll down to "Authorized domains" section');
console.log('');
console.log('3. Click "Add domain" button');
console.log('');
console.log('4. Enter this exact domain:');
console.log('   prod-pisang-ijo-firebase--pisang-ijo-evi.asia-southeast1.hosted.app');
console.log('');
console.log('5. Click "Add"');
console.log('');
console.log('✅ After adding, your app authentication will work on production!');
console.log('');

console.log('📝 Expected Authorized Domains List:');
console.log('   ✓ localhost (for development)');
console.log('   ✓ pisang-ijo-evi.firebaseapp.com (Firebase default)');
console.log('   ✓ prod-pisang-ijo-firebase--pisang-ijo-evi.asia-southeast1.hosted.app (App Hosting)');
console.log('');

console.log('🚀 Test URLs:');
console.log('   Development: http://localhost:3000');
console.log('   Production:  https://prod-pisang-ijo-firebase--pisang-ijo-evi.asia-southeast1.hosted.app');