#!/usr/bin/env node

/**
 * Test GCS Connection Script
 * Tests connection to Google Cloud Storage bucket
 */

require('dotenv').config({ path: '.env.local' });
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
      console.error(`gcloud storage buckets add-iam-policy-binding gs://${bucketName} \\`);
      console.error(`  --member="serviceAccount:${credentials?.client_email}" \\`);
      console.error(`  --role="roles/storage.objectAdmin"`);
    }
    
    if (error.code === 404) {
      console.error('\n💡 Bucket Not Found (404):');
      console.error(`Create bucket: gcloud storage buckets create gs://${bucketName}`);
    }
  }
}

testGCS();

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