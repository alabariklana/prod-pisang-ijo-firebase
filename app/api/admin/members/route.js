import { connectToDatabase } from '@/lib/mongodb';

// GET - Fetch all members (admin only)
export async function GET(req) {
  try {
    const { db } = await connectToDatabase();
    
    const members = await db.collection('members')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Get order counts for each member
    const membersWithStats = await Promise.all(
      members.map(async (member) => {
        const orderCount = await db.collection('orders').countDocuments({
          customerEmail: member.email
        });

        return {
          ...member,
          _id: member._id.toString(),
          totalOrders: orderCount
        };
      })
    );

    return Response.json({
      success: true,
      members: membersWithStats
    });

  } catch (error) {
    console.error('Error fetching members:', error);
    return Response.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}
