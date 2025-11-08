#!/usr/bin/env node

/**
 * Google Cloud Storage Test Script
 * Tests GCS connection and upload permissions
 */

require('dotenv').config({ path: '.env.local' });

const { Storage } = require('@google-cloud/storage');

async function testGCS() {
  try {
    console.log('🔍 Testing Google Cloud Storage...\n');

    // Check environment variables
    const projectId = process.env.GCS_PROJECT_ID;
    const bucketName = process.env.GCS_BUCKET_NAME;
    const serviceAccountKey = process.env.GCS_SERVICE_ACCOUNT_KEY_BASE64;

    console.log('📋 Configuration:');
    console.log(`Project ID: ${projectId}`);
    console.log(`Bucket Name: ${bucketName}`);
    console.log(`Service Account Key: ${serviceAccountKey ? 'Present' : 'Missing'}\n`);

    if (!projectId || !bucketName || !serviceAccountKey) {
      console.error('❌ Missing required environment variables');
      console.error('Required: GCS_PROJECT_ID, GCS_BUCKET_NAME, GCS_SERVICE_ACCOUNT_KEY_BASE64');
      return;
    }

    // Decode service account key
    let credentials;
    try {
      credentials = JSON.parse(Buffer.from(serviceAccountKey, 'base64').toString());
      console.log('✅ Service account key decoded successfully');
      console.log(`Service Account: ${credentials.client_email}`);
    } catch (decodeError) {
      console.error('❌ Failed to decode service account key');
      console.error('Error:', decodeError.message);
      return;
    }

    // Initialize Storage
    const storage = new Storage({
      projectId,
      credentials
    });

    console.log('✅ Storage client initialized');

    // Test bucket access
    const bucket = storage.bucket(bucketName);
    const [exists] = await bucket.exists();

    if (!exists) {
      console.error('❌ Bucket does not exist or no access');
      console.error(`Bucket: gs://${bucketName}`);
      return;
    }

    console.log('✅ Bucket access verified');

    // Test upload permission
    const fileName = `test-${Date.now()}.txt`;
    const fileContent = 'Test upload content';
    
    const file = bucket.file(fileName);
    await file.save(fileContent, {
      metadata: {
        contentType: 'text/plain'
      }
    });
    
    console.log('✅ File upload permission confirmed');
    console.log(`File created: gs://${bucketName}/${fileName}`);

    // Test download permission
    const [downloadedContent] = await file.download();
    console.log('✅ File download permission confirmed');

    // Test list permission
    const [files] = await bucket.getFiles({ prefix: 'test-' });
    console.log(`✅ File list permission confirmed (found ${files.length} test files)`);

    // Clean up test file
    await file.delete();
    console.log('✅ File delete permission confirmed');

    console.log('\n🎉 All GCS permissions verified!');
    console.log('\n📝 Available Permissions:');
    console.log('  ✅ storage.objects.create (upload)');
    console.log('  ✅ storage.objects.get (download)');
    console.log('  ✅ storage.objects.list (browse)');
    console.log('  ✅ storage.objects.delete (cleanup)');

  } catch (error) {
    console.error('❌ GCS Test failed:');
    console.error('Error:', error.message);
    
    if (error.code === 403) {
      console.error('\n💡 Permission Denied (403):');
      console.error('Service account needs these roles:');
      console.error('- roles/storage.objectCreator (for uploads)');
      console.error('- roles/storage.objectAdmin (for full access)');
      console.error('\n🔧 Fix with:');
      console.error(`gcloud storage buckets add-iam-policy-binding gs://${process.env.GCS_BUCKET_NAME} \\`);
      console.error(`  --member="serviceAccount:upload-service@pisang-ijo-evi.iam.gserviceaccount.com" \\`);
      console.error(`  --role="roles/storage.objectAdmin"`);
    }
    
    if (error.code === 404) {
      console.error('\n💡 Bucket Not Found (404):');
      console.error(`Create bucket: gcloud storage buckets create gs://${process.env.GCS_BUCKET_NAME}`);
    }
  }
}

testGCS();