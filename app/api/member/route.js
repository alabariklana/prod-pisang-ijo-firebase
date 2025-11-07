import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch member data
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    // Get or create member
    let member = await db.collection('members').findOne({ email });
    
    if (!member) {
      // Create new member with default values
      const newMember = {
        email,
        points: 0,
        level: 'Rookie',
        totalOrders: 0,
        referralCode: generateReferralCode(email),
        referredBy: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.collection('members').insertOne(newMember);
      member = newMember;
    }

    // Get member's orders
    const orders = await db.collection('orders')
      .find({ customerEmail: email })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    // Get member's vouchers
    const vouchers = await db.collection('vouchers')
      .find({ 
        memberEmail: email,
        validUntil: { $gte: new Date() }
      })
      .toArray();

    // Calculate level based on points
    const level = calculateLevel(member.points);

    return Response.json({
      success: true,
      member: {
        ...member,
        level,
        _id: member._id.toString()
      },
      orders: orders.map(o => ({ ...o, _id: o._id.toString() })),
      vouchers: vouchers.map(v => ({ ...v, _id: v._id.toString() }))
    });

  } catch (error) {
    console.error('Error fetching member data:', error);
    return Response.json({ error: 'Failed to fetch member data' }, { status: 500 });
  }
}

// POST - Update member points or create new member
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, name, action, referralCode } = body;

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Check if member exists
    let member = await db.collection('members').findOne({ email });

    if (!member && action === 'signup') {
      // Create new member with signup bonus
      const newMember = {
        email,
        name: name || email.split('@')[0],
        points: 30, // Signup bonus
        level: 'Rookie',
        totalOrders: 0,
        referralCode: generateReferralCode(email),
        referredBy: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Check if they used a referral code
      if (referralCode) {
        const referrer = await db.collection('members').findOne({ referralCode });
        if (referrer) {
          // Give referrer 30 points
          await db.collection('members').updateOne(
            { _id: referrer._id },
            { 
              $inc: { points: 30 },
              $set: { updatedAt: new Date() }
            }
          );

          // Create notification for referrer
          await db.collection('notifications').insertOne({
            memberEmail: referrer.email,
            type: 'referral_bonus',
            message: `Selamat! Kamu mendapat 30 poin dari referral ${email}`,
            read: false,
            createdAt: new Date()
          });

          newMember.referredBy = referrer.email;
        }
      }

      const result = await db.collection('members').insertOne(newMember);
      
      // Create welcome voucher
      await db.collection('vouchers').insertOne({
        code: `WELCOME${Date.now()}`,
        memberEmail: email,
        discount: '10%',
        discountType: 'percentage',
        discountValue: 10,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        used: false,
        createdAt: new Date()
      });

      return Response.json({
        success: true,
        message: 'Member created with 30 signup points!',
        member: { ...newMember, _id: result.insertedId.toString() }
      });
    }

    return Response.json({
      success: true,
      member: member ? { ...member, _id: member._id.toString() } : null
    });

  } catch (error) {
    console.error('Error creating/updating member:', error);
    return Response.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

// Helper function to generate unique referral code
function generateReferralCode(email) {
  const prefix = email.substring(0, 3).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}${random}${timestamp}`;
}

// Helper function to calculate level based on points
function calculateLevel(points) {
  if (points >= 500) return 'Master';
  if (points >= 300) return 'Platinum';
  if (points >= 150) return 'Gold';
  if (points >= 50) return 'Silver';
  return 'Rookie';
}
