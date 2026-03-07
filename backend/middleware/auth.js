import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export function protect(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ ok: false, error: 'Not authorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'quizverse-secret');
    User.findById(decoded.id)
      .then((user) => {
        if (!user) return res.status(401).json({ ok: false, error: 'User not found' });
        req.user = user;
        next();
      })
      .catch(() => res.status(401).json({ ok: false, error: 'Not authorized' }));
  } catch {
    res.status(401).json({ ok: false, error: 'Invalid token' });
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ ok: false, error: 'Admin only' });
  }
  next();
}
