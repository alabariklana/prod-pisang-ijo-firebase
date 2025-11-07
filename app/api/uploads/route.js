import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import fs from 'fs/promises';
import path from 'path';

// Decode service account key from base64 if provided
let credentials;
if (process.env.GCS_SERVICE_ACCOUNT_KEY_BASE64) {
  try {
    console.log('🔑 Decoding GCS credentials...');
    const decoded = Buffer.from(process.env.GCS_SERVICE_ACCOUNT_KEY_BASE64, 'base64').toString('utf-8');
    credentials = JSON.parse(decoded);
    console.log('✅ GCS credentials decoded successfully');
    console.log('- Project ID from credentials:', credentials.project_id);
    console.log('- Client email:', credentials.client_email);
  } catch (err) {
    console.error('❌ Failed to decode GCS credentials:', err);
  }
} else {
  console.log('⚠️ No GCS_SERVICE_ACCOUNT_KEY_BASE64 found');
}

// Initialize Google Cloud Storage client (only used if USE_GCS is true)
const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID || 'pisang-ijo-403206',
  ...(credentials && { credentials }),
  // Fallback to default credentials if no explicit credentials provided
  ...(!credentials && { keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS })
});

const bucketName = process.env.GCS_BUCKET_NAME || 'pisang-ijo-assets';
const USE_GCS = String(process.env.USE_GCS || '').toLowerCase() === 'true';

export async function POST(request) {
  try {
    console.log('🔄 Upload request received');
    console.log('Environment check:');
    console.log('- USE_GCS:', process.env.USE_GCS);
    console.log('- GCS_BUCKET_NAME:', process.env.GCS_BUCKET_NAME);
    console.log('- GCS_PROJECT_ID:', process.env.GCS_PROJECT_ID);
    console.log('- Has credentials:', !!credentials);
    
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('📁 File info:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Get file buffer
    const buf = Buffer.from(await file.arrayBuffer());
    const originalName = file.name || 'upload';
    const ext = path.extname(originalName) || '.jpg';
    const safeExt = ext && ext.length <= 6 ? ext : '.jpg';
    const baseName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${safeExt}`;

    // If USE_GCS=true, try uploading to Google Cloud Storage
    if (USE_GCS) {
      console.log('🚀 Attempting GCS upload...');
      console.log('- Bucket:', bucketName);
      
      // Determine folder based on request context or type
      const uploadType = formData.get('type') || 'products'; // Default to products for backwards compatibility
      const filename = `${uploadType}/${baseName}`;
      
      console.log('- Filename:', filename);
      const bucket = storage.bucket(bucketName);
      const blob = bucket.file(filename);

      try {
        console.log('📤 Uploading to GCS...');
        await blob.save(buf, {
          metadata: {
            contentType: file.type || 'image/jpeg',
            cacheControl: 'public, max-age=31536000',
          },
        });
        console.log('✅ GCS upload successful!');

        // Determine URL: public URL or signed URL if bucket isn't public
        let imageUrl;
        if (String(process.env.GCS_PUBLIC_READ).toLowerCase() === 'true') {
          imageUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
          console.log('🌐 Using public URL:', imageUrl);
        } else {
          const expires = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
          const [signedUrl] = await blob.getSignedUrl({ action: 'read', version: 'v4', expires });
          imageUrl = signedUrl;
          console.log('🔒 Using signed URL');
        }

        console.log('✅ Upload complete, returning success response');
        return NextResponse.json({ success: true, url: imageUrl, imageUrl, filename });
      } catch (gcsErr) {
        console.error('❌ GCS upload failed:', gcsErr);
        console.error('Error details:', {
          name: gcsErr.name,
          message: gcsErr.message,
          code: gcsErr.code,
          status: gcsErr.status
        });
        
        // If GCS upload fails and local fallback is allowed, continue to local save; otherwise throw
        if (String(process.env.ALLOW_LOCAL_FALLBACK).toLowerCase() !== 'true') {
          throw gcsErr;
        }
        // else fall through to local save below
        console.warn('🔄 GCS upload failed, falling back to local save');
      }
    } else {
      console.log('📁 USE_GCS is false, using local storage');
    }

    // Local filesystem fallback (default when USE_GCS !== true)
    console.log('📁 Using local filesystem storage');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const localFilename = baseName;
    const dest = path.join(uploadDir, localFilename);
    await fs.writeFile(dest, buf);
    const imageUrl = `/uploads/${localFilename}`;
    
    console.log('✅ Local upload successful:', imageUrl);
    return NextResponse.json({ 
      success: true, 
      url: imageUrl, 
      imageUrl, 
      filename: localFilename 
    });
  } catch (err) {
    console.error('❌ Upload error:', err);
    return NextResponse.json({ 
      error: 'Upload failed', 
      detail: err?.message 
    }, { status: 500 });
  }
}