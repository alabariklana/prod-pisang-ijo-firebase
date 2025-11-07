import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { path } = params;
    const bucketName = process.env.GCS_BUCKET_NAME || 'pisang-ijo-assets';
    
    // Reconstruct the full path from the segments
    const fullPath = Array.isArray(path) ? path.join('/') : path;
    
    // Build the GCS URL
    const gcsUrl = `https://storage.googleapis.com/${bucketName}/${fullPath}`;
    
    // Fetch the image from GCS
    const response = await fetch(gcsUrl);
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    
    // Get the image data and content type
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'Access-Control-Allow-Origin': '*',
      },
    });
    
  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}