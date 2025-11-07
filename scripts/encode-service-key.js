#!/usr/bin/env node

/**
 * Service Account Key Encoder
 * Helps encode GCP service account JSON key to base64
 */

const fs = require('fs');
const path = require('path');

console.log('🔑 GCP Service Account Key Encoder\n');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage:');
  console.log('  node scripts/encode-service-key.js <path-to-service-account.json>');
  console.log('');
  console.log('Example:');
  console.log('  node scripts/encode-service-key.js ./service-account.json');
  console.log('');
  console.log('This will:');
  console.log('1. Read your service account JSON file');
  console.log('2. Encode it to base64');
  console.log('3. Show you the encoded string to add to .env.local');
  process.exit(1);
}

const keyPath = args[0];

try {
  // Check if file exists
  if (!fs.existsSync(keyPath)) {
    console.log('❌ File not found:', keyPath);
    console.log('');
    console.log('Please provide the correct path to your service account JSON file.');
    process.exit(1);
  }

  // Read the JSON file
  console.log('📖 Reading service account file:', keyPath);
  const jsonContent = fs.readFileSync(keyPath, 'utf8');
  
  // Validate JSON
  let parsedJson;
  try {
    parsedJson = JSON.parse(jsonContent);
  } catch (parseErr) {
    console.log('❌ Invalid JSON file:', parseErr.message);
    process.exit(1);
  }

  // Check if it looks like a service account key
  const requiredFields = ['type', 'project_id', 'private_key_id', 'private_key', 'client_email'];
  const missingFields = requiredFields.filter(field => !parsedJson[field]);
  
  if (missingFields.length > 0) {
    console.log('❌ This doesn\'t look like a service account key file.');
    console.log('Missing fields:', missingFields.join(', '));
    console.log('');
    console.log('Make sure you downloaded the correct JSON key from Google Cloud Console.');
    process.exit(1);
  }

  console.log('✅ Valid service account key detected');
  console.log('- Type:', parsedJson.type);
  console.log('- Project ID:', parsedJson.project_id);
  console.log('- Client Email:', parsedJson.client_email);

  // Encode to base64
  console.log('\n🔄 Encoding to base64...');
  const base64Encoded = Buffer.from(jsonContent).toString('base64');
  
  console.log('✅ Encoding complete!');
  console.log('');
  console.log('📋 Add this to your .env.local file:');
  console.log('');
  console.log('GCS_SERVICE_ACCOUNT_KEY_BASE64=' + base64Encoded);
  console.log('');
  console.log('⚠️  Important: Keep this key secure and never commit it to git!');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}