import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    console.log('Received data for update:', data);
    console.log('Slide ID:', id);
    
    const { title, subtitle, type, background, imageUrl, isActive, order } = data;

    if (!ObjectId.isValid(id)) {
      console.log('Invalid ObjectId:', id);
      return NextResponse.json(
        { success: false, error: 'Invalid slide ID' },
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
      { _id: new ObjectId(id) },
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

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid slide ID' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const result = await db.collection('hero-slides').deleteOne({
      _id: new ObjectId(id)
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