import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request, { params }) {
  console.log('=== PUT REQUEST RECEIVED ===');
  console.log('Request URL:', request.url);
  console.log('Request method:', request.method);

  try {
    // Next.js 16: params is now a Promise, must await it
    const resolvedParams = await params;
    console.log('Resolved params:', resolvedParams);
    
    let id = resolvedParams?.id;
    console.log('ID from resolved params:', id);
    
    // Fallback: extract ID from URL if params.id is missing
    if (!id) {
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/').filter(part => part.length > 0);
      id = pathParts[pathParts.length - 1];
      console.log('Fallback: extracted ID from URL path:', id);
    }
    
    console.log('Final ID to use:', id);
    
    if (!id) {
      console.log('❌ No ID found');
      return NextResponse.json({ error: 'Invalid slide ID format' }, { status: 400 });
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      console.log('❌ Invalid ObjectId format:', id);
      return NextResponse.json({ error: 'Invalid slide ID format' }, { status: 400 });
    }

    const data = await request.json();
    console.log('Received data for update:', data);
    
    const { title, subtitle, type, background, imageUrl, isActive, order } = data;

    // Validate required fields
    if (!title || !type) {
      return NextResponse.json({ error: 'Title and type are required' }, { status: 400 });
    }

    // Connect to database
    const { db } = await connectToDatabase();
    console.log('Connected to database');

    // Prepare update data
    const updateData = {
      title,
      subtitle,
      type,
      background,
      imageUrl,
      isActive: Boolean(isActive),
      order: Number(order) || 0,
      updatedAt: new Date()
    };

    console.log('Updating slide with data:', updateData);

    // Update the slide
    const result = await db.collection('hero-slides').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    console.log('Update result:', result);

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    // Fetch updated slide
    const updatedSlide = await db.collection('hero-slides').findOne({ _id: new ObjectId(id) });
    console.log('Updated slide:', updatedSlide);

    return NextResponse.json({
      message: 'Slide updated successfully',
      slide: updatedSlide
    });

  } catch (error) {
    console.error('Error updating slide:', error);
    return NextResponse.json({ error: 'Failed to update slide' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  console.log('=== DELETE REQUEST RECEIVED ===');
  console.log('Request URL:', request.url);

  try {
    // Next.js 16: params is now a Promise, must await it
    const resolvedParams = await params;
    console.log('Resolved params:', resolvedParams);
    
    let id = resolvedParams?.id;
    console.log('ID from resolved params:', id);
    
    // Fallback: extract ID from URL if params.id is missing
    if (!id) {
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/').filter(part => part.length > 0);
      id = pathParts[pathParts.length - 1];
      console.log('Fallback: extracted ID from URL path:', id);
    }
    
    console.log('Final ID to use:', id);
    
    if (!id) {
      console.log('❌ No ID found');
      return NextResponse.json({ error: 'Invalid slide ID format' }, { status: 400 });
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      console.log('❌ Invalid ObjectId format:', id);
      return NextResponse.json({ error: 'Invalid slide ID format' }, { status: 400 });
    }

    // Connect to database
    const { db } = await connectToDatabase();
    console.log('Connected to database');

    // Delete the slide
    const result = await db.collection('hero-slides').deleteOne({ _id: new ObjectId(id) });
    console.log('Delete result:', result);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Slide deleted successfully' });

  } catch (error) {
    console.error('Error deleting slide:', error);
    return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
  }
}