import * as brevo from '@getbrevo/brevo';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { subject, message, targetStatus } = await req.json();

    if (!subject || !message) {
      return Response.json({ error: 'Subject and message are required' }, { status: 400 });
    }

    // Check if Brevo is configured
    if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL) {
      return Response.json({ 
        error: 'Email service not configured' 
      }, { status: 500 });
    }

    const { db } = await connectToDatabase();

    // Get active subscribers
    const filter = targetStatus === 'all' 
      ? { status: 'active' }
      : { status: 'active' };
      
    const subscribers = await db.collection('newsletter')
      .find(filter)
      .toArray();

    if (subscribers.length === 0) {
      return Response.json({ 
        error: 'No active subscribers found' 
      }, { status: 404 });
    }

    const apiInstance = new brevo.TransactionalEmailsApi();
    const apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let successCount = 0;
    let failCount = 0;

    // Send emails in batches to avoid rate limits
    const batchSize = 50;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      for (const subscriber of batch) {
        try {
          const sendSmtpEmail = new brevo.SendSmtpEmail();
          sendSmtpEmail.subject = subject;
          sendSmtpEmail.to = [{ email: subscriber.email }];
          sendSmtpEmail.htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #214929; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #EBDEC5; padding: 30px; }
                .footer { background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
                h1 { margin: 0; font-family: 'Playfair Display', serif; }
                .message { white-space: pre-wrap; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🍌 Pisang Ijo Evi</h1>
                </div>
                <div class="content">
                  <div class="message">${message}</div>
                </div>
                <div class="footer">
                  <p>
                    Anda menerima email ini karena telah berlangganan newsletter Pisang Ijo Evi.<br>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #214929;">Kunjungi Website Kami</a>
                  </p>
                </div>
              </div>
            </body>
            </html>
          `;
          sendSmtpEmail.sender = {
            name: process.env.BREVO_SENDER_NAME || 'Pisang Ijo Evi',
            email: process.env.BREVO_SENDER_EMAIL
          };

          await apiInstance.sendTransacEmail(sendSmtpEmail);
          successCount++;

          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (emailError) {
          console.error(`Failed to send to ${subscriber.email}:`, emailError);
          failCount++;
        }
      }
    }

    // Log the broadcast
    await db.collection('newsletter_campaigns').insertOne({
      subject,
      message,
      recipientCount: subscribers.length,
      successCount,
      failCount,
      sentAt: new Date()
    });

    return Response.json({
      success: true,
      message: `Email blast sent to ${successCount} subscribers`,
      stats: {
        total: subscribers.length,
        success: successCount,
        failed: failCount
      }
    });

  } catch (error) {
    console.error('Error sending email blast:', error);
    return Response.json({ 
      error: 'Failed to send email blast',
      details: error.message 
    }, { status: 500 });
  }
}
