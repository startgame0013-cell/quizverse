import express from 'express';
import Quiz from '../models/Quiz.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isPublic: true })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ ok: true, quizzes });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/** Logged-in user's quizzes (MongoDB) — must be before /:id */
router.get('/mine', protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id }).sort({ updatedAt: -1 }).lean();
    res.json({ ok: true, quizzes });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name').lean();
    if (!quiz) return res.status(404).json({ ok: false, error: 'Quiz not found' });
    res.json({ ok: true, quiz });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { title, titleAr, description, descriptionAr, questions, category, language, isPublic } = req.body;
    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ ok: false, error: 'Title and at least one question required' });
    }
    let totalTime = 0;
    const validated = questions.map((q) => {
      totalTime += Number(q.timeLimit) || 30;
      return {
        question: q.question || '',
        questionAr: q.questionAr || '',
        options: Array.isArray(q.options) ? q.options : [],
        correctIndex: Math.max(0, parseInt(q.correctIndex, 10) || 0),
        timeLimit: Number(q.timeLimit) || 30,
      };
    });
    const quiz = await Quiz.create({
      title,
      titleAr: titleAr || '',
      description: description || '',
      descriptionAr: descriptionAr || '',
      createdBy: req.user._id,
      questions: validated,
      category: category || 'general',
      language: language || 'en',
      isPublic: isPublic !== false,
      totalTime,
    });
    res.status(201).json({ ok: true, quiz });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ ok: false, error: 'Quiz not found' });
    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ ok: false, error: 'Not allowed' });
    }
    const { title, titleAr, description, descriptionAr, questions, category, language, isPublic } = req.body;
    if (title) quiz.title = title;
    if (titleAr !== undefined) quiz.titleAr = titleAr;
    if (description !== undefined) quiz.description = description;
    if (descriptionAr !== undefined) quiz.descriptionAr = descriptionAr;
    if (category !== undefined) quiz.category = category;
    if (language !== undefined) quiz.language = language;
    if (isPublic !== undefined) quiz.isPublic = isPublic;
    if (Array.isArray(questions) && questions.length > 0) {
      quiz.questions = questions.map((q) => ({
        question: q.question || '',
        questionAr: q.questionAr || '',
        options: Array.isArray(q.options) ? q.options : [],
        correctIndex: Math.max(0, parseInt(q.correctIndex, 10) || 0),
        timeLimit: Number(q.timeLimit) || 30,
      }));
      quiz.totalTime = quiz.questions.reduce((s, q) => s + (q.timeLimit || 30), 0);
    }
    await quiz.save();
    res.json({ ok: true, quiz });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ ok: false, error: 'Quiz not found' });
    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ ok: false, error: 'Not allowed' });
    }
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
