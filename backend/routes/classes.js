import express from 'express';
import Class from '../models/Class.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

function randomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ ok: false, error: 'Teachers only' });
    }
    const { name, institutionName } = req.body;
    if (!name?.trim()) return res.status(400).json({ ok: false, error: 'Class name required' });
    let code;
    let exists = true;
    while (exists) {
      code = randomCode();
      exists = await Class.findOne({ code });
    }
    const cls = await Class.create({
      name: name.trim(),
      institutionName: typeof institutionName === 'string' ? institutionName.trim().slice(0, 200) : '',
      code,
      teacher: req.user._id,
    });
    res.status(201).json({ ok: true, class: cls });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? {}
      : req.user.role === 'teacher'
        ? { teacher: req.user._id }
        : { students: req.user._id };
    const classes = await Class.find(filter)
      .populate('teacher', 'name')
      .populate('students', 'name')
      .lean();
    res.json({ ok: true, classes });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post('/join', protect, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code?.trim()) return res.status(400).json({ ok: false, error: 'Code required' });
    const cls = await Class.findOne({ code: code.trim().toUpperCase() });
    if (!cls) return res.status(404).json({ ok: false, error: 'Class not found' });
    if (cls.students.some((s) => s.toString() === req.user._id.toString())) {
      return res.json({ ok: true, class: cls });
    }
    cls.students.push(req.user._id);
    await cls.save();
    res.json({ ok: true, class: cls });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
