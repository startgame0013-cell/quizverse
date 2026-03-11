# Stripe Setup for Subscriptions

To accept payments for Basic, Pro, and School plans:

## 1. Create Stripe Account
- Go to [stripe.com](https://stripe.com) and sign up
- Get your API keys from Dashboard → Developers → API keys

## 2. Install Stripe
```bash
cd backend && npm install stripe
```

## 3. Environment Variables
Add to `backend/.env`:
```
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx  # for webhooks
```

Add to frontend (Vite env or config):
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

## 4. Create Products in Stripe Dashboard
- Products → Add product
- Create: Basic ($2.99/mo), Pro ($6.99/mo), School ($11.99/mo)
- Use recurring pricing (monthly)
- Copy the Price IDs (price_xxx)

## 5. Backend: Create Checkout Session
Add `backend/routes/subscription.js`:
```js
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

router.post('/create-checkout', authMiddleware, async (req, res) => {
  const { plan } = req.body  // basic | pro | school
  const priceId = { basic: 'price_xxx', pro: 'price_xxx', school: 'price_xxx' }[plan]
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${FRONTEND_URL}/pricing?success=true`,
    cancel_url: `${FRONTEND_URL}/pricing?canceled=true`,
    customer_email: req.user.email,
    metadata: { userId: req.user.id, plan }
  })
  res.json({ url: session.url })
})
```

## 6. Webhook: Update User Plan
When Stripe sends `customer.subscription.updated` or `invoice.paid`, update the user's `plan` and `planExpiresAt` in your database.

## 7. Frontend: Subscribe Button
On Pricing page, when user clicks Subscribe:
```js
const res = await fetch(`${API}/api/subscription/create-checkout`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({ plan: 'pro' })
})
const { url } = await res.json()
window.location.href = url  // Redirect to Stripe Checkout
```
