import { connectToDatabase } from '@/lib/mongodb';

// POST - Validate referral code
export async function POST(req) {
  try {
    const { referralCode } = await req.json();

    if (!referralCode) {
      return Response.json({ valid: false, error: 'Referral code is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    const member = await db.collection('members').findOne({ referralCode });

    if (!member) {
      return Response.json({ 
        valid: false, 
        message: 'Kode referral tidak valid' 
      });
    }

    return Response.json({
      valid: true,
      message: `Kode referral dari ${member.name || member.email} terverifikasi!`,
      referrerName: member.name || member.email.split('@')[0]
    });

  } catch (error) {
    console.error('Error validating referral:', error);
    return Response.json({ error: 'Failed to validate referral code' }, { status: 500 });
  }
}
