import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    console.log('Received data for update:', data);
    console.log('Slide ID:', id, 'Type:', typeof id, 'Length:', id?.length);
    
    const { title, subtitle, type, background, imageUrl, isActive, order } = data;

    // More robust ObjectId validation
    if (!id || typeof id !== 'string' || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
      console.log('Invalid ObjectId format:', id);
      return NextResponse.json(
        { success: false, error: `Invalid slide ID format: ${id}` },
        { status: 400 }
      );
    }

    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      console.log('Error creating ObjectId:', error);
      return NextResponse.json(
        { success: false, error: `Cannot create ObjectId from: ${id}` },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Validate required fields
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

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Slide not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating hero slide:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update slide' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // More robust ObjectId validation
    if (!id || typeof id !== 'string' || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { success: false, error: `Invalid slide ID format: ${id}` },
        { status: 400 }
      );
    }

    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: `Cannot create ObjectId from: ${id}` },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const result = await db.collection('hero-slides').deleteOne({
      _id: objectId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Slide not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete slide' },
      { status: 500 }
    );
  }
}