import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test endpoint to check if server is running
app.get('/', (req, res) => {
  res.send('Backend Server is running.');
});

// API Endpoint to send email
app.post('/api/send-email', async (req, res) => {
  const { toEmail, bookingId } = req.body;

  if (!toEmail) {
    return res.status(400).json({ success: false, message: 'toEmail is required' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Your Therapy Session is Confirmed!',
    html: `
      <h2>Hello!</h2>
      <p>Your booking is confirmed.</p>
      <p>Your unique meeting link: <b><a href="http://localhost:3000/meeting/${bookingId}">Click here to join the session</a></b></p>
      <br/>
      <p>Please keep this email safe. You can click the link above when it's time for your session.</p>
      <br/>
      <p>Thanks,<br/>The BrainHeal Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${toEmail}`);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.toString() });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
