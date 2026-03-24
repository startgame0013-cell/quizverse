import express from 'express'
import User from '../models/User.js'
import SoloQuizAttempt from '../models/SoloQuizAttempt.js'
import { protect } from '../middleware/auth.js'
import { levelFromXp, nextLevelXpThreshold } from '../lib/gamification.js'

const router = express.Router()

function publicName(u) {
  if (!u) return 'Player'
  return (u.displayName || '').trim() || u.name || 'Player'
}

router.get('/me', protect, async (req, res) => {
  try {
    const u = await User.findById(req.user._id).lean()
    if (!u) return res.status(404).json({ ok: false, error: 'User not found' })
    const xp = u.xp ?? 0
    const level = u.level ?? levelFromXp(xp)
    res.json({
      ok: true,
      xp,
      level,
      streak: u.streak ?? 0,
      lastPlayDay: u.lastPlayDay || '',
      teamCode: u.teamCode || '',
      nextLevelAt: nextLevelXpThreshold(level),
    })
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message })
  }
})

router.put('/team', protect, async (req, res) => {
  try {
    let raw = req.body?.teamCode
    if (raw === undefined || raw === null) raw = ''
    const code = String(raw).trim().toUpperCase().slice(0, 12)
    if (code && !/^[A-Z0-9]{2,12}$/.test(code)) {
      return res.status(400).json({ ok: false, error: 'Team code: 2–12 letters or numbers' })
    }
    await User.findByIdAndUpdate(req.user._id, { teamCode: code })
    res.json({ ok: true, teamCode: code })
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message })
  }
})

router.get('/leaderboard/global', async (req, res) => {
  try {
    const limit = Math.min(100, Math.max(5, parseInt(req.query.limit, 10) || 50))
    const rows = await User.find({ xp: { $gt: 0 } })
      .sort({ xp: -1 })
      .limit(limit)
      .select('displayName name xp level streak teamCode')
      .lean()
    const leaderboard = rows.map((r, i) => ({
      rank: i + 1,
      id: String(r._id),
      name: publicName(r),
      xp: r.xp ?? 0,
      level: r.level ?? 1,
      streak: r.streak ?? 0,
      teamCode: r.teamCode || '',
    }))
    res.json({ ok: true, leaderboard })
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message })
  }
})

router.get('/leaderboard/week', async (req, res) => {
  try {
    const limit = Math.min(100, Math.max(5, parseInt(req.query.limit, 10) || 50))
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const agg = await SoloQuizAttempt.aggregate([
      { $match: { createdAt: { $gte: since }, xpEarned: { $gt: 0 } } },
      { $group: { _id: '$user', weekXp: { $sum: '$xpEarned' } } },
      { $sort: { weekXp: -1 } },
      { $limit: limit },
    ])
    const ids = agg.map((a) => a._id)
    const users = await User.find({ _id: { $in: ids } }).select('displayName name').lean()
    const um = new Map(users.map((u) => [String(u._id), u]))
    const leaderboard = agg.map((a, i) => {
      const u = um.get(String(a._id))
      return {
        rank: i + 1,
        id: String(a._id),
        name: u ? publicName(u) : 'Player',
        xp: a.weekXp,
        weekXp: a.weekXp,
      }
    })
    res.json({ ok: true, leaderboard })
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message })
  }
})

router.get('/leaderboard/teams', async (req, res) => {
  try {
    const limit = Math.min(100, Math.max(5, parseInt(req.query.limit, 10) || 30))
    const agg = await User.aggregate([
      { $match: { teamCode: { $exists: true, $nin: ['', null] } } },
      { $group: { _id: '$teamCode', totalXp: { $sum: '$xp' }, members: { $sum: 1 } } },
      { $sort: { totalXp: -1 } },
      { $limit: limit },
    ])
    const leaderboard = agg.map((a, i) => ({
      rank: i + 1,
      teamCode: a._id,
      name: a._id,
      members: a.members,
      xp: a.totalXp,
    }))
    res.json({ ok: true, leaderboard })
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message })
  }
})

export default router
