import { NextResponse } from 'next/server';
import { calculateShippingCost, formatShippingServices } from '@/lib/rajaongkir';

export async function POST(request) {
  console.log('=== CALCULATE SHIPPING COST API CALLED ===');
  
  try {
    const data = await request.json();
    console.log('Received shipping calculation data:', data);
    
    const { origin, destination, weight, courier = 'jne' } = data;
    
    // Validate required fields
    if (!origin || !destination || !weight) {
      return NextResponse.json({
        success: false,
        error: 'Origin, destination, and weight are required'
      }, { status: 400 });
    }
    
    // Validate weight (must be at least 1 gram)
    const weightInGrams = parseInt(weight);
    if (weightInGrams < 1) {
      return NextResponse.json({
        success: false,
        error: 'Weight must be at least 1 gram'
      }, { status: 400 });
    }
    
    console.log('Calculating shipping cost with params:', {
      origin,
      destination,
      weight: weightInGrams,
      courier
    });
    
    const result = await calculateShippingCost({
      origin,
      destination,
      weight: weightInGrams,
      courier
    });
    
    console.log('Shipping cost result:', result);
    
    if (result.success) {
      const formattedServices = formatShippingServices(result.costs);
      
      return NextResponse.json({
        success: true,
        shippingOptions: formattedServices,
        rawData: result.costs // For debugging
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in shipping cost calculation API:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to calculate shipping cost'
    }, { status: 500 });
  }
}

// GET method to calculate with query parameters (alternative)
export async function GET(request) {
  console.log('=== GET SHIPPING COST API CALLED ===');
  
  try {
    const { searchParams } = new URL(request.url);
    
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const weight = searchParams.get('weight');
    const courier = searchParams.get('courier') || 'jne';
    
    console.log('Query params:', { origin, destination, weight, courier });
    
    // Validate required fields
    if (!origin || !destination || !weight) {
      return NextResponse.json({
        success: false,
        error: 'Origin, destination, and weight are required as query parameters'
      }, { status: 400 });
    }
    
    // Validate weight
    const weightInGrams = parseInt(weight);
    if (weightInGrams < 1) {
      return NextResponse.json({
        success: false,
        error: 'Weight must be at least 1 gram'
      }, { status: 400 });
    }
    
    const result = await calculateShippingCost({
      origin,
      destination,
      weight: weightInGrams,
      courier
    });
    
    if (result.success) {
      const formattedServices = formatShippingServices(result.costs);
      
      return NextResponse.json({
        success: true,
        shippingOptions: formattedServices
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in GET shipping cost API:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to calculate shipping cost'
    }, { status: 500 });
  }
}