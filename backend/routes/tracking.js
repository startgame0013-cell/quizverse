import express from 'express'
import mongoose from 'mongoose'
import Class from '../models/Class.js'
import SoloQuizAttempt from '../models/SoloQuizAttempt.js'
import GameSession from '../models/GameSession.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

function isTeacherOfClass(user, cls) {
  if (user.role === 'admin') return true
  return String(cls.teacher) === String(user._id)
}

/**
 * Institutional dashboard: all cloud-tracked solo attempts + ended live sessions for a class.
 * Teacher of class or admin only.
 */
router.get('/class/:classId', protect, async (req, res) => {
  try {
    const { classId } = req.params
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ ok: false, error: 'Invalid class id' })
    }
    const cls = await Class.findById(classId)
      .populate('teacher', 'name email')
      .populate('students', 'name email displayName externalStudentId')
      .lean()
    if (!cls) return res.status(404).json({ ok: false, error: 'Class not found' })
    if (!isTeacherOfClass(req.user, cls)) {
      return res.status(403).json({ ok: false, error: 'Forbidden' })
    }

    const solos = await SoloQuizAttempt.find({ classId: cls._id })
      .populate('user', 'name email displayName externalStudentId')
      .sort({ createdAt: -1 })
      .limit(500)
      .lean()

    const liveSessions = await GameSession.find({ classId: cls._id, status: 'ended' })
      .sort({ endedAt: -1 })
      .limit(100)
      .lean()

    const studentIds = new Set((cls.students || []).map((s) => String(s._id || s)))
    const soloByStudent = {}
    for (const s of solos) {
      const uid = String(s.user?._id || s.user)
      if (!soloByStudent[uid]) soloByStudent[uid] = []
      soloByStudent[uid].push(s)
    }

    res.json({
      ok: true,
      class: {
        _id: cls._id,
        name: cls.name,
        institutionName: cls.institutionName || '',
        code: cls.code,
        students: cls.students,
      },
      solos,
      soloByStudent,
      liveSessions,
      counts: {
        soloAttempts: solos.length,
        liveSessions: liveSessions.length,
        studentsInClass: studentIds.size,
      },
    })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

/**
 * Per-quiz breakdown for a class (solo attempts only, by quizId string).
 */
router.get('/class/:classId/quiz/:quizId', protect, async (req, res) => {
  try {
    const { classId, quizId } = req.params
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ ok: false, error: 'Invalid class id' })
    }
    const cls = await Class.findById(classId).lean()
    if (!cls) return res.status(404).json({ ok: false, error: 'Class not found' })
    if (!isTeacherOfClass(req.user, cls)) {
      return res.status(403).json({ ok: false, error: 'Forbidden' })
    }
    const attempts = await SoloQuizAttempt.find({ classId: cls._id, quizId })
      .populate('user', 'name email displayName externalStudentId')
      .sort({ createdAt: -1 })
      .lean()

    const byQuestion = {}
    for (const att of attempts) {
      for (const r of att.responses || []) {
        const qi = r.questionIndex
        if (!byQuestion[qi]) {
          byQuestion[qi] = { questionIndex: qi, correct: 0, wrong: 0, totalMs: 0, n: 0 }
        }
        byQuestion[qi].n += 1
        if (r.correct) byQuestion[qi].correct += 1
        else byQuestion[qi].wrong += 1
        byQuestion[qi].totalMs += r.timeMs || 0
      }
    }

    const byQuestionList = Object.values(byQuestion).sort((a, b) => a.questionIndex - b.questionIndex)
    res.json({ ok: true, quizId, attempts, byQuestion: byQuestionList })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

export default router
