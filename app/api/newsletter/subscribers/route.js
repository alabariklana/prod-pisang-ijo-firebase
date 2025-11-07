import { connectToDatabase } from '@/lib/mongodb';

// GET - Fetch all newsletter subscribers
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'all';

    const { db } = await connectToDatabase();
    
    const filter = status === 'all' ? {} : { status };
    
    const subscribers = await db.collection('newsletter')
      .find(filter)
      .sort({ subscribedAt: -1 })
      .toArray();

    const stats = {
      total: subscribers.length,
      active: subscribers.filter(s => s.status === 'active').length,
      unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length
    };

    return Response.json({
      success: true,
      subscribers: subscribers.map(s => ({ ...s, _id: s._id.toString() })),
      stats
    });

  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return Response.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

// DELETE - Remove subscriber
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const result = await db.collection('newsletter').deleteOne({ email });

    if (result.deletedCount === 0) {
      return Response.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: 'Subscriber removed successfully'
    });

  } catch (error) {
    console.error('Error removing subscriber:', error);
    return Response.json({ error: 'Failed to remove subscriber' }, { status: 500 });
  }
}
