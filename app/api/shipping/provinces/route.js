import { NextResponse } from 'next/server';
import { getProvinces } from '@/lib/rajaongkir';

export async function GET() {
  console.log('=== GET PROVINCES API CALLED ===');
  
  try {
    const result = await getProvinces();
    
    console.log('Provinces result:', result);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        provinces: result.provinces
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in provinces API:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch provinces'
    }, { status: 500 });
  }
}