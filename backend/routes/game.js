import express from 'express'
import jwt from 'jsonwebtoken'
import GameSession from '../models/GameSession.js'
import User from '../models/User.js'
import Class from '../models/Class.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'quizverse-secret'

function generatePin() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

// Create game session (host). Optional classId: requires Bearer token; must be class teacher.
router.post('/create', async (req, res) => {
  try {
    const { quizId, quizTitle, quizData, hostName, classId: classIdBody } = req.body
    if (!quizId || !quizData?.questions?.length) {
      return res.status(400).json({ ok: false, error: 'quizId and quizData.questions required' })
    }
    let resolvedClassId = null
    if (classIdBody) {
      const authHeader = req.headers.authorization
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
      if (!token) {
        return res.status(401).json({ ok: false, error: 'Sign in required to attach a class to this session' })
      }
      try {
        const decoded = jwt.verify(token, JWT_SECRET)
        const user = await User.findById(decoded.id)
        if (!user) return res.status(401).json({ ok: false, error: 'Invalid token' })
        const cls = await Class.findById(classIdBody)
        if (!cls || String(cls.teacher) !== String(user._id)) {
          return res.status(403).json({ ok: false, error: 'You can only link your own classes' })
        }
        resolvedClassId = cls._id
      } catch {
        return res.status(401).json({ ok: false, error: 'Invalid token' })
      }
    }
    let pin = generatePin()
    let exists = await GameSession.findOne({ pin, status: { $in: ['waiting', 'playing'] } })
    let attempts = 0
    while (exists && attempts < 10) {
      pin = generatePin()
      exists = await GameSession.findOne({ pin, status: { $in: ['waiting', 'playing'] } })
      attempts++
    }
    const session = await GameSession.create({
      pin,
      classId: resolvedClassId,
      quizId,
      quizTitle: quizTitle || quizData?.title || 'Quiz',
      quizData,
      hostName: hostName || 'Host',
      status: 'waiting',
    })
    res.json({ ok: true, pin: session.pin, sessionId: session._id })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

// Join game (student)
router.post('/join', async (req, res) => {
  try {
    const { pin, nickname } = req.body
    if (!pin || !nickname?.trim()) {
      return res.status(400).json({ ok: false, error: 'pin and nickname required' })
    }
    const session = await GameSession.findOne({ pin: String(pin).trim(), status: 'waiting' })
    if (!session) {
      return res.status(404).json({ ok: false, error: 'Game not found or already started' })
    }
    const player = { nickname: nickname.trim().slice(0, 20), score: 0 }
    session.players.push(player)
    await session.save()
    const io = req.app.get('io')
    if (io) {
      const players = session.players.map((p, i) => ({ index: i, nickname: p.nickname }))
      io.to(`game:${session.pin}`).emit('game:players', { players })
    }
    res.json({ ok: true, sessionId: session._id, playerIndex: session.players.length - 1 })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

// Get session by PIN
router.get('/session/:pin', async (req, res) => {
  try {
    const session = await GameSession.findOne({ pin: req.params.pin })
    if (!session) {
      return res.status(404).json({ ok: false, error: 'Game not found' })
    }
    res.json({
      ok: true,
      session: {
        pin: session.pin,
        quizTitle: session.quizTitle,
        hostName: session.hostName,
        status: session.status,
        playersCount: session.players?.length || 0,
        players: (session.players || []).map((p, i) => ({ index: i, nickname: p.nickname })),
        currentQuestionIndex: session.currentQuestionIndex,
        quizData: session.quizData,
      },
    })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

export default router
