import fetch from 'node-fetch';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoPath = path.join(__dirname, '../../assets/bank_logo.png');
const logoBase64 = fs.readFileSync(logoPath).toString('base64');

export const sendVerificationMail = async (email, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/login?token=${token}`;

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: 'LOK Bank',
        email: 'lotemkitaroo@gmail.com', // must be verified in Brevo
      },
      to: [{ email }],
      subject: 'Welcome to LOK Bank – Verify Your Account',
      htmlContent: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px; overflow: hidden; background-color: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.1); font-size: 18px;">

  <div style="height: 6px; background-color: #d4af37; width: 100%;"></div>

  <div style="background-color: #002117; padding: 40px 20px; text-align: center;">
    <img src="cid:logo" width="180" alt="LOK Bank Logo" style="display:block; margin:auto;" />
    <div style="margin-top: 20px; color: #d4af37; font-size: 12px; letter-spacing: 2px; font-weight: 800; text-transform: uppercase; opacity: 0.9;">
      <span style="color: #4caf50; font-size: 14px;">●</span> SECURE SERVER ACTIVE
    </div>
  </div>

  <div style="padding: 40px; color: #002117; line-height: 1.6;">
    <h1 style="color: #002117; font-size: 28px; font-weight: 900; margin-bottom: 10px;">Create Account</h1>
    <div style="height: 4px; width: 40px; background-color: #d4af37; margin-bottom: 30px;"></div>

    <p style="font-size: 18px;">Begin your journey with LOK Bank.</p>

    <p style="font-size: 16px;">
      Thank you for initiating your registration with <strong>LOK Bank</strong>.
      Please verify your identity to activate your account.
    </p>

    <div style="text-align: center; margin: 40px 0;">
      <a href="${verifyUrl}" style="background-color: #002117; color: #ffffff; padding: 20px 45px; text-decoration: none; border-radius: 4px; font-weight: 800; font-size: 18px; display: inline-block;">
        Authorize Access
      </a>
    </div>

    <p style="word-break: break-all; font-size: 14px; text-align: center;">
      ${verifyUrl}
    </p>

    <p style="font-size: 16px;">
      Welcome aboard,<br/>
      <strong style="color:#d4af37;">The LOK Bank Infrastructure Team</strong>
    </p>
  </div>
</div>
      `,
      attachments: [
        {
          content: logoBase64,
          name: 'bank_logo.png',
          type: 'image/png',
          disposition: 'inline',
          header: { 'Content-ID': 'logo' }, // Brevo inline reference
        },
      ],
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Brevo error: ${error}`);
  }
};
