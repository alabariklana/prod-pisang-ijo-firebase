import { NextResponse } from 'next/server';
import { trackDelivery } from '@/lib/rajaongkir';

export async function POST(request) {
  console.log('=== TRACK DELIVERY API CALLED ===');
  
  try {
    const data = await request.json();
    console.log('Received tracking data:', data);
    
    const { waybill, courier } = data;
    
    // Validate required fields
    if (!waybill || !courier) {
      return NextResponse.json({
        success: false,
        error: 'Waybill number and courier are required'
      }, { status: 400 });
    }
    
    // Validate courier (must be supported by RajaOngkir)
    const supportedCouriers = ['jne', 'pos', 'tiki'];
    if (!supportedCouriers.includes(courier.toLowerCase())) {
      return NextResponse.json({
        success: false,
        error: `Courier must be one of: ${supportedCouriers.join(', ')}`
      }, { status: 400 });
    }
    
    console.log('Tracking delivery with params:', {
      waybill,
      courier: courier.toLowerCase()
    });
    
    const result = await trackDelivery(waybill, courier.toLowerCase());
    
    console.log('Tracking result:', result);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        tracking: result.tracking
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in tracking API:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to track delivery'
    }, { status: 500 });
  }
}

// GET method for tracking with query parameters (alternative)
export async function GET(request) {
  console.log('=== GET TRACK DELIVERY API CALLED ===');
  
  try {
    const { searchParams } = new URL(request.url);
    
    const waybill = searchParams.get('waybill');
    const courier = searchParams.get('courier');
    
    console.log('Query params:', { waybill, courier });
    
    // Validate required fields
    if (!waybill || !courier) {
      return NextResponse.json({
        success: false,
        error: 'Waybill and courier are required as query parameters'
      }, { status: 400 });
    }
    
    // Validate courier
    const supportedCouriers = ['jne', 'pos', 'tiki'];
    if (!supportedCouriers.includes(courier.toLowerCase())) {
      return NextResponse.json({
        success: false,
        error: `Courier must be one of: ${supportedCouriers.join(', ')}`
      }, { status: 400 });
    }
    
    const result = await trackDelivery(waybill, courier.toLowerCase());
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        tracking: result.tracking
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in GET tracking API:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to track delivery'
    }, { status: 500 });
  }
}