import * as brevo from '@getbrevo/brevo';

export async function sendWelcomeEmail({ name, email }) {
  try {
    // Check if API key is configured
    if (!process.env.BREVO_API_KEY) {
      console.warn('BREVO_API_KEY not configured, skipping email');
      return { success: false, error: 'Email service not configured' };
    }

    // Check if sender email is configured
    if (!process.env.BREVO_SENDER_EMAIL) {
      console.warn('BREVO_SENDER_EMAIL not configured, skipping email');
      return { success: false, error: 'Sender email not configured' };
    }

    const apiInstance = new brevo.TransactionalEmailsApi();
    const apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = "Selamat Datang di Pisang Ijo Evi! 🍌";
    sendSmtpEmail.to = [{ email: email, name: name || email }];
    sendSmtpEmail.sender = {
      name: process.env.BREVO_SENDER_NAME || "Pisang Ijo Evi",
      email: process.env.BREVO_SENDER_EMAIL
    };
    
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #214929; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background-color: #214929; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍌 Selamat Datang!</h1>
          </div>
          <div class="content">
            <p>Halo <strong>${name || 'Pelanggan'}</strong>,</p>
            <p>Terima kasih telah mendaftar di <strong>Pisang Ijo Evi</strong>! Kami senang Anda bergabung dengan kami.</p>
            <p>Sekarang Anda dapat menikmati:</p>
            <ul>
              <li>✅ Pemesanan yang lebih mudah dan cepat</li>
              <li>✅ Melacak status pesanan Anda</li>
              <li>✅ Mendapatkan penawaran spesial</li>
              <li>✅ Riwayat pembelian yang tersimpan</li>
            </ul>
            <p>Mulai jelajahi produk kami dan lakukan pemesanan pertama Anda!</p>
            <center>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" class="button">
                Mulai Belanja
              </a>
            </center>
          </div>
          <div class="footer">
            <p>Email ini dikirim otomatis. Jika Anda memiliki pertanyaan, silakan hubungi kami.</p>
            <p>&copy; 2025 Pisang Ijo Evi. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Error sending email:', error);
    // Return more detailed error info
    return { 
      success: false, 
      error: error.response?.body?.message || error.message || 'Failed to send email'
    };
  }
}