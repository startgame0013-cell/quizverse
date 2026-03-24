import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'quizverse-secret';

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'student', displayName, externalStudentId } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ ok: false, error: 'Name, email and password required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ ok: false, error: 'Email already registered' });
    const user = await User.create({
      name,
      email,
      password,
      role,
      displayName: (displayName || '').trim() || undefined,
      externalStudentId: typeof externalStudentId === 'string' ? externalStudentId.trim().slice(0, 64) : '',
    });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    const publicName = user.displayName || user.name;
    res.status(201).json({
      ok: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        displayName: publicName,
        email: user.email,
        role: user.role,
        plan: user.plan || 'free',
        xp: user.xp ?? 0,
        level: user.level ?? 1,
        streak: user.streak ?? 0,
        teamCode: user.teamCode || '',
      },
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ ok: false, error: 'Email and password required' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ ok: false, error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    const publicName = user.displayName || user.name;
    res.json({
      ok: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        displayName: publicName,
        email: user.email,
        role: user.role,
        plan: user.plan || 'free',
        xp: user.xp ?? 0,
        level: user.level ?? 1,
        streak: user.streak ?? 0,
        teamCode: user.teamCode || '',
      },
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
