import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const { title, subtitle, type, background, imageUrl, isActive, order } = data;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid slide ID' },
        { status: 400 }
      );
    }

    const db = await connectDB();
    
    const updateData = {
      title,
      subtitle,
      type,
      background: type === 'color' ? background : null,
      imageUrl: type === 'image' ? imageUrl : null,
      isActive,
      order,
      updatedAt: new Date()
    };

    // Remove null values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === null || updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const result = await db.collection('hero-slides').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

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

    const db = await connectDB();
    
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