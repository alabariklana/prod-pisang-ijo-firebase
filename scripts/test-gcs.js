#!/usr/bin/env node

/**
 * Test GCS Connection Script
 * Tests connection to Google Cloud Storage bucket
 */

require('dotenv').config({ path: '.env.local' });
const { Storage } = require('@google-cloud/storage');

async function testGcsConnection() {
  console.log('🧪 Testing GCS Connection...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('- GCS_PROJECT_ID:', process.env.GCS_PROJECT_ID);
  console.log('- GCS_BUCKET_NAME:', process.env.GCS_BUCKET_NAME);
  console.log('- USE_GCS:', process.env.USE_GCS);
  console.log('- Has Service Account Key:', !!process.env.GCS_SERVICE_ACCOUNT_KEY_BASE64);

  if (!process.env.GCS_SERVICE_ACCOUNT_KEY_BASE64) {
    console.log('❌ GCS_SERVICE_ACCOUNT_KEY_BASE64 not found');
    console.log('Please add your service account key to .env.local');
    return;
  }

  try {
    // Decode credentials
    console.log('\n🔑 Decoding credentials...');
    const decoded = Buffer.from(process.env.GCS_SERVICE_ACCOUNT_KEY_BASE64, 'base64').toString('utf-8');
    const credentials = JSON.parse(decoded);
    console.log('✅ Credentials decoded successfully');
    console.log('- Project ID:', credentials.project_id);
    console.log('- Client Email:', credentials.client_email);

    // Initialize storage
    console.log('\n🔌 Initializing Storage client...');
    const storage = new Storage({
      projectId: process.env.GCS_PROJECT_ID,
      credentials: credentials,
    });

    // Test bucket access
    console.log('\n🪣 Testing bucket access...');
    const bucketName = process.env.GCS_BUCKET_NAME;
    const bucket = storage.bucket(bucketName);
    
    // Check if bucket exists and we have access
    const [exists] = await bucket.exists();
    
    if (exists) {
      console.log('✅ Bucket exists and accessible');
      
      // Try to list some files (limit to 5)
      console.log('\n📁 Listing files in bucket (first 5):');
      const [files] = await bucket.getFiles({ maxResults: 5 });
      
      if (files.length === 0) {
        console.log('- Bucket is empty');
      } else {
        files.forEach(file => {
          console.log('- ' + file.name);
        });
      }
      
      // Test upload permissions by creating a test file
      console.log('\n📤 Testing upload permissions...');
      const testFile = bucket.file('test-connection.txt');
      const testContent = `GCS connection test - ${new Date().toISOString()}`;
      
      try {
        await testFile.save(testContent, {
          metadata: {
            contentType: 'text/plain',
          },
        });
        console.log('✅ Upload test successful');
        
        // Clean up test file
        await testFile.delete();
        console.log('✅ Test file cleaned up');
        
      } catch (uploadErr) {
        console.log('❌ Upload test failed:', uploadErr.message);
      }
      
    } else {
      console.log('❌ Bucket does not exist or not accessible');
      console.log('Please check:');
      console.log('1. Bucket name is correct');
      console.log('2. Service account has access to the bucket');
      console.log('3. Storage API is enabled in your project');
    }
    
  } catch (error) {
    console.error('❌ Error testing GCS connection:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('Network issue - check internet connection');
    } else if (error.message.includes('credentials')) {
      console.log('Credential issue - check service account key');
    } else if (error.message.includes('permission') || error.message.includes('access')) {
      console.log('Permission issue - check service account roles');
    }
  }
}

testGcsConnection();