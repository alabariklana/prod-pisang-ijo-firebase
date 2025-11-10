import { NextResponse } from 'next/server';
import { getCities } from '@/lib/rajaongkir';

export async function GET(request) {
  console.log('=== GET CITIES API CALLED ===');
  
  try {
    const { searchParams } = new URL(request.url);
    const provinceId = searchParams.get('province');
    
    console.log('Province ID:', provinceId);
    
    if (!provinceId) {
      return NextResponse.json({
        success: false,
        error: 'Province ID is required'
      }, { status: 400 });
    }
    
    const result = await getCities(provinceId);
    
    console.log('Cities result:', result);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        cities: result.cities
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in cities API:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch cities'
    }, { status: 500 });
  }
}