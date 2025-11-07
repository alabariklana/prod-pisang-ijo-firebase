import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ message: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ message: 'Invalid email format' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Check if email already exists
    const existing = await db.collection('newsletter').findOne({ email });
    
    if (existing) {
      if (existing.status === 'unsubscribed') {
        // Reactivate subscription
        await db.collection('newsletter').updateOne(
          { email },
          { 
            $set: { 
              status: 'active',
              resubscribedAt: new Date(),
              updatedAt: new Date()
            }
          }
        );
        
        // Send welcome back email
        try {
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/send-welcome`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, isResubscribe: true })
          });
        } catch (emailError) {
          console.warn('Welcome back email error:', emailError);
        }
        
        return Response.json({ 
          success: true,
          message: 'Selamat datang kembali! Langganan newsletter Anda telah diaktifkan kembali.' 
        });
      }
      
      // Email already active - return 200 instead of 409 for better UX
      return Response.json({ 
        success: true,
        message: 'Email Anda sudah terdaftar dan aktif di newsletter kami. Terima kasih!' 
      }, { status: 200 });
    }

    // Add new subscriber
    await db.collection('newsletter').insertOne({
      email,
      status: 'active',
      subscribedAt: new Date(),
      updatedAt: new Date(),
      source: 'website'
    });

    // Send confirmation email via Brevo
    try {
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/send-welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const emailData = await emailResponse.json();
      
      if (emailData.success) {
        console.log('Confirmation email sent to:', email);
      } else {
        console.warn('Confirmation email failed:', emailData.error);
      }
    } catch (emailError) {
      console.warn('Confirmation email error:', emailError);
      // Don't fail the subscription if email fails
    }

    return Response.json({ 
      success: true,
      message: 'Successfully subscribed! Check your email for confirmation.' 
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return Response.json({ 
      message: 'Failed to subscribe to newsletter' 
    }, { status: 500 });
  }
}
