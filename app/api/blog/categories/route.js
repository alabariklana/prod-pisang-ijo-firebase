import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// GET - Get all unique categories
export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const categories = await db.collection('blog_posts')
      .distinct('category');

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
