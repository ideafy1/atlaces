import nodemailer from 'nodemailer';

// ─────────────────────────────────────────────────────────────────────────
// BrainHeal — Premium Email Notification System
// Modelled after Google Analytics transactional email best practices.
// Uses table-based layout for maximum email client compatibility.
// Includes both HTML + plain text (multipart/alternative) to avoid spam.
// ─────────────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { return res.status(405).json({ success: false, message: 'Method Not Allowed' }); }

  const { toEmail, customerName, customerEmail, customerPhone, therapistName, date, time, duration, meetLink, price, type, concerns, note } = req.body;

  if (!toEmail) { return res.status(400).json({ success: false, message: 'toEmail is required' }); }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  const name = customerName || 'there';
  const isTherapistEmail = type === 'therapist';
  const concernsList = (concerns || []).join(', ');

  // ════════════════════════════════════════════════════════════════════════
  //  THERAPIST EMAIL
  // ════════════════════════════════════════════════════════════════════════
  if (isTherapistEmail) {
    const plainText = `Hello ${therapistName},

You have a new therapy session booking on BrainHeal.

CLIENT DETAILS
Name: ${name}
Email: ${customerEmail || 'Not provided'}
Phone: ${customerPhone || 'Not provided'}
Concerns: ${concernsList || 'None specified'}${note ? `\nAdditional Note: "${note}"` : ''}

SESSION DETAILS
Date: ${date}
Time: ${time}
Duration: ${duration}
Payment: Rs. ${price}${meetLink ? `\n\nPlease use your Google Meet link to host this session:\n${meetLink}` : ''}

Best regards,
The BrainHeal Team
https://brainheal.in`;

    const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>New Session Booking</title>
<style>
:root { color-scheme: light dark; supported-color-schemes: light dark; }
body { margin: 0; padding: 0; width: 100%; background-color: #f8f9fa; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; }
@media (prefers-color-scheme: dark) {
  body { background-color: #1a1a1a !important; }
  .main-wrapper { background-color: #202124 !important; border-color: #3c4043 !important; }
  .content-text { color: #e8eaed !important; }
  .sub-text { color: #9aa0a6 !important; }
  .detail-card { background-color: #303134 !important; border-color: #3c4043 !important; }
  .detail-label { color: #9aa0a6 !important; }
  .detail-value { color: #e8eaed !important; }
  .footer-text { color: #9aa0a6 !important; }
  .divider { border-color: #3c4043 !important; }
}
@media only screen and (max-width: 600px) {
  .main-wrapper { width: 100% !important; border: none !important; }
  .content-pad { padding: 24px 20px !important; }
  .detail-card { padding: 16px !important; }
}
</style>
</head>
<body style="margin: 0; padding: 0; width: 100%; background-color: #f8f9fa; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
<div style="display: none; max-height: 0; overflow: hidden; font-size: 0; line-height: 0;">New session booking from ${name} on ${date} at ${time}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa;">
<tr><td align="center" style="padding: 40px 16px;">
<table role="presentation" class="main-wrapper" width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border: 1px solid #e8eaed; border-radius: 16px; overflow: hidden; max-width: 600px;">

<!-- Header -->
<tr>
<td style="padding: 32px 40px 24px 40px; border-bottom: 1px solid #f1f3f4;" class="content-pad">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="font-size: 22px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.3px;" class="content-text">
        BrainHeal
      </td>
      <td align="right" style="font-size: 12px; color: #5f6368; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase;" class="sub-text">
        New Booking
      </td>
    </tr>
  </table>
</td>
</tr>

<!-- Title -->
<tr>
<td style="padding: 32px 40px 12px 40px;" class="content-pad">
  <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1a1a1a; line-height: 36px; letter-spacing: -0.5px;" class="content-text">
    New session <span style="color: #0d9488;">booked</span>
  </h1>
</td>
</tr>
<tr>
<td style="padding: 0 40px 28px 40px; font-size: 15px; line-height: 24px; color: #5f6368;" class="content-pad sub-text">
  You have a new therapy session booking. Please review the details below and be available at the scheduled time.
</td>
</tr>

<!-- Client Details Card -->
<tr>
<td style="padding: 0 40px 16px 40px;" class="content-pad">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="detail-card" style="background-color: #f8fffe; border: 1px solid #ccfbf1; border-radius: 12px; padding: 24px;">
    <tr><td style="padding: 0 0 12px 0; font-size: 13px; font-weight: 700; color: #0d9488; text-transform: uppercase; letter-spacing: 0.8px;">Client Details</td></tr>
    <tr><td style="padding: 6px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="100" style="font-size: 13px; color: #6b7280; vertical-align: top;" class="detail-label">Name</td>
      <td style="font-size: 14px; font-weight: 600; color: #1a1a1a;" class="detail-value">${name}</td>
    </tr></table></td></tr>
    <tr><td style="padding: 6px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="100" style="font-size: 13px; color: #6b7280; vertical-align: top;" class="detail-label">Email</td>
      <td style="font-size: 14px; font-weight: 500; color: #1a1a1a;" class="detail-value">${customerEmail || 'Not provided'}</td>
    </tr></table></td></tr>
    <tr><td style="padding: 6px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="100" style="font-size: 13px; color: #6b7280; vertical-align: top;" class="detail-label">Phone</td>
      <td style="font-size: 14px; font-weight: 500; color: #1a1a1a;" class="detail-value">${customerPhone || 'Not provided'}</td>
    </tr></table></td></tr>
    <tr><td style="padding: 6px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="100" style="font-size: 13px; color: #6b7280; vertical-align: top;" class="detail-label">Concerns</td>
      <td style="font-size: 14px; font-weight: 500; color: #1a1a1a;" class="detail-value">${concernsList || 'None specified'}</td>
    </tr></table></td></tr>${note ? `
    <tr><td style="padding: 6px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="100" style="font-size: 13px; color: #6b7280; vertical-align: top;" class="detail-label">Note</td>
      <td style="font-size: 14px; font-weight: 500; color: #1a1a1a; font-style: italic;" class="detail-value">"${note}"</td>
    </tr></table></td></tr>` : ''}
  </table>
</td>
</tr>

<!-- Session Details Card -->
<tr>
<td style="padding: 0 40px 28px 40px;" class="content-pad">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="detail-card" style="background-color: #f8f9fa; border: 1px solid #e8eaed; border-radius: 12px; padding: 24px;">
    <tr><td style="padding: 0 0 12px 0; font-size: 13px; font-weight: 700; color: #1a1a1a; text-transform: uppercase; letter-spacing: 0.8px;" class="content-text">Session Details</td></tr>
    <tr><td style="padding: 6px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="100" style="font-size: 13px; color: #6b7280;" class="detail-label">Date</td>
      <td style="font-size: 14px; font-weight: 600; color: #1a1a1a;" class="detail-value">${date}</td>
    </tr></table></td></tr>
    <tr><td style="padding: 6px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="100" style="font-size: 13px; color: #6b7280;" class="detail-label">Time</td>
      <td style="font-size: 14px; font-weight: 600; color: #1a1a1a;" class="detail-value">${time}</td>
    </tr></table></td></tr>
    <tr><td style="padding: 6px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="100" style="font-size: 13px; color: #6b7280;" class="detail-label">Duration</td>
      <td style="font-size: 14px; font-weight: 500; color: #1a1a1a;" class="detail-value">${duration}</td>
    </tr></table></td></tr>
    <tr><td style="padding: 6px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="100" style="font-size: 13px; color: #6b7280;" class="detail-label">Payment</td>
      <td style="font-size: 16px; font-weight: 700; color: #0d9488;" class="detail-value">Rs. ${price}</td>
    </tr></table></td></tr>${meetLink ? `
    <tr><td style="padding: 12px 0 0 0;">
      <a href="${meetLink}" target="_blank" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; letter-spacing: 0.2px;">Join Google Meet</a>
    </td></tr>` : ''}
  </table>
</td>
</tr>

<!-- Sign Off -->
<tr>
<td style="padding: 0 40px 32px 40px;" class="content-pad">
  <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #0d9488, #14b8a6); border-radius: 2px; margin-bottom: 16px;"></div>
  <p style="margin: 0 0 4px 0; font-size: 14px; color: #5f6368; line-height: 22px;" class="sub-text">Best regards,</p>
  <p style="margin: 0; font-size: 14px; font-weight: 700; color: #1a1a1a;" class="content-text">The BrainHeal Team</p>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding: 20px 40px; background-color: #f8f9fa; border-top: 1px solid #e8eaed;" class="content-pad">
  <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af; line-height: 18px;" class="footer-text">
    BrainHeal India &middot; B-204 V-Raj Appartment, Behind Panchayat Market, Silvassa 396230
  </p>
  <p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 18px;" class="footer-text">
    This is an automated notification from your BrainHeal booking system. Please do not reply to this email.
  </p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>`;

    try {
      await transporter.sendMail({
        from: `"BrainHeal India" <${process.env.EMAIL_USER}>`,
        replyTo: `"BrainHeal Support" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `New Session Booking — ${name} on ${date}`,
        text: plainText,
        html: html,
      });
      return res.status(200).json({ success: true, message: 'Therapist email sent!' });
    } catch (error) {
      console.error("Error sending therapist email:", error);
      return res.status(500).json({ success: false, message: 'Failed', error: error.toString() });
    }
  }

  // ════════════════════════════════════════════════════════════════════════
  //  CUSTOMER EMAIL
  // ════════════════════════════════════════════════════════════════════════
  const plainText = `Hi ${name},

Your therapy session with ${therapistName} is confirmed.

SESSION DETAILS
Therapist: ${therapistName}
Date: ${date}
Time: ${time}
Duration: ${duration}
Payment: Rs. ${price}${meetLink ? `\n\nJoin your session:\n${meetLink}` : ''}

BEFORE YOUR SESSION
1. Find a quiet, private space where you will not be interrupted.
2. Check your internet connection and microphone.
3. Try to join the meeting 2-3 minutes early.

If you need to reschedule or have any questions, reply to this email.

Warm regards,
Team BrainHeal
https://brainheal.in`;

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>Session Confirmed</title>
<style>
:root { color-scheme: light dark; supported-color-schemes: light dark; }
body { margin: 0; padding: 0; width: 100%; background-color: #f8f9fa; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; }
@media (prefers-color-scheme: dark) {
  body { background-color: #1a1a1a !important; }
  .main-wrapper { background-color: #202124 !important; border-color: #3c4043 !important; }
  .content-text { color: #e8eaed !important; }
  .sub-text { color: #9aa0a6 !important; }
  .detail-card { background-color: #303134 !important; border-color: #3c4043 !important; }
  .detail-label { color: #9aa0a6 !important; }
  .detail-value { color: #e8eaed !important; }
  .footer-text { color: #9aa0a6 !important; }
  .tip-card { background-color: #1e3a34 !important; border-color: #0d9488 !important; }
  .step-num { background-color: #0d9488 !important; }
}
@media only screen and (max-width: 600px) {
  .main-wrapper { width: 100% !important; border: none !important; }
  .content-pad { padding: 24px 20px !important; }
  .detail-card { padding: 16px !important; }
  .hero-title { font-size: 24px !important; line-height: 32px !important; }
}
</style>
</head>
<body style="margin: 0; padding: 0; width: 100%; background-color: #f8f9fa; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
<div style="display: none; max-height: 0; overflow: hidden; font-size: 0; line-height: 0;">Your session with ${therapistName} on ${date} is confirmed &#127775;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa;">
<tr><td align="center" style="padding: 40px 16px;">
<table role="presentation" class="main-wrapper" width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border: 1px solid #e8eaed; border-radius: 16px; overflow: hidden; max-width: 600px;">

<!-- Header -->
<tr>
<td style="padding: 32px 40px 24px 40px; border-bottom: 1px solid #f1f3f4;" class="content-pad">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="font-size: 22px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.3px;" class="content-text">
        BrainHeal
      </td>
      <td align="right" style="font-size: 12px; color: #0d9488; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">
        Confirmed
      </td>
    </tr>
  </table>
</td>
</tr>

<!-- Hero Title -->
<tr>
<td style="padding: 36px 40px 8px 40px;" class="content-pad">
  <h1 class="hero-title content-text" style="margin: 0; font-size: 30px; font-weight: 700; color: #1a1a1a; line-height: 40px; letter-spacing: -0.5px;">
    Your session is <span style="color: #0d9488;">confirmed</span>
  </h1>
</td>
</tr>
<tr>
<td style="padding: 0 40px 32px 40px; font-size: 15px; line-height: 24px; color: #5f6368;" class="content-pad sub-text">
  Hi ${name}, your therapy session with <strong>${therapistName}</strong> has been successfully booked. Here are your details:
</td>
</tr>

<!-- Session Details Card -->
<tr>
<td style="padding: 0 40px 24px 40px;" class="content-pad">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="detail-card" style="background-color: #f8f9fa; border: 1px solid #e8eaed; border-radius: 12px; padding: 24px;">
    <tr><td style="padding: 0 0 14px 0; font-size: 13px; font-weight: 700; color: #1a1a1a; text-transform: uppercase; letter-spacing: 0.8px;" class="content-text">Session Details</td></tr>
    <tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="100" style="font-size: 13px; color: #6b7280; padding: 7px 0;" class="detail-label">Therapist</td>
      <td style="font-size: 14px; font-weight: 600; color: #1a1a1a; padding: 7px 0;" class="detail-value">${therapistName}</td>
    </tr></table></td></tr>
    <tr><td style="border-top: 1px solid #f1f3f4;" class="divider"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="100" style="font-size: 13px; color: #6b7280; padding: 7px 0;" class="detail-label">Date</td>
      <td style="font-size: 14px; font-weight: 600; color: #1a1a1a; padding: 7px 0;" class="detail-value">${date}</td>
    </tr></table></td></tr>
    <tr><td style="border-top: 1px solid #f1f3f4;" class="divider"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="100" style="font-size: 13px; color: #6b7280; padding: 7px 0;" class="detail-label">Time</td>
      <td style="font-size: 14px; font-weight: 600; color: #1a1a1a; padding: 7px 0;" class="detail-value">${time}</td>
    </tr></table></td></tr>
    <tr><td style="border-top: 1px solid #f1f3f4;" class="divider"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="100" style="font-size: 13px; color: #6b7280; padding: 7px 0;" class="detail-label">Duration</td>
      <td style="font-size: 14px; font-weight: 500; color: #1a1a1a; padding: 7px 0;" class="detail-value">${duration}</td>
    </tr></table></td></tr>
    <tr><td style="border-top: 1px solid #f1f3f4;" class="divider"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="100" style="font-size: 13px; color: #6b7280; padding: 7px 0;" class="detail-label">Payment</td>
      <td style="font-size: 16px; font-weight: 700; color: #0d9488; padding: 7px 0;">Rs. ${price}</td>
    </tr></table></td></tr>
  </table>
</td>
</tr>

${meetLink ? `<!-- CTA Button -->
<tr>
<td align="center" style="padding: 0 40px 32px 40px;" class="content-pad">
  <table role="presentation" cellspacing="0" cellpadding="0" align="center">
    <tr><td style="background-color: #0d9488; border-radius: 10px; text-align: center;">
      <a href="${meetLink}" target="_blank" style="display: inline-block; padding: 14px 40px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; letter-spacing: 0.3px;">Join Your Session</a>
    </td></tr>
  </table>
</td>
</tr>` : ''}

<!-- Preparation Tips -->
<tr>
<td style="padding: 0 40px 28px 40px;" class="content-pad">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="tip-card" style="background-color: #f0fdfa; border: 1px solid #99f6e4; border-radius: 12px; padding: 24px;">
    <tr><td style="padding: 0 0 14px 0; font-size: 13px; font-weight: 700; color: #0d9488; text-transform: uppercase; letter-spacing: 0.8px;">Before Your Session</td></tr>
    <tr><td style="padding: 6px 0;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>
      <td valign="top" width="24" style="width: 24px; min-width: 24px; max-width: 24px;">
        <div style="width: 24px; height: 24px; background-color: #0d9488; border-radius: 50%; text-align: center; font-size: 12px; font-weight: 700; color: #ffffff; line-height: 24px;">1</div>
      </td>
      <td valign="top" style="padding-left: 12px; font-size: 14px; color: #374151; line-height: 22px;" class="sub-text">Find a quiet, private space where you will not be interrupted.</td>
    </tr></table></td></tr>
    <tr><td style="padding: 6px 0;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>
      <td valign="top" width="24" style="width: 24px; min-width: 24px; max-width: 24px;">
        <div style="width: 24px; height: 24px; background-color: #0d9488; border-radius: 50%; text-align: center; font-size: 12px; font-weight: 700; color: #ffffff; line-height: 24px;">2</div>
      </td>
      <td valign="top" style="padding-left: 12px; font-size: 14px; color: #374151; line-height: 22px;" class="sub-text">Check your internet connection and microphone.</td>
    </tr></table></td></tr>
    <tr><td style="padding: 6px 0;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>
      <td valign="top" width="24" style="width: 24px; min-width: 24px; max-width: 24px;">
        <div style="width: 24px; height: 24px; background-color: #0d9488; border-radius: 50%; text-align: center; font-size: 12px; font-weight: 700; color: #ffffff; line-height: 24px;">3</div>
      </td>
      <td valign="top" style="padding-left: 12px; font-size: 14px; color: #374151; line-height: 22px;" class="sub-text">Try to join the meeting 2-3 minutes early.</td>
    </tr></table></td></tr>
  </table>
</td>
</tr>

<!-- Sign Off -->
<tr>
<td style="padding: 0 40px 36px 40px;" class="content-pad">
  <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #0d9488, #14b8a6); border-radius: 2px; margin-bottom: 16px;"></div>
  <p style="margin: 0 0 4px 0; font-size: 14px; color: #5f6368; line-height: 22px;" class="sub-text">Warm regards,</p>
  <p style="margin: 0; font-size: 14px; font-weight: 700; color: #1a1a1a;" class="content-text">Team BrainHeal</p>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding: 20px 40px; background-color: #f8f9fa; border-top: 1px solid #e8eaed;" class="content-pad">
  <p style="margin: 0 0 6px 0; font-size: 12px; color: #9ca3af; line-height: 18px;" class="footer-text">
    BrainHeal India &middot; B-204 V-Raj Appartment, Behind Panchayat Market, Silvassa 396230
  </p>
  <p style="margin: 0 0 6px 0; font-size: 12px; color: #9ca3af; line-height: 18px;" class="footer-text">
    This email was sent to ${toEmail} because you booked a session on BrainHeal. If you need to reschedule, reply to this email.
  </p>
  <p style="margin: 0; font-size: 11px; color: #d1d5db; line-height: 18px;" class="footer-text">
    &copy; ${new Date().getFullYear()} BrainHeal India. All rights reserved.
  </p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"BrainHeal India" <${process.env.EMAIL_USER}>`,
      replyTo: `"BrainHeal Support" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Your session with ${therapistName} is confirmed`,
      text: plainText,
      html: html,
    });
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.toString() });
  }
}
