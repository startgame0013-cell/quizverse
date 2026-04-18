import express from 'express';
import rateLimit from 'express-rate-limit';
import geoip from 'geoip-lite';
import { protect, adminOnly } from '../middleware/auth.js';
import Suggestion from '../models/Suggestion.js';
import PageComment from '../models/PageComment.js';

const router = express.Router();

const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many submissions. Try again in a few minutes.' },
});

const commentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many comments. Try again later.' },
});

function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    req.ip ||
    ''
  );
}

router.post('/feedback', feedbackLimiter, async (req, res) => {
  try {
    const message = (req.body.message || '').trim();
    if (message.length < 4) {
      return res.status(400).json({ ok: false, error: 'Message is too short.' });
    }
    if (message.length > 4000) {
      return res.status(400).json({ ok: false, error: 'Message is too long.' });
    }
    const kind = ['suggestion', 'bug', 'other'].includes(req.body.kind) ? req.body.kind : 'suggestion';
    const email = (req.body.email || '').trim().slice(0, 200);
    const path = String(req.body.path || '').slice(0, 220);

    const ip = getClientIp(req);
    let country = '';
    let city = '';
    if (ip && ip !== '127.0.0.1' && ip !== '::1') {
      const g = geoip.lookup(ip);
      if (g) {
        country = g.country || '';
        city = g.city || '';
      }
    }

    await Suggestion.create({ kind, message, email, path, ip, country, city });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get('/feedback', protect, adminOnly, async (req, res) => {
  try {
    const items = await Suggestion.find()
      .sort({ createdAt: -1 })
      .limit(150)
      .select('kind message email path country city createdAt')
      .lean();
    res.json({ ok: true, items });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get('/comments', async (req, res) => {
  try {
    const pageKey = String(req.query.pageKey || '').trim().slice(0, 220);
    if (!pageKey) {
      return res.status(400).json({ ok: false, error: 'pageKey required' });
    }
    const list = await PageComment.find({ pageKey })
      .sort({ createdAt: -1 })
      .limit(40)
      .select('displayName body createdAt')
      .lean();
    res.json({ ok: true, comments: list });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post('/comments', commentLimiter, protect, async (req, res) => {
  try {
    const pageKey = String(req.body.pageKey || '').trim().slice(0, 220);
    const body = (req.body.body || '').trim();
    if (!pageKey || body.length < 2) {
      return res.status(400).json({ ok: false, error: 'Comment too short.' });
    }
    if (body.length > 800) {
      return res.status(400).json({ ok: false, error: 'Comment too long.' });
    }
    const displayName = (req.user.displayName || req.user.name || 'User').slice(0, 120);
    await PageComment.create({
      pageKey,
      user: req.user._id,
      displayName,
      body,
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
