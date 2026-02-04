import fetch from 'node-fetch';

export const sendVerificationMail = async (email, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/login?token=${token}`;
  const logoUrl = "https://lokbank.vercel.app/assets/bank_logo-eFIoGbRI.png"; // public logo URL

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: 'LOK Bank',
        email: process.env.GMAIL_USER,
      },
      to: [{ email }],
      subject: 'Welcome to LOK Bank – Verify Your Account',
      htmlContent: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px; overflow: hidden; background-color: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">

  <div style="height: 6px; background-color: #d4af37; width: 100%;"></div>

  <div style="background-color: #002117; padding: 40px 20px; text-align: center;">
    <img src="${logoUrl}" width="200" alt="LOK Bank Logo" style="display:block; margin:auto;" />
    <div style="margin-top: 20px; color: #d4af37; font-size: 14px; letter-spacing: 2px; font-weight: 800; text-transform: uppercase; opacity: 0.9;">
      <span style="color: #4caf50; font-size: 14px;">●</span> SECURE SERVER ACTIVE
    </div>
  </div>

  <div style="padding: 40px; color: #002117; line-height: 1.8; font-size: 16px;">
    <h1 style="color: #002117; font-size: 28px; font-weight: 900; margin-bottom: 10px;">Create Account</h1>
    <div style="height: 4px; width: 50px; background-color: #d4af37; margin-bottom: 25px;"></div>

    <p style="font-size: 17px; font-weight: 500;">Begin your journey with LOK Bank.</p>

    <p style="font-size: 16px; margin-top: 15px;">
      Thank you for initiating your registration with <strong>LOK Bank</strong>.
      To activate your account, please verify your identity by clicking the button below.
    </p>

    <div style="text-align: center; margin: 40px 0;">
      <a href="${verifyUrl}" style="background-color: #002117; color: #ffffff; padding: 20px 50px; text-decoration: none; border-radius: 5px; font-weight: 800; font-size: 16px; letter-spacing: 1px; display: inline-block; text-transform: uppercase;">
        Authorize Access
      </a>
    </div>

    <p style="font-size: 14px; color: #888; text-align: center; margin-bottom: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
      Secure Authentication Link
    </p>
    <p style="word-break: break-all; font-size: 13px; color: #002117; text-align: center; padding: 10px; border: 1px dashed #d4af37; border-radius: 4px;">
      ${verifyUrl}
    </p>

    <p style="margin-top: 30px; font-size: 16px; font-weight: 800;">
      Welcome aboard,<br/>
      <span style="color: #d4af37;">LOK Bank</span>
    </p>
  </div>

  <div style="padding: 0 40px;"><hr style="border: none; border-top: 1px solid #eee;" /></div>

  <div style="padding: 30px 40px; text-align: center; font-size: 13px; color: #999; letter-spacing: 0.5px;">
    <p style="margin: 0; font-weight: 800; color: #002117; opacity: 0.6; text-transform: uppercase;">LOK Bank Infrastructure © 2026</p>
    <p style="margin: 5px 0;">Certified Secure Environment | Tel Aviv, Israel</p>
    <p style="margin-top: 10px; color: #d4af37; font-weight: 900;">AES-256 BIT ENCRYPTED COMMUNICATION</p>
  </div>
</div>
      `,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Brevo error: ${error}`);
  }
};
