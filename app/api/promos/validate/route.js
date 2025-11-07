import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { code, totalAmount } = await req.json();
    
    if (!code || !totalAmount) {
      return Response.json({ 
        success: false,
        message: 'Kode promo dan total pembelian harus diisi' 
      }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    // Find promo
    const promo = await db.collection('promos').findOne({ 
      code: code.toUpperCase(),
      isActive: true
    });
    
    if (!promo) {
      return Response.json({ 
        success: false,
        message: 'Kode promo tidak valid' 
      }, { status: 404 });
    }
    
    // Check validity date
    const now = new Date();
    if (promo.validFrom && now < new Date(promo.validFrom)) {
      return Response.json({ 
        success: false,
        message: 'Kode promo belum dapat digunakan' 
      }, { status: 400 });
    }
    
    if (promo.validUntil && now > new Date(promo.validUntil)) {
      return Response.json({ 
        success: false,
        message: 'Kode promo sudah kadaluarsa' 
      }, { status: 400 });
    }
    
    // Check minimum purchase
    if (totalAmount < promo.minimumPurchase) {
      return Response.json({ 
        success: false,
        message: `Minimum pembelian Rp ${promo.minimumPurchase.toLocaleString('id-ID')}` 
      }, { status: 400 });
    }
    
    // Check max usage
    if (promo.maxUsage && promo.usageCount >= promo.maxUsage) {
      return Response.json({ 
        success: false,
        message: 'Kode promo sudah mencapai batas penggunaan' 
      }, { status: 400 });
    }
    
    // Calculate discount
    let discountAmount = 0;
    if (promo.discountType === 'percentage') {
      discountAmount = Math.floor(totalAmount * promo.discountValue / 100);
      if (promo.maxDiscount && discountAmount > promo.maxDiscount) {
        discountAmount = promo.maxDiscount;
      }
    } else {
      discountAmount = promo.discountValue;
    }
    
    // Ensure discount doesn't exceed total
    if (discountAmount > totalAmount) {
      discountAmount = totalAmount;
    }
    
    return Response.json({ 
      success: true,
      promo: {
        code: promo.code,
        description: promo.description,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        discountAmount,
        finalAmount: totalAmount - discountAmount
      }
    });
  } catch (error) {
    console.error('Error validating promo:', error);
    return Response.json({ 
      success: false,
      message: 'Gagal memvalidasi kode promo' 
    }, { status: 500 });
  }
}
