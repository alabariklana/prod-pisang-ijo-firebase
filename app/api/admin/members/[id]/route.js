import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch member detail
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    
    // Get member
    const member = await db.collection('members').findOne({ _id: new ObjectId(id) });
    
    if (!member) {
      return Response.json({ error: 'Member not found' }, { status: 404 });
    }

    // Get member's orders
    const orders = await db.collection('orders')
      .find({ customerEmail: member.email })
      .sort({ createdAt: -1 })
      .toArray();

    // Get member's addresses
    const addresses = await db.collection('addresses')
      .find({ memberEmail: member.email })
      .sort({ createdAt: -1 })
      .toArray();

    // Get member's vouchers
    const vouchers = await db.collection('vouchers')
      .find({ memberEmail: member.email })
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      success: true,
      member: { ...member, _id: member._id.toString() },
      orders: orders.map(o => ({ ...o, _id: o._id.toString() })),
      addresses: addresses.map(a => ({ ...a, _id: a._id.toString() })),
      vouchers: vouchers.map(v => ({ ...v, _id: v._id.toString() }))
    });

  } catch (error) {
    console.error('Error fetching member detail:', error);
    return Response.json({ error: 'Failed to fetch member detail' }, { status: 500 });
  }
}

// PATCH - Update member points
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const { points } = await req.json();

    if (typeof points !== 'number' || points < 0) {
      return Response.json({ error: 'Invalid points value' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Calculate new level
    let newLevel = 'Rookie';
    if (points >= 500) newLevel = 'Master';
    else if (points >= 300) newLevel = 'Platinum';
    else if (points >= 150) newLevel = 'Gold';
    else if (points >= 50) newLevel = 'Silver';

    // Update member
    const result = await db.collection('members').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          points,
          level: newLevel,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: 'Member not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: 'Points updated successfully',
      newLevel
    });

  } catch (error) {
    console.error('Error updating member:', error);
    return Response.json({ error: 'Failed to update member' }, { status: 500 });
  }
}
