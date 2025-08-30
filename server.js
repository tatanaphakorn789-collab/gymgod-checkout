// server.js
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// หน้าแรก
app.get('/', (req, res) => res.send('Server is running OK ✅'));

// health check
app.get('/healthz', (req, res) => res.status(200).send('OK ✅'));

// debug env (เช็คว่ามี key ไหม)
app.get('/debug/env', (req, res) => {
  res.json({ hasStripeKey: !!process.env.STRIPE_SECRET_KEY });
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
