import express from 'express'
import GameSession from '../models/GameSession.js'

const router = express.Router()

function generatePin() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

// Create game session (host)
router.post('/create', async (req, res) => {
  try {
    const { quizId, quizTitle, quizData, hostName } = req.body
    if (!quizId || !quizData?.questions?.length) {
      return res.status(400).json({ ok: false, error: 'quizId and quizData.questions required' })
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
