// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(express.json());

// health check
app.get('/healthz', (req, res) => res.status(200).send('ok ✅'));

// สร้าง Checkout Session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Test Product',
            },
            unit_amount: 2000, // ราคาเป็นเซนต์ (2000 = $20)
          },
          quantity: 1,
        },
      ],
      success_url: 'https://gymgod-checkout.onrender.com/success',
cancel_url: 'https://gymgod-checkout.onrender.com/cancel',

    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(express.json());

// health check
app.get('/healthz', (req, res) => res.status(200).send('ok ✅'));

// สร้าง checkout session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID, // ไปสร้าง Price ID ใน Stripe dashboard
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// port
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.get('/success', (req, res) => {
  res.send('✅ Payment success! ขอบคุณที่ชำระเงิน');
});

app.get('/cancel', (req, res) => {
  res.send('❌ Payment cancelled. กลับไปลองใหม่อีกครั้งได้');
});
