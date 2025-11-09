import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request) {
  console.log('=== UPDATE ROUTE RECEIVED ===');
  
  try {
    const data = await request.json();
    console.log('Received data:', data);
    
    const { id, title, subtitle, type, background, imageUrl, isActive, order } = data;
    
    console.log('Extracted ID from body:', id);
    
    if (!id) {
      console.log('❌ ID is missing from request body');
      return NextResponse.json(
        { success: false, error: 'Slide ID is required in request body' },
        { status: 400 }
      );
    }

    // Validate ObjectId
    let objectId;
    try {
      objectId = new ObjectId(id);
      console.log('✅ Successfully created ObjectId:', objectId.toString());
    } catch (error) {
      console.log('❌ ObjectId creation failed:', error.message);
      return NextResponse.json(
        { success: false, error: `Invalid ObjectId: ${error.message}` },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    console.log('Database connection established');
    
    // Validate required fields
    console.log('Validating fields:', { 
      title: !!title, 
      subtitle: !!subtitle, 
      type: !!type,
      titleValue: title,
      subtitleValue: subtitle,
      typeValue: type
    });
    
    if (!title || !subtitle || !type) {
      console.log('Missing required fields:', { title, subtitle, type });
      return NextResponse.json(
        { success: false, error: 'Title, subtitle, and type are required' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      type,
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date()
    };

    // Add background or imageUrl based on type
    if (type === 'color') {
      updateData.background = background || 'linear-gradient(135deg, #214929 0%, #2a5f35 50%, #214929 100%)';
      console.log('Setting background for color type:', updateData.background);
      // Remove imageUrl if switching to color
      updateData.$unset = { imageUrl: "" };
    } else if (type === 'image') {
      if (!imageUrl) {
        return NextResponse.json(
          { success: false, error: 'Image URL is required for image type' },
          { status: 400 }
        );
      }
      updateData.imageUrl = imageUrl;
      console.log('Setting imageUrl for image type:', updateData.imageUrl);
      // Remove background if switching to image
      updateData.$unset = { background: "" };
    }

    // Add order if provided
    if (order !== undefined) {
      updateData.order = parseInt(order) || 0;
    }

    console.log('Update data prepared:', updateData);

    // Prepare MongoDB update operation
    const updateOperation = { $set: updateData };
    if (updateData.$unset) {
      updateOperation.$unset = updateData.$unset;
      delete updateData.$unset;
    }

    const result = await db.collection('hero-slides').updateOne(
      { _id: objectId },
      updateOperation
    );

    console.log('MongoDB update result:', result);
    console.log('Matched count:', result.matchedCount);
    console.log('Modified count:', result.modifiedCount);

    if (result.matchedCount === 0) {
      console.log('No document found with ID:', objectId);
      return NextResponse.json(
        { success: false, error: 'Slide not found' },
        { status: 404 }
      );
    }

    if (result.modifiedCount === 0) {
      console.log('Document found but not modified (no changes)');
    }

    console.log('Update successful, returning success response');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('=== CAUGHT ERROR IN UPDATE HANDLER ===');
    console.error('Error updating hero slide:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { success: false, error: `Server error: ${error.message}` },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}