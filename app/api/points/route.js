import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { userId, purchaseAmount, action } = await req.json();
    
    if (!userId) {
      return Response.json({ 
        success: false,
        message: 'User ID required' 
      }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    // Get point settings
    const settings = await db.collection('settings').findOne({ type: 'points' });
    const pointSettings = settings || {
      pointsPerPurchase: 10,
      minimumPurchaseForPoints: 10000,
      pointsToRupiah: 100,
      minimumRedeemPoints: 500
    };
    
    if (action === 'calculate') {
      // Calculate points earned from purchase
      if (purchaseAmount < pointSettings.minimumPurchaseForPoints) {
        return Response.json({ 
          success: true,
          pointsEarned: 0,
          message: `Minimum pembelian Rp ${pointSettings.minimumPurchaseForPoints.toLocaleString('id-ID')} untuk mendapatkan poin`
        });
      }
      
      const pointsEarned = Math.floor(purchaseAmount / 1000) * pointSettings.pointsPerPurchase;
      
      return Response.json({ 
        success: true,
        pointsEarned,
        message: `Anda mendapatkan ${pointsEarned} poin dari pembelian ini!`
      });
    }
    
    if (action === 'add') {
      // Add points to user
      const pointsToAdd = Math.floor(purchaseAmount / 1000) * pointSettings.pointsPerPurchase;
      
      if (pointsToAdd <= 0) {
        return Response.json({ 
          success: false,
          message: 'Pembelian tidak memenuhi syarat untuk mendapatkan poin'
        }, { status: 400 });
      }
      
      await db.collection('members').updateOne(
        { userId },
        { 
          $inc: { points: pointsToAdd },
          $push: {
            pointHistory: {
              type: 'earned',
              points: pointsToAdd,
              description: `Pembelian Rp ${purchaseAmount.toLocaleString('id-ID')}`,
              date: new Date()
            }
          }
        },
        { upsert: true }
      );
      
      return Response.json({ 
        success: true,
        pointsAdded: pointsToAdd,
        message: `${pointsToAdd} poin telah ditambahkan!`
      });
    }
    
    if (action === 'redeem') {
      // Redeem points for discount
      const { pointsToRedeem } = await req.json();
      
      if (!pointsToRedeem || pointsToRedeem < pointSettings.minimumRedeemPoints) {
        return Response.json({ 
          success: false,
          message: `Minimum redeem ${pointSettings.minimumRedeemPoints} poin`
        }, { status: 400 });
      }
      
      const member = await db.collection('members').findOne({ userId });
      
      if (!member || member.points < pointsToRedeem) {
        return Response.json({ 
          success: false,
          message: 'Poin tidak mencukupi'
        }, { status: 400 });
      }
      
      const discountAmount = Math.floor(pointsToRedeem / pointSettings.pointsToRupiah * 1000);
      
      await db.collection('members').updateOne(
        { userId },
        { 
          $inc: { points: -pointsToRedeem },
          $push: {
            pointHistory: {
              type: 'redeemed',
              points: -pointsToRedeem,
              description: `Tukar poin - Diskon Rp ${discountAmount.toLocaleString('id-ID')}`,
              date: new Date()
            }
          }
        }
      );
      
      return Response.json({ 
        success: true,
        pointsRedeemed: pointsToRedeem,
        discountAmount,
        message: `${pointsToRedeem} poin ditukar menjadi diskon Rp ${discountAmount.toLocaleString('id-ID')}`
      });
    }
    
    return Response.json({ 
      success: false,
      message: 'Invalid action' 
    }, { status: 400 });
    
  } catch (error) {
    console.error('Error processing points:', error);
    return Response.json({ 
      success: false,
      message: 'Failed to process points' 
    }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return Response.json({ 
        success: false,
        message: 'User ID required' 
      }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    const member = await db.collection('members').findOne({ userId });
    const settings = await db.collection('settings').findOne({ type: 'points' });
    
    return Response.json({ 
      success: true,
      points: member?.points || 0,
      pointHistory: member?.pointHistory || [],
      settings: settings || {
        pointsPerPurchase: 10,
        minimumPurchaseForPoints: 10000,
        pointsToRupiah: 100,
        minimumRedeemPoints: 500
      }
    });
  } catch (error) {
    console.error('Error fetching points:', error);
    return Response.json({ 
      success: false,
      message: 'Failed to fetch points' 
    }, { status: 500 });
  }
}
