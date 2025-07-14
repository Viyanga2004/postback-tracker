// postback.js

const express = require('express');
const fetch = require('node-fetch'); // node-fetch@2.x භාවිතා කරන්න

const app = express();

// Telegram Bot Config - ඔබේ Bot Token සහ Chat ID මෙහි දාන්න
const TELEGRAM_BOT_TOKEN = '7315436305:AAFnmm9knVTivy-pFXZ5jKvZvUwRzsktVnY';
const TELEGRAM_CHAT_ID = '1224604737';

app.get('/postback', async (req, res) => {
  // Console log කරලා පැහැදිලිව බලන්න එන query parameters
  console.log('Received query params:', req.query);

  // පොස්ට්බැක් වල වඩාත්ම පාවිච්චි වෙන නම තියෙන param එකක් ගන්නවා
  const clickId = req.query.clickid || req.query.subID || req.query.leadID || 'N/A';
  const offerID = req.query.offerID || 'N/A';

  // payout හෝ amount param එකක් ගන්නවා
  const payout = req.query.payout || req.query.amount || '0.00';

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';
  const geo = req.headers['cf-ipcountry'] || 'Unknown';

  // Telegram message format එක
  const message =
    `✅ *New Conversion!*\n\n` +
    `🆔 Click ID: \`${clickId}\`\n` +
    `🎯 Offer ID: \`${offerID}\`\n` +
    `💰 Payout: \`$${payout}\`\n` +
    `🌍 IP: \`${ip}\`\n` +
    `🌐 Country: \`${geo}\``;

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();
    console.log('Telegram API response:', data);

    if (!response.ok) {
      console.error('Failed to send Telegram message:', data);
      return res.status(500).send('Failed to send Telegram message');
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Telegram Error:', error);
    res.sendStatus(500);
  }
});

const PORT = 2000;
app.listen(PORT, () => {
  console.log(`🟢 Postback server running on http://localhost:${PORT}/postback`);
});
