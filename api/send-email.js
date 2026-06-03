import nodemailer from 'nodemailer';

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

  // ========== THERAPIST EMAIL ==========
  if (isTherapistEmail) {
    const tPlain = `Hello ${therapistName},

You have a new therapy session booking via Atlaces.

----- CLIENT DETAILS -----
Name: ${name}
Email: ${customerEmail || 'Not provided'}
Phone: ${customerPhone || 'Not provided'}
Concerns: ${concernsList || 'None specified'}
${note ? `Additional Note: "${note}"` : ''}

----- SESSION DETAILS -----
Date: ${date}
Time: ${time}
Duration: ${duration}
Amount Paid: Rs. ${price}
${meetLink ? `
Please use your standard Google Meet link to host this session:
${meetLink}
` : ''}
Best regards,
The Atlaces Team
atlaces.in`;

    try {
      await transporter.sendMail({
        from: `"Atlaces" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `New Session Booking: ${name} on ${date}`,
        text: tPlain
      });
      return res.status(200).json({ success: true, message: 'Therapist email sent!' });
    } catch (error) {
      console.error("Error sending therapist email:", error);
      return res.status(500).json({ success: false, message: 'Failed', error: error.toString() });
    }
  }

  // ========== CUSTOMER EMAIL ==========
  const plainText = `Hi ${name},

Your therapy session with ${therapistName} is confirmed!

----- YOUR SESSION DETAILS -----
Therapist: ${therapistName}
Date: ${date}
Time: ${time}
Duration: ${duration}
Amount Paid: Rs. ${price}
${meetLink ? `
Link to join your session:
${meetLink}
` : ''}
----- BEFORE YOUR SESSION -----
1. Find a quiet, private space where you won't be interrupted.
2. Check your internet connection and microphone.
3. Try to join the meeting 2-3 minutes early.

If you need to reschedule or have any questions, simply reply directly to this email.

Warm regards,
Team Atlaces
atlaces.in`;

  try {
    await transporter.sendMail({
      from: `"Atlaces" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Confirmed: Your therapy session with ${therapistName}`,
      text: plainText
    });
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.toString() });
  }
}
