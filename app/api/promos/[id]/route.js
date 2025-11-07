import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { db } = await connectToDatabase();
    
    const updateData = {
      code: body.code.toUpperCase(),
      description: body.description,
      discountType: body.discountType,
      discountValue: parseInt(body.discountValue),
      minimumPurchase: parseInt(body.minimumPurchase) || 0,
      maxDiscount: body.discountType === 'percentage' ? parseInt(body.maxDiscount) || 0 : 0,
      validFrom: body.validFrom ? new Date(body.validFrom) : null,
      validUntil: body.validUntil ? new Date(body.validUntil) : null,
      maxUsage: parseInt(body.maxUsage) || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
      updatedAt: new Date()
    };
    
    const result = await db.collection('promos').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return Response.json({ 
        success: false,
        message: 'Promo not found' 
      }, { status: 404 });
    }
    
    return Response.json({ 
      success: true,
      message: 'Promo berhasil diupdate',
      promo: result
    });
  } catch (error) {
    console.error('Error updating promo:', error);
    return Response.json({ 
      success: false,
      message: 'Failed to update promo' 
    }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    
    const result = await db.collection('promos').deleteOne({ 
      _id: new ObjectId(id) 
    });
    
    if (result.deletedCount === 0) {
      return Response.json({ 
        success: false,
        message: 'Promo not found' 
      }, { status: 404 });
    }
    
    return Response.json({ 
      success: true,
      message: 'Promo berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting promo:', error);
    return Response.json({ 
      success: false,
      message: 'Failed to delete promo' 
    }, { status: 500 });
  }
}

// Validate promo code
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    
    // If id is a promo code (not ObjectId), validate it
    let promo;
    if (ObjectId.isValid(id)) {
      promo = await db.collection('promos').findOne({ _id: new ObjectId(id) });
    } else {
      promo = await db.collection('promos').findOne({ code: id.toUpperCase() });
    }
    
    if (!promo) {
      return Response.json({ 
        success: false,
        message: 'Promo tidak ditemukan' 
      }, { status: 404 });
    }
    
    // Check if promo is valid
    const now = new Date();
    const isValid = promo.isActive &&
      (!promo.validFrom || now >= new Date(promo.validFrom)) &&
      (!promo.validUntil || now <= new Date(promo.validUntil)) &&
      (!promo.maxUsage || promo.usageCount < promo.maxUsage);
    
    return Response.json({ 
      success: true,
      promo,
      isValid
    });
  } catch (error) {
    console.error('Error fetching promo:', error);
    return Response.json({ 
      success: false,
      message: 'Failed to fetch promo' 
    }, { status: 500 });
  }
}
