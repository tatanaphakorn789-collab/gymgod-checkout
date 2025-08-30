// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(express.json());

// route หลัก
app.get('/', (req, res) => res.send('Server is running OK ✅'));

// health check
app.get('/healthz', (req, res) => res.status(200).send('OK ✅'));

// debug env (เช็คว่า key โหลดมารึยัง)
app.get('/debug/env', (req, res) => {
  res.json({ hasStripeKey: !!process.env.STRIPE_SECRET_KEY });
});

// checkout session (Stripe)
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
              name: 'Gymgod eBook',
            },
            unit_amount: 500, // ราคา 5.00 USD = 500 cents
          },
          quantity: 1,
        },
      ],
      success_url: 'https://your-domain.com/success',
      cancel_url: 'https://your-domain.com/cancel',
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
