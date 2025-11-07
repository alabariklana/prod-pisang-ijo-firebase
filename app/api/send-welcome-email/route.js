import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/brevo';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const result = await sendWelcomeEmail({ name, email });

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Welcome email sent' });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}