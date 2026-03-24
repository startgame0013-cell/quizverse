import express from 'express'
import mongoose from 'mongoose'
import { protect } from '../middleware/auth.js'
import User from '../models/User.js'
import { verifyPaddleWebhookSignature } from '../lib/paddleWebhookVerify.js'

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

function isPriceConfigured(id) {
  return typeof id === 'string' && id.startsWith('pri_')
}

/** Public: which Paddle prices are set (for pricing UI). */
router.get('/plans', (req, res) => {
  const paddle = !!PADDLE_API_KEY
  res.json({
    ok: true,
    paddle,
    plans: {
      basic: paddle && isPriceConfigured(PRICE_IDS.basic),
      pro: paddle && isPriceConfigured(PRICE_IDS.pro),
      school: paddle && isPriceConfigured(PRICE_IDS.school),
    },
  })
})

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

    if (plan === 'school' && req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        ok: false,
        code: 'SCHOOL_TEACHERS_ONLY',
        error:
          'School plan is for teacher or admin accounts. Sign up as a teacher or ask your school admin.',
      })
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

const VALID_PLANS = new Set(['basic', 'pro', 'school'])

function priceIdToPlan(priceId) {
  if (!priceId) return null
  for (const plan of ['basic', 'pro', 'school']) {
    if (PRICE_IDS[plan] === priceId) return plan
  }
  return null
}

function getPriceIdFromEntity(entity) {
  return entity?.items?.[0]?.price?.id || entity?.items?.[0]?.price_id || null
}

/** @param {import('mongoose').Types.ObjectId | string} userId */
async function downgradeUser(userId) {
  await User.findByIdAndUpdate(userId, { plan: 'free', planExpiresAt: null })
}

/**
 * Applies Paddle Billing webhook payloads: transaction.completed, subscription.*.
 * Relies on `custom_data.user_id` + `custom_data.plan` from checkout, or maps Price ID via env.
 */
export async function processPaddleWebhookEvent(event) {
  const eventType = event?.event_type
  const entity = event?.data
  if (!entity || !eventType) return

  const custom = entity.custom_data && typeof entity.custom_data === 'object' ? entity.custom_data : {}
  let userId = custom.user_id || custom.userId
  let plan = custom.plan

  const priceId = getPriceIdFromEntity(entity)
  if (!plan && priceId) plan = priceIdToPlan(priceId)

  const canceled =
    eventType === 'subscription.canceled' ||
    (String(eventType).startsWith('subscription.') && entity.status === 'canceled')

  if (canceled) {
    if (userId && mongoose.Types.ObjectId.isValid(String(userId))) {
      await downgradeUser(userId)
    } else {
      console.warn('Paddle webhook: subscription canceled but user_id missing in custom_data')
    }
    return
  }

  if (!userId || !mongoose.Types.ObjectId.isValid(String(userId))) {
    console.warn('Paddle webhook: missing or invalid user_id', eventType)
    return
  }
  if (!plan || !VALID_PLANS.has(plan)) {
    console.warn('Paddle webhook: missing or invalid plan', eventType, plan)
    return
  }

  let planExpiresAt = null
  if (entity.next_billed_at) planExpiresAt = new Date(entity.next_billed_at)
  else if (entity.current_billing_period?.ends_at) planExpiresAt = new Date(entity.current_billing_period.ends_at)
  else if (eventType === 'transaction.completed') {
    planExpiresAt = new Date(Date.now() + 32 * 24 * 60 * 60 * 1000)
  }

  await User.findByIdAndUpdate(userId, { plan, planExpiresAt })
}

/**
 * Raw-body POST handler — mount with `express.raw({ type: 'application/json' })` before `express.json()`.
 */
export async function handlePaddleWebhook(req, res) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET
  if (!secret) {
    console.error('PADDLE_WEBHOOK_SECRET is not set')
    return res.status(503).json({ ok: false, error: 'Webhook not configured' })
  }

  const sig = req.headers['paddle-signature']
  const raw = req.body
  if (!Buffer.isBuffer(raw)) {
    return res.status(500).json({ ok: false, error: 'Invalid body' })
  }
  if (!verifyPaddleWebhookSignature(raw, sig, secret)) {
    return res.status(400).json({ ok: false, error: 'Invalid signature' })
  }

  let event
  try {
    event = JSON.parse(raw.toString('utf8'))
  } catch {
    return res.status(400).json({ ok: false, error: 'Invalid JSON' })
  }

  try {
    await processPaddleWebhookEvent(event)
  } catch (e) {
    console.error('Paddle webhook processing error:', e)
    return res.status(500).json({ ok: false, error: 'Processing failed' })
  }

  return res.status(200).json({ ok: true })
}

export default router
