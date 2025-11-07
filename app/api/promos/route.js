import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    const promos = await db.collection('promos')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return Response.json({ 
      success: true,
      promos 
    });
  } catch (error) {
    console.error('Error fetching promos:', error);
    return Response.json({ 
      success: false,
      message: 'Failed to fetch promos' 
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { db } = await connectToDatabase();
    
    // Validate promo code
    const existingPromo = await db.collection('promos').findOne({ 
      code: body.code.toUpperCase() 
    });
    
    if (existingPromo) {
      return Response.json({ 
        success: false,
        message: 'Kode promo sudah digunakan' 
      }, { status: 400 });
    }
    
    const promo = {
      code: body.code.toUpperCase(),
      description: body.description,
      discountType: body.discountType, // 'percentage' or 'fixed'
      discountValue: parseInt(body.discountValue),
      minimumPurchase: parseInt(body.minimumPurchase) || 0,
      maxDiscount: body.discountType === 'percentage' ? parseInt(body.maxDiscount) || 0 : 0,
      validFrom: body.validFrom ? new Date(body.validFrom) : null,
      validUntil: body.validUntil ? new Date(body.validUntil) : null,
      maxUsage: parseInt(body.maxUsage) || 0,
      usageCount: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('promos').insertOne(promo);
    promo._id = result.insertedId;
    
    return Response.json({ 
      success: true,
      message: 'Promo berhasil ditambahkan',
      promo 
    });
  } catch (error) {
    console.error('Error adding promo:', error);
    return Response.json({ 
      success: false,
      message: 'Failed to add promo' 
    }, { status: 500 });
  }
}
