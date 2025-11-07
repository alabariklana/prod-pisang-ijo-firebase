import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// GET - Get single blog post by slug
export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    const { db } = await connectToDatabase();

    const post = await db.collection('blog_posts').findOne({ slug });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Increment view count (only for published posts)
    if (post.status === 'published') {
      await db.collection('blog_posts').updateOne(
        { slug },
        { $inc: { views: 1 } }
      );
      post.views = (post.views || 0) + 1;
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PATCH - Update blog post
export async function PATCH(req, { params }) {
  try {
    const { slug } = await params;
    const data = await req.json();
    const { db } = await connectToDatabase();

    // Check if post exists
    const existingPost = await db.collection('blog_posts').findOne({ slug });
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // If slug is being changed, check if new slug is available
    let newSlug = slug;
    if (data.slug && data.slug !== slug) {
      const slugExists = await db.collection('blog_posts').findOne({ slug: data.slug });
      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        );
      }
      newSlug = data.slug;
    }

    const updateData = {
      ...(data.title && { title: data.title }),
      ...(data.slug && { slug: data.slug }),
      ...(data.content && { content: data.content }),
      ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
      ...(data.featuredImage !== undefined && { featuredImage: data.featuredImage }),
      ...(data.category && { category: data.category }),
      ...(data.tags && { tags: data.tags }),
      ...(data.author && { author: data.author }),
      updatedAt: new Date()
    };

    // Handle status change to published
    if (data.status && data.status !== existingPost.status) {
      updateData.status = data.status;
      if (data.status === 'published' && !existingPost.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    // Update SEO fields
    if (data.seo) {
      updateData.seo = {
        ...existingPost.seo,
        ...data.seo
      };
    }

    const result = await db.collection('blog_posts').updateOne(
      { slug },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'No changes made' },
        { status: 400 }
      );
    }

    const updatedPost = await db.collection('blog_posts').findOne({ slug: newSlug });

    return NextResponse.json({
      success: true,
      post: updatedPost
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog post
export async function DELETE(req, { params }) {
  try {
    const { slug } = await params;
    const { db } = await connectToDatabase();

    const result = await db.collection('blog_posts').deleteOne({ slug });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
