import express from 'express'
import { protect } from '../middleware/auth.js'

const router = express.Router()
const PADDLE_API_KEY = process.env.PADDLE_API_KEY
const PADDLE_SANDBOX = process.env.PADDLE_SANDBOX !== 'false'
const PADDLE_BASE = PADDLE_SANDBOX ? 'https://sandbox-api.paddle.com' : 'https://api.paddle.com'
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://quizverse-lyart.vercel.app'

// Set in Render: PADDLE_PRICE_BASIC, PADDLE_PRICE_PRO, PADDLE_PRICE_SCHOOL (pri_xxx)
const PRICE_IDS = {
  basic: process.env.PADDLE_PRICE_BASIC,
  pro: process.env.PADDLE_PRICE_PRO,
  school: process.env.PADDLE_PRICE_SCHOOL,
}

router.post('/create-checkout', protect, async (req, res) => {
  try {
    if (!PADDLE_API_KEY) {
      return res.status(503).json({
        ok: false,
        error: 'Payment not configured. Add PADDLE_API_KEY in Render environment.',
      })
    }

    const { plan } = req.body
    if (!plan || !['basic', 'pro', 'school'].includes(plan)) {
      return res.status(400).json({ ok: false, error: 'Invalid plan. Use basic, pro, or school.' })
    }

    const priceId = PRICE_IDS[plan]
    if (!priceId || !priceId.startsWith('pri_')) {
      return res.status(503).json({
        ok: false,
        error: `Plan not configured. Add PADDLE_PRICE_${plan.toUpperCase()} in Render. See PADDLE_GUIDE_AR.md`,
      })
    }

    const body = {
      items: [{ price_id: priceId, quantity: 1 }],
      custom_data: { user_id: String(req.user._id), plan },
      collection_mode: 'automatic',
    }

    const paddleRes = await fetch(`${PADDLE_BASE}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PADDLE_API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    const data = await paddleRes.json()

    if (!paddleRes.ok) {
      console.error('Paddle error:', data)
      return res.status(500).json({
        ok: false,
        error: data?.error?.detail || data?.error?.code || 'Paddle checkout failed',
      })
    }

    const checkoutUrl = data?.data?.checkout?.url
    if (!checkoutUrl) {
      return res.status(500).json({
        ok: false,
        error: 'No checkout URL from Paddle. Check your product/price setup.',
      })
    }

    res.json({ ok: true, url: checkoutUrl })
  } catch (err) {
    console.error('Paddle checkout error:', err.message)
    res.status(500).json({ ok: false, error: err.message || 'Checkout failed' })
  }
})

export default router
