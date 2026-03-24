import 'dotenv/config';
import { createServer } from 'http';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import quizzesRoutes from './routes/quizzes.js';
import scoresRoutes from './routes/scores.js';
import classesRoutes from './routes/classes.js';
import aiRoutes from './routes/ai.js';
import statsRoutes from './routes/stats.js';
import subscriptionRoutes, { handlePaddleWebhook } from './routes/subscription.js';
import gameRoutes from './routes/game.js';
import reportsRoutes from './routes/reports.js';
import trackingRoutes from './routes/tracking.js';
import gamificationRoutes from './routes/gamification.js';
import GameSession from './models/GameSession.js';

await connectDB();

const app = express();
const httpServer = createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || '';
const VERCEL_URL = 'https://quizverse-lyart.vercel.app';
const corsOrigins = FRONTEND_URL
  ? [FRONTEND_URL, VERCEL_URL, 'http://localhost:5173', 'http://localhost:3000']
  : true;
const io = new Server(httpServer, { cors: { origin: corsOrigins } });

const PORT = process.env.PORT || 4000;

app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(helmet({ contentSecurityPolicy: false }));
// Paddle webhooks require raw body for HMAC verification — must run before express.json()
app.post(
  '/api/subscription/webhook',
  express.raw({ type: 'application/json' }),
  handlePaddleWebhook
);
app.use(express.json());

// Rate limit auth routes to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { ok: false, error: 'Too many attempts. Try again later.' },
});
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/scores', scoresRoutes);
app.use('/api/classes', classesRoutes);
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: { ok: false, error: 'Too many AI requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.set('io', io);
app.use('/api/game', gameRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/gamification', gamificationRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Socket.IO - Live game events
io.on('connection', (socket) => {
  const emitPlayers = async (pin) => {
    const session = await GameSession.findOne({ pin });
    if (session?.players?.length) {
      const players = session.players.map((p, i) => ({ index: i, nickname: p.nickname }));
      io.to(`game:${pin}`).emit('game:players', { players });
    }
  };

  socket.on('host:join', async ({ pin }) => {
    if (!pin) return;
    try {
      socket.join(`game:${pin}`);
      await emitPlayers(pin);
    } catch (e) {
      console.error('host:join', e.message);
    }
  });

  socket.on('player:join', async ({ pin, playerIndex }) => {
    if (!pin) return;
    try {
      socket.join(`game:${pin}`);
      await emitPlayers(pin);
    } catch (e) {
      console.error('player:join', e.message);
    }
  });

  socket.on('host:start', async ({ pin }) => {
    if (!pin) return;
    const session = await GameSession.findOne({ pin });
    if (!session || session.status !== 'waiting') return;
    session.status = 'playing';
    session.startedAt = new Date();
    session.currentQuestionIndex = 0;
    await session.save();
    const questions = session.quizData?.questions || [];
    const firstQ = questions[0];
    io.to(`game:${pin}`).emit('game:started', { session: { quizData: session.quizData, currentQuestionIndex: 0 } });
    if (firstQ) io.to(`game:${pin}`).emit('game:question', { currentQuestionIndex: 0, question: firstQ });
  });

  socket.on('host:next', async ({ pin }) => {
    if (!pin) return;
    const session = await GameSession.findOne({ pin });
    if (!session) return;
    const questions = session.quizData?.questions || [];
    session.currentQuestionIndex = Math.min(session.currentQuestionIndex + 1, questions.length);
    if (session.currentQuestionIndex >= questions.length) {
      session.status = 'ended';
      session.endedAt = new Date();
      await session.save();
      const leaderboard = (session.players || [])
        .map((p) => ({ nickname: p.nickname, score: p.score }))
        .sort((a, b) => b.score - a.score)
        .map((p, i) => ({ ...p, rank: i + 1 }));
      io.to(`game:${pin}`).emit('game:ended', { leaderboard });
    } else {
      await session.save();
      io.to(`game:${pin}`).emit('game:question', { currentQuestionIndex: session.currentQuestionIndex, question: questions[session.currentQuestionIndex] });
    }
  });

  socket.on('host:showLeaderboard', async ({ pin }) => {
    if (!pin) return;
    const session = await GameSession.findOne({ pin });
    if (!session) return;
    const leaderboard = (session.players || [])
        .map((p) => ({ nickname: p.nickname, score: p.score }))
        .sort((a, b) => b.score - a.score)
        .map((p, i) => ({ ...p, rank: i + 1 }));
    io.to(`game:${pin}`).emit('game:leaderboard', { leaderboard });
  });

  socket.on('player:answer', async ({ pin, playerIndex, answerIndex, timeTaken = 0 }) => {
    if (!pin || playerIndex == null) return;
    const session = await GameSession.findOne({ pin });
    if (!session || session.status !== 'playing') return;
    const questions = session.quizData?.questions || [];
    const q = questions[session.currentQuestionIndex];
    if (!q || playerIndex == null) return;
    const correct = answerIndex === q.correctIndex;
    // Score: correctness + speed. Formula: max(300, 1000 - timeTaken*50) for correct, 0 for wrong
    const points = correct ? Math.max(300, Math.round(1000 - (Number(timeTaken) || 0) * 50)) : 0;
    if (session.players[playerIndex]) {
      session.players[playerIndex].score += points;
      session.answers.push({
        playerId: String(playerIndex),
        nickname: session.players[playerIndex].nickname,
        questionIndex: session.currentQuestionIndex,
        answerIndex,
        correct,
        points,
        timeTaken: Number(timeTaken) || 0,
      });
      await session.save();
      const lb = (session.players || []).map((p) => ({ nickname: p.nickname, score: p.score })).sort((a, b) => b.score - a.score).map((p, i) => ({ ...p, rank: i + 1 }));
    io.to(`game:${pin}`).emit('game:answer', { playerIndex, correct, points, leaderboard: lb });
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`QuizVerse API — http://localhost:${PORT}`);
});
