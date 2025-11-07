import * as brevo from '@getbrevo/brevo';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if Brevo is configured
    if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL) {
      console.warn('Brevo not configured, skipping welcome email');
      return Response.json({ 
        success: false, 
        error: 'Email service not configured' 
      });
    }

    const apiInstance = new brevo.TransactionalEmailsApi();
    const apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "✅ Konfirmasi - Subscribe Newsletter Pisang Ijo Evi Berhasil!";
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background-color: #214929; color: white; padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #EBDEC5; padding: 40px 30px; }
          .footer { background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 14px 35px; background-color: #214929; color: white !important; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .success-icon { font-size: 48px; margin-bottom: 10px; }
          .highlight-box { background-color: white; border-left: 4px solid #FCD900; padding: 15px; margin: 20px 0; border-radius: 4px; }
          h1 { margin: 0; font-family: 'Playfair Display', serif; font-size: 28px; }
          h2 { color: #214929; font-family: 'Playfair Display', serif; margin-top: 0; }
          .benefit-list { list-style: none; padding: 0; }
          .benefit-list li { padding: 8px 0; padding-left: 30px; position: relative; }
          .benefit-list li:before { content: "✓"; position: absolute; left: 0; color: #214929; font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✅</div>
            <h1>🍌 Pisang Ijo Evi</h1>
            <p style="margin: 15px 0 0; font-size: 18px; font-weight: bold;">Subscribe Newsletter Anda Berhasil!</p>
          </div>
          <div class="content">
            <h2>Selamat Bergabung! 🎉</h2>
            <p style="font-size: 16px;">
              Terima kasih telah berlangganan newsletter <strong>Pisang Ijo Evi</strong>. 
              Email Anda (<strong>${email}</strong>) telah berhasil terdaftar di sistem kami.
            </p>
            
            <div class="highlight-box">
              <p style="margin: 0; font-weight: bold; color: #214929;">🎁 Apa yang akan Anda dapatkan?</p>
            </div>

            <ul class="benefit-list">
              <li><strong>Info promo dan diskon eksklusif</strong> - Penawaran khusus hanya untuk subscriber</li>
              <li><strong>Update menu terbaru</strong> - Jadilah yang pertama tahu menu spesial kami</li>
              <li><strong>Tips & resep menarik</strong> - Inspirasi kuliner dari kami</li>
              <li><strong>Event dan giveaway</strong> - Kesempatan menang hadiah menarik</li>
              <li><strong>Voucher special</strong> - Potongan harga di waktu-waktu tertentu</li>
            </ul>

            <div class="highlight-box" style="border-left-color: #214929; background-color: #fff;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #214929;">💡 Tips: Tingkatkan Keuntungan Anda!</p>
              <p style="margin: 0; font-size: 14px;">
                Daftar sebagai <strong>member</strong> untuk mendapatkan poin reward setiap pembelian 
                dan nikmati benefit eksklusif lainnya!
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/signup" class="button">
                🎯 Daftar Jadi Member Sekarang
              </a>
            </div>

            <div style="background-color: #FCD900; padding: 20px; border-radius: 8px; text-align: center; margin-top: 30px;">
              <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold; color: #214929;">🔥 PROMO MINGGU INI</p>
              <p style="margin: 0; font-size: 18px; font-weight: bold; color: #214929;">Diskon 15% untuk Semua Menu Special!</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #214929;">*Syarat dan ketentuan berlaku</p>
            </div>

            <p style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
              Terima kasih atas kepercayaan Anda!<br>
              <strong style="color: #214929;">Tim Pisang Ijo Evi</strong> �
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 10px 0;">
              Anda menerima email ini karena telah berlangganan newsletter Pisang Ijo Evi.
            </p>
            <p style="margin: 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #214929; text-decoration: none; font-weight: bold;">🌐 Kunjungi Website Kami</a> | 
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/menu" style="color: #214929; text-decoration: none; font-weight: bold;">📋 Lihat Menu</a>
            </p>
            <p style="margin: 10px 0 0 0; font-size: 11px; color: #999;">
              © ${new Date().getFullYear()} Pisang Ijo Evi. All rights reserved.
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

    return Response.json({ 
      success: true, 
      message: 'Welcome email sent successfully' 
    });

  } catch (error) {
    console.error('Error sending welcome email:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
