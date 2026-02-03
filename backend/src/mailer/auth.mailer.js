import fetch from 'node-fetch';

export const sendVerificationMail = async (email, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/login?token=${token}`;
  const logoUrl = `../assets/bank_logo.png`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'LOK Bank <noreply@yourdomain.com>',
      to: email,
      subject: 'Welcome to LOK Bank – Verify Your Account',
      html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px; overflow: hidden; background-color: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">

  <div style="height: 6px; background-color: #d4af37; width: 100%;"></div>

  <div style="background-color: #002117; padding: 40px 20px; text-align: center;">
    <img src="${logoUrl}" width="180" alt="LOK Bank Logo" style="display:block; margin:auto;" />
    <div style="margin-top: 20px; color: #d4af37; font-size: 10px; letter-spacing: 2px; font-weight: 800; text-transform: uppercase; opacity: 0.9;">
      <span style="color: #4caf50; font-size: 12px;">●</span> SECURE SERVER ACTIVE
    </div>
  </div>

  <div style="padding: 40px; color: #002117; line-height: 1.6;">
    <h1 style="color: #002117; font-size: 26px; font-weight: 900; text-align: left; margin-bottom: 5px; letter-spacing: -1px;">
      Create Account
    </h1>
    <div style="height: 3px; width: 40px; background-color: #d4af37; margin-bottom: 25px;"></div>

    <p style="font-size: 15px; font-weight: 500;">Begin your journey with LOK Bank.</p>

    <p style="font-size: 14px; color: #444; margin-top: 20px;">
      Thank you for initiating your registration with <strong>LOK Bank</strong>. To activate your institutional-grade encryption profile and access the multi-vault protocol, please verify your identity.
    </p>

    <div style="text-align: center; margin: 40px 0;">
      <a href="${verifyUrl}" style="background-color: #002117; color: #ffffff; padding: 18px 40px; text-decoration: none; border-radius: 4px; font-weight: 800; font-size: 15px; letter-spacing: 1px; display: inline-block; text-transform: uppercase; box-shadow: 0 8px 16px rgba(0, 33, 23, 0.2);">
        Authorize Access
      </a>
    </div>

    <p style="font-size: 12px; color: #888; text-align: center; margin-bottom: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
      Secure Authentication Link
    </p>
    <p style="word-break: break-all; font-size: 11px; color: #002117; text-align: center; padding: 10px; border: 1px dashed #d4af37; border-radius: 4px;">
      ${verifyUrl}
    </p>

    <p style="margin-top: 40px; font-size: 14px; font-weight: 800;">
      Welcome aboard,<br/>
      <span style="color: #d4af37;">The LOK Bank Infrastructure Team</span>
    </p>
  </div>

  <div style="padding: 0 40px;"><hr style="border: none; border-top: 1px solid #eee;" /></div>

  <div style="padding: 30px 40px; text-align: center; font-size: 11px; color: #999; letter-spacing: 0.5px;">
    <p style="margin: 0; font-weight: 800; color: #002117; opacity: 0.6; text-transform: uppercase;">LOK Bank Infrastructure © 2026</p>
    <p style="margin: 5px 0;">Certified Secure Environment | Tel Aviv, Israel</p>
    <p style="margin-top: 10px; color: #d4af37; font-weight: 900;">AES-256 BIT ENCRYPTED COMMUNICATION</p>
  </div>
</div>
      `
    })
  });
};
