import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    const settings = await db.collection('settings').findOne({ type: 'points' });
    
    return Response.json({ 
      success: true,
      settings: settings || {
        type: 'points',
        pointsPerPurchase: 10,
        minimumPurchaseForPoints: 10000,
        pointsToRupiah: 100,
        minimumRedeemPoints: 500
      }
    });
  } catch (error) {
    console.error('Error fetching point settings:', error);
    return Response.json({ 
      success: false,
      message: 'Failed to fetch settings' 
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { db } = await connectToDatabase();
    
    const settings = {
      type: 'points',
      pointsPerPurchase: parseInt(body.pointsPerPurchase) || 10,
      minimumPurchaseForPoints: parseInt(body.minimumPurchaseForPoints) || 10000,
      pointsToRupiah: parseInt(body.pointsToRupiah) || 100,
      minimumRedeemPoints: parseInt(body.minimumRedeemPoints) || 500,
      updatedAt: new Date()
    };
    
    await db.collection('settings').updateOne(
      { type: 'points' },
      { $set: settings },
      { upsert: true }
    );
    
    return Response.json({ 
      success: true,
      message: 'Settings saved successfully',
      settings 
    });
  } catch (error) {
    console.error('Error saving point settings:', error);
    return Response.json({ 
      success: false,
      message: 'Failed to save settings' 
    }, { status: 500 });
  }
}
