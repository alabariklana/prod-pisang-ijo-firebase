import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const slides = await db.collection('hero-slides').find({}).sort({ order: 1 }).toArray();
    
    return NextResponse.json({ 
      success: true, 
      slides: slides.map(slide => ({
        ...slide,
        _id: slide._id.toString(),
        // Ensure background field has a value for color type slides
        background: slide.type === 'color' && !slide.background 
          ? 'linear-gradient(135deg, #214929 0%, #2a5f35 50%, #214929 100%)'
          : slide.background
      }))
    });
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch slides' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { title, subtitle, type, background, imageUrl, isActive = true } = data;

    // Validation
    if (!title || !subtitle || !type) {
      return NextResponse.json(
        { success: false, error: 'Title, subtitle, and type are required' },
        { status: 400 }
      );
    }

    if (type === 'image' && !imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required for image type slides' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Get next order number
    const lastSlide = await db.collection('hero-slides').findOne({}, { sort: { order: -1 } });
    const nextOrder = (lastSlide?.order || 0) + 1;

    const slideData = {
      title,
      subtitle,
      type,
      background: type === 'color' ? background : null,
      imageUrl: type === 'image' ? imageUrl : null,
      isActive,
      order: nextOrder,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('hero-slides').insertOne(slideData);
    
    return NextResponse.json({ 
      success: true, 
      slide: { ...slideData, _id: result.insertedId.toString() }
    });
  } catch (error) {
    console.error('Error creating hero slide:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create slide' },
      { status: 500 }
    );
  }
}