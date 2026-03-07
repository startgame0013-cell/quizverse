import express from 'express';
import Score from '../models/Score.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { quizId, classId, score, total, timeSpent } = req.body;
    if (!quizId || typeof score !== 'number' || typeof total !== 'number') {
      return res.status(400).json({ ok: false, error: 'quizId, score, total required' });
    }
    const record = await Score.create({
      user: req.user._id,
      quiz: quizId,
      class: classId || null,
      score: Math.min(score, total),
      total,
      timeSpent: Number(timeSpent) || 0,
    });
    res.status(201).json({ ok: true, score: record });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get('/leaderboard/:quizId', async (req, res) => {
  try {
    const list = await Score.find({ quiz: req.params.quizId })
      .populate('user', 'name')
      .sort({ score: -1, timeSpent: 1 })
      .limit(50)
      .lean();
    res.json({ ok: true, leaderboard: list });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
