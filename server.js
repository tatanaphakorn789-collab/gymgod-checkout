require('dotenv').config();
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(express.json());

// health check
app.get('/healthz', (_req, res) => res.status(200).send('ok ✅'));

// checkout session
app.post('/create-checkout-session', async (_req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        { price: process.env.STRIPE_PRICE_ID, quantity: 1 }
      ],
      success_url: 'https://gymgod-checkout.onrender.com/success',
      cancel_url:  'https://gymgod-checkout.onrender.com/cancel',
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/success', (_req, res) => res.send('✅ Payment success!'));
app.get('/cancel',  (_req, res) => res.send('❌ Payment cancelled.'));

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
