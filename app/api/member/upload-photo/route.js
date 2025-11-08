import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

// Decode service account key from base64 if provided
let credentials;
if (process.env.GCS_SERVICE_ACCOUNT_KEY_BASE64) {
  try {
    const decoded = Buffer.from(process.env.GCS_SERVICE_ACCOUNT_KEY_BASE64, 'base64').toString('utf-8');
    credentials = JSON.parse(decoded);
  } catch (err) {
    console.error('Failed to decode GCS credentials:', err);
  }
}

// Initialize Google Cloud Storage client
const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID || 'pisang-ijo-403206',
  ...(credentials && { credentials }),
});

const bucketName = process.env.GCS_BUCKET_NAME || 'pisang-ijo-assets';
const USE_GCS = String(process.env.USE_GCS || '').toLowerCase() === 'true';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const email = formData.get('email');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' 
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const sanitizedEmail = email.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const ext = path.extname(file.name);
    const filename = `profile_${sanitizedEmail}_${timestamp}${ext}`;

    let photoURL;

    // If USE_GCS=true, upload to Google Cloud Storage
    if (USE_GCS) {
      const gcpFilename = `profiles/${filename}`;
      const bucket = storage.bucket(bucketName);
      const blob = bucket.file(gcpFilename);

      try {
        await blob.save(buffer, {
          metadata: {
            contentType: file.type || 'image/jpeg',
            cacheControl: 'public, max-age=31536000',
          },
        });

        // Determine URL: public URL or signed URL if bucket isn't public
        if (String(process.env.GCS_PUBLIC_READ).toLowerCase() === 'true') {
          photoURL = `https://storage.googleapis.com/${bucketName}/${gcpFilename}`;
        } else {
          const expires = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
          const [signedUrl] = await blob.getSignedUrl({ action: 'read', version: 'v4', expires });
          photoURL = signedUrl;
        }
      } catch (gcsErr) {
        // If GCS upload fails and local fallback is allowed, continue to local save
        if (String(process.env.ALLOW_LOCAL_FALLBACK).toLowerCase() !== 'true') {
          throw gcsErr;
        }
        console.warn('GCS upload failed, falling back to local save:', gcsErr?.message);
        
        // Local filesystem fallback
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');
        if (!existsSync(uploadDir)) {
          await mkdir(uploadDir, { recursive: true });
        }
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
        photoURL = `/uploads/profiles/${filename}`;
      }
    } else {
      // Local filesystem (default when USE_GCS !== true)
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      photoURL = `/uploads/profiles/${filename}`;
    }

    // Update member profile in database
    const { connectToDatabase } = require('@/lib/mongodb');
    const { db } = await connectToDatabase();

    await db.collection('members').updateOne(
      { email },
      { 
        $set: { 
          photoURL,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Profile photo uploaded successfully',
      photoURL
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload file' 
    }, { status: 500 });
  }
}

// Note: bodyParser config is not needed in App Router
// File uploads are handled directly in the route handler
