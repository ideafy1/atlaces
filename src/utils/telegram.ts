const BOT_TOKEN = '8556227951:AAFKtrnvIBa4ApwQ3_8D2mnMNTbh6-32EhI';
const ADMIN_CHAT_ID = '1188398532';
const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

interface BookingData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  therapistName: string;
  therapistTitle: string;
  date: string;
  time: string;
  format: string;
  duration?: string;
  concerns: string[];
  note?: string;
  price: number;
  therapistTelegramId?: string;
}

async function sendMessage(chatId: string, text: string): Promise<boolean> {
  if (!chatId) return false;
  try {
    const res = await fetch(`${API_BASE}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    const data = await res.json();
    return data.ok === true;
  } catch (err) {
    console.error('Telegram send error:', err);
    return false;
  }
}

export async function sendBookingNotifications(booking: BookingData): Promise<{ admin: boolean; therapist: boolean }> {
  const concernsList = booking.concerns.length > 0 ? booking.concerns.join(', ') : 'Not specified';

  // --- Admin notification ---
  const adminMsg =
`<b>New Booking!</b>

<b>Client:</b> ${booking.clientName}
<b>Email:</b> ${booking.clientEmail}
<b>Phone:</b> ${booking.clientPhone}

<b>Therapist:</b> ${booking.therapistName}
<b>Role:</b> ${booking.therapistTitle}
<b>Date:</b> ${booking.date}
<b>Time:</b> ${booking.time}
<b>Format:</b> ${booking.format}
${booking.duration ? `<b>Duration:</b> ${booking.duration}\n` : ''}<b>Price:</b> Rs.${booking.price.toLocaleString()}

<b>Concerns:</b> ${concernsList}
${booking.note ? `<b>Note:</b> ${booking.note}\n` : ''}
<i>- BrainHeal Booking System</i>`;

  // --- Therapist notification ---
  const therapistMsg =
`<b>New Session Booked!</b>

Hi <b>${booking.therapistName}</b>, you have a new booking:

<b>Client:</b> ${booking.clientName}
<b>Date:</b> ${booking.date}
<b>Time:</b> ${booking.time}
<b>Format:</b> ${booking.format}
${booking.duration ? `<b>Duration:</b> ${booking.duration}\n` : ''}<b>Concerns:</b> ${concernsList}
${booking.note ? `<b>Note:</b> ${booking.note}\n` : ''}
Please be available at the scheduled time. The client will reach out via the platform.

<i>- BrainHeal</i>`;

  const results = { admin: false, therapist: false };

  // Send to admin
  if (ADMIN_CHAT_ID) {
    results.admin = await sendMessage(ADMIN_CHAT_ID, adminMsg);
  }

  // Send to therapist
  if (booking.therapistTelegramId) {
    results.therapist = await sendMessage(booking.therapistTelegramId, therapistMsg);
  }

  return results;
}

export async function getAdminChatId(): Promise<string | null> {
  // Helper: Call getUpdates to find the admin's chat ID
  // Admin should message the bot first, then this can find their ID
  try {
    const res = await fetch(`${API_BASE}/getUpdates?limit=10`);
    const data = await res.json();
    if (data.ok && data.result?.length > 0) {
      // Return the most recent chat ID
      const lastUpdate = data.result[data.result.length - 1];
      return String(lastUpdate.message?.chat?.id || '');
    }
  } catch (err) {
    console.error('getUpdates error:', err);
  }
  return null;
}
