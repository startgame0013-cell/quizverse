import express from 'express';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok =
      file.mimetype === 'application/pdf' || file.originalname?.toLowerCase().endsWith('.pdf');
    if (ok) cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
});

/** Align OpenAI output with quizStore / AiQuizGenerator (text, options, correctIndex). */
export function normalizeQuestions(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((q) => ({
      text: String(q.text || q.question || '').trim(),
      options: Array.isArray(q.options) ? q.options.map(String) : [],
      correctIndex: Math.min(3, Math.max(0, Number(q.correctIndex) || 0)),
      timeLimit: 30,
    }))
    .filter((q) => q.text.length > 0 && q.options.length >= 2);
}

async function openAiQuizJson(prompt, maxTokens = 2500) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const err = new Error('AI not configured');
    err.code = 'NO_AI';
    throw err;
  }
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
    }),
  });
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim() || '[]';
  let parsed;
  try {
    const cleaned = content.replace(/^```json?\s*|\s*```$/g, '');
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('Failed to parse AI response');
  }
  if (!Array.isArray(parsed)) throw new Error('Invalid AI response format');
  return normalizeQuestions(parsed);
}

router.post('/generate-quiz', protect, async (req, res) => {
  try {
    const { topic, language = 'en', count = 5 } = req.body;
    if (!topic?.trim()) {
      return res.status(400).json({ ok: false, error: 'Topic required' });
    }
    const n = Math.min(10, Math.max(1, Number(count) || 5));
    const lang = language === 'ar' ? 'Arabic' : 'English';
    const prompt = `Generate exactly ${n} multiple choice quiz questions about "${topic.trim()}".
Each question must have 4 options (A, B, C, D) and one correct answer.
Output format: JSON array of objects with keys: question, options (array of 4 strings), correctIndex (0-3).
Language: ${lang}. Return only valid JSON, no markdown.`;
    const questions = await openAiQuizJson(prompt, 2000);
    if (!questions.length) {
      return res.status(500).json({ ok: false, error: 'No valid questions from AI' });
    }
    res.json({ ok: true, questions });
  } catch (err) {
    if (err.code === 'NO_AI') {
      return res.status(503).json({ ok: false, error: 'AI not configured. Set OPENAI_API_KEY.' });
    }
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * PDF نصي فقط — استخراج نص عبر pdf-parse. PDF ممسوح ضوئياً بدون طبقة نص قد يعيد نصاً فارغاً (يحتاج OCR لاحقاً).
 * يتطلب: OPENAI_API_KEY، حد 5MB، مستخدم مسجّل (protect).
 */
router.post('/pdf-to-quiz', protect, (req, res, next) => {
  upload.single('pdf')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        error: err.message || 'Upload failed',
        code: 'UPLOAD',
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file?.buffer?.length) {
      return res.status(400).json({ ok: false, error: 'PDF file required', code: 'NO_FILE' });
    }

    const language = req.body.language === 'ar' ? 'ar' : 'en';
    const count = Math.min(10, Math.max(1, Number(req.body.count) || 5));
    const difficulty = ['easy', 'medium', 'hard'].includes(req.body.difficulty)
      ? req.body.difficulty
      : 'medium';

    let text = '';
    const parser = new PDFParse({ data: req.file.buffer });
    try {
      const textResult = await parser.getText();
      text = (textResult.text || '').replace(/\s+/g, ' ').trim();
    } finally {
      await parser.destroy().catch(() => {});
    }

    if (text.length < 80) {
      return res.status(400).json({
        ok: false,
        error:
          'Could not extract enough text from this PDF. Use a text-based PDF, or scanned pages need OCR (not in phase 1).',
        code: 'PDF_NO_TEXT',
      });
    }

    const excerpt = text.slice(0, 12000);
    const langName = language === 'ar' ? 'Arabic' : 'English';
    const prompt = `You are an educator. The following text was extracted from a PDF document (may be truncated).
Create exactly ${count} multiple choice questions based ONLY on this content. Each question must have 4 options and one correct answer.
Difficulty style: ${difficulty}.
Output format: JSON array of objects with keys: question, options (array of 4 strings), correctIndex (0-3).
Language for questions and options: ${langName}.
Return only valid JSON, no markdown.

--- SOURCE TEXT ---
${excerpt}
--- END ---`;

    const questions = await openAiQuizJson(prompt, 3500);
    if (!questions.length) {
      return res.status(500).json({ ok: false, error: 'No valid questions from AI' });
    }
    res.json({ ok: true, questions, meta: { source: 'pdf', textLength: text.length } });
  } catch (err) {
    if (err.code === 'NO_AI') {
      return res.status(503).json({ ok: false, error: 'AI not configured. Set OPENAI_API_KEY.' });
    }
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
