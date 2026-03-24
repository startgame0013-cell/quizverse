import express from 'express'
import mongoose from 'mongoose'
import GameSession from '../models/GameSession.js'
import SoloQuizAttempt from '../models/SoloQuizAttempt.js'
import Quiz from '../models/Quiz.js'
import Class from '../models/Class.js'
import { protect } from '../middleware/auth.js'
import { awardSoloXp } from '../lib/gamification.js'

const router = express.Router()

/** Solo practice — logged-in user only. Idempotent via sessionKey. */
router.post('/solo', protect, async (req, res) => {
  try {
    const { quizId, quizTitle, sessionKey, score, total, timeSpentSec, responses, classId: classIdBody } = req.body
    if (!quizId || !sessionKey || !Array.isArray(responses)) {
      return res.status(400).json({ ok: false, error: 'quizId, sessionKey, responses[] required' })
    }
    let classId = null
    if (classIdBody && mongoose.Types.ObjectId.isValid(String(classIdBody))) {
      const cls = await Class.findById(classIdBody)
      if (!cls) {
        return res.status(400).json({ ok: false, error: 'Class not found' })
      }
      const sid = String(req.user._id)
      const inClass = (cls.students || []).some((s) => String(s) === sid)
      if (!inClass && req.user.role !== 'admin') {
        return res.status(403).json({ ok: false, error: 'You must be enrolled in this class to attach attempts' })
      }
      classId = cls._id
    }
    const existing = await SoloQuizAttempt.findOne({ user: req.user._id, sessionKey: String(sessionKey) })
    if (existing) {
      return res.json({ ok: true, id: existing._id, duplicate: true })
    }
    let gamification = null
    const rec = await SoloQuizAttempt.create({
      user: req.user._id,
      quizId: String(quizId),
      quizTitle: (quizTitle || '').slice(0, 500),
      sessionKey: String(sessionKey),
      score: Math.max(0, Number(score) || 0),
      total: Math.max(1, Number(total) || 1),
      timeSpentSec: Math.max(0, Number(timeSpentSec) || 0),
      classId,
      responses: responses.map((r) => ({
        questionIndex: Number(r.questionIndex),
        questionId: String(r.questionId || ''),
        answerIndex: Number(r.answerIndex),
        correct: !!r.correct,
        timeMs: Math.max(0, Number(r.timeMs) || 0),
      })),
    })
    try {
      gamification = await awardSoloXp(req.user._id, Math.max(0, Number(score) || 0), Math.max(1, Number(total) || 1))
      if (gamification?.xpEarned != null) {
        await SoloQuizAttempt.findByIdAndUpdate(rec._id, { xpEarned: gamification.xpEarned })
      }
    } catch (e) {
      console.error('gamification award failed', e.message)
    }
    res.status(201).json({ ok: true, id: rec._id, gamification })
  } catch (err) {
    if (err?.code === 11000) {
      return res.json({ ok: true, duplicate: true })
    }
    res.status(500).json({ ok: false, error: err.message })
  }
})

/** Current user's attempts for one quiz (localStorage quiz id or Mongo id string). */
router.get('/solo/quiz/:quizId', protect, async (req, res) => {
  try {
    const list = await SoloQuizAttempt.find({ user: req.user._id, quizId: req.params.quizId })
      .sort({ createdAt: -1 })
      .lean()
    res.json({ ok: true, attempts: list })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

/**
 * Teacher: all solo attempts for a quiz stored in Mongo (owner only).
 * Local-only quiz ids cannot be verified server-side — use live report by PIN instead.
 */
router.get('/solo/for-quiz/:quizId', protect, async (req, res) => {
  try {
    const qid = req.params.quizId
    if (!mongoose.Types.ObjectId.isValid(qid)) {
      return res.status(400).json({
        ok: false,
        error: 'Cloud quiz id (MongoDB) required for class-wide solo reports.',
      })
    }
    const quiz = await Quiz.findById(qid).lean()
    if (!quiz || String(quiz.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ ok: false, error: 'Forbidden' })
    }
    const attempts = await SoloQuizAttempt.find({ quizId: qid })
      .populate('user', 'name email displayName')
      .sort({ createdAt: -1 })
      .lean()
    res.json({ ok: true, attempts })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

/**
 * Live game — per-player, per-question breakdown after session ended.
 * PIN acts as secret; only call after game ended.
 */
router.get('/live/:pin', async (req, res) => {
  try {
    const pin = String(req.params.pin || '').trim()
    if (!pin) return res.status(400).json({ ok: false, error: 'pin required' })
    const session = await GameSession.findOne({ pin }).lean()
    if (!session) return res.status(404).json({ ok: false, error: 'Session not found' })
    if (session.status !== 'ended') {
      return res.status(400).json({ ok: false, error: 'Report available after the game has ended' })
    }
    const questions = session.quizData?.questions || []
    const players = session.players || []
    const answers = session.answers || []

    const byPlayer = players.map((p, pIdx) => {
      const mine = answers.filter((a) => String(a.playerId) === String(pIdx))
      const perQ = questions.map((_, qi) => {
        const hit = [...mine].reverse().find((a) => a.questionIndex === qi)
        return {
          questionIndex: qi,
          answerIndex: hit?.answerIndex ?? null,
          correct: hit ? !!hit.correct : null,
          timeTaken: hit?.timeTaken ?? null,
        }
      })
      return {
        playerIndex: pIdx,
        nickname: p.nickname,
        score: p.score,
        perQuestion: perQ,
      }
    })

    const byQuestion = questions.map((q, qi) => {
      const forQ = answers.filter((a) => a.questionIndex === qi)
      return {
        questionIndex: qi,
        text: (q.text || q.question || '').slice(0, 200),
        correctIndex: q.correctIndex,
        responses: forQ.map((a) => ({
          nickname: a.nickname,
          playerId: a.playerId,
          answerIndex: a.answerIndex,
          correct: a.correct,
          timeTaken: a.timeTaken,
        })),
      }
    })

    const legacyAnswersWithoutQuestionIndex = answers.filter((a) => a.questionIndex == null).length

    res.json({
      ok: true,
      report: {
        pin: session.pin,
        quizTitle: session.quizTitle,
        quizId: session.quizId,
        endedAt: session.endedAt,
        players: players.map((p, i) => ({ index: i, nickname: p.nickname, score: p.score })),
        questionCount: questions.length,
        byPlayer,
        byQuestion,
        legacyAnswersWithoutQuestionIndex,
      },
    })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

export default router
