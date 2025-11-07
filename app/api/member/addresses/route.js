import { connectToDatabase } from '@/lib/mongodb';

// GET - Fetch addresses for a member
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    const addresses = await db.collection('addresses')
      .find({ memberEmail: email })
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      success: true,
      addresses: addresses.map(a => ({ ...a, _id: a._id.toString() }))
    });

  } catch (error) {
    console.error('Error fetching addresses:', error);
    return Response.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

// POST - Add new address
export async function POST(req) {
  try {
    const body = await req.json();
    const { memberEmail, label, address, latitude, longitude, notes } = body;

    if (!memberEmail || !label || !address) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const newAddress = {
      memberEmail,
      label,
      address,
      latitude: latitude || null,
      longitude: longitude || null,
      notes: notes || '',
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Check if this is the first address, make it default
    const existingCount = await db.collection('addresses').countDocuments({ memberEmail });
    if (existingCount === 0) {
      newAddress.isDefault = true;
    }

    const result = await db.collection('addresses').insertOne(newAddress);

    return Response.json({
      success: true,
      message: 'Address added successfully',
      address: { ...newAddress, _id: result.insertedId.toString() }
    });

  } catch (error) {
    console.error('Error adding address:', error);
    return Response.json({ error: 'Failed to add address' }, { status: 500 });
  }
}

// DELETE - Remove address
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');

    if (!id || !email) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const { ObjectId } = require('mongodb');

    const result = await db.collection('addresses').deleteOne({
      _id: new ObjectId(id),
      memberEmail: email
    });

    if (result.deletedCount === 0) {
      return Response.json({ error: 'Address not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: 'Address deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting address:', error);
    return Response.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
