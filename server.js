const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Config (set these in Render dashboard)
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBHOOK_URL = 'https://webhook-oe98.onrender.com/webhook';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// [1] Initialize webhook (call this once after deployment)
app.get('/set-webhook', async (req, res) => {
  try {
    const response = await axios.get(
      `${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`
    );
    res.json({ 
      status: 'Webhook set successfully',
      details: response.data 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [2] Main webhook handler
app.post('/webhook', (req, res) => {
  const { message } = req.body;
  
  // Echo back messages
  if (message?.text) {
    axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: message.chat.id,
      text: `You said: "${message.text}"`
    }).catch(e => console.error('Error sending reply:', e));
  }
  
  res.sendStatus(200);
});

// [3] Basic health check
app.get('/', (req, res) => res.send('Bot is alive!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
