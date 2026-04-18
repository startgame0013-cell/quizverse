import express from 'express';
import geoip from 'geoip-lite';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';
import Class from '../models/Class.js';
import Visit from '../models/Visit.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [quizzes, players, schools] = await Promise.all([
      Quiz.countDocuments(),
      User.countDocuments(),
      Class.countDocuments(),
    ]);
    res.json({ ok: true, quizzes, players, schools });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    req.ip ||
    '';
}

router.post('/visit', async (req, res) => {
  try {
    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || '';
    const path = req.body.path || '/';
    const referrer = req.body.referrer || '';

    let country = '';
    let city = '';
    if (ip && ip !== '127.0.0.1' && ip !== '::1') {
      const geo = geoip.lookup(ip);
      if (geo) {
        country = geo.country || '';
        city = geo.city || '';
      }
    }

    await Visit.create({
      ip,
      country,
      city,
      userAgent,
      path,
      referrer,
    });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get('/visits', async (req, res) => {
  try {
    const total = await Visit.countDocuments();

    const byCountry = await Visit.aggregate([
      { $match: { country: { $ne: '' } } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    const recent = await Visit.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select('country city path createdAt')
      .lean();

    const countryNames = {
      KW: 'Kuwait', SA: 'Saudi Arabia', AE: 'UAE', BH: 'Bahrain', OM: 'Oman', QA: 'Qatar',
      EG: 'Egypt', JO: 'Jordan', LB: 'Lebanon', SY: 'Syria', IQ: 'Iraq', IR: 'Iran',
      US: 'USA', GB: 'UK', IN: 'India', PK: 'Pakistan', BD: 'Bangladesh',
      MA: 'Morocco', DZ: 'Algeria', TN: 'Tunisia', YE: 'Yemen', PS: 'Palestine',
      TR: 'Turkey', DE: 'Germany', FR: 'France', ES: 'Spain', IT: 'Italy', NL: 'Netherlands',
      CA: 'Canada', AU: 'Australia', PH: 'Philippines', NG: 'Nigeria', KE: 'Kenya',
    };

    res.json({
      ok: true,
      total,
      byCountry: byCountry.map((r) => ({
        country: countryNames[r._id] || r._id,
        code: r._id,
        count: r.count,
      })),
      recent: recent.map((v) => ({
        path: v.path,
        city: v.city || '',
        country: countryNames[v.country] || v.country || '-',
        countryCode: v.country || '',
        createdAt: v.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
