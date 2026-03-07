import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import quizzesRoutes from './routes/quizzes.js';
import scoresRoutes from './routes/scores.js';
import classesRoutes from './routes/classes.js';
import aiRoutes from './routes/ai.js';

await connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/scores', scoresRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`QuizVerse API — http://localhost:${PORT}`);
});
