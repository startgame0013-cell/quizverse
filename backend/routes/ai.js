import express from 'express';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const SUPPORTED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']);
const SUPPORTED_DOC_TYPES = new Set([
  'application/pdf',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

function getLowerExt(name = '') {
  const idx = String(name).lastIndexOf('.');
  return idx >= 0 ? String(name).slice(idx).toLowerCase() : '';
}

function isSupportedSource(file) {
  const ext = getLowerExt(file?.originalname);
  return (
    SUPPORTED_IMAGE_TYPES.has(file?.mimetype) ||
    SUPPORTED_DOC_TYPES.has(file?.mimetype) ||
    ext === '.pdf' ||
    ext === '.txt' ||
    ext === '.docx'
  );
}

function getSourceKind(file) {
  const ext = getLowerExt(file?.originalname);
  if (SUPPORTED_IMAGE_TYPES.has(file?.mimetype)) return 'image';
  if (file?.mimetype === 'text/plain' || ext === '.txt') return 'text';
  if (
    file?.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    ext === '.docx'
  ) {
    return 'docx';
  }
  return 'pdf';
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = isSupportedSource(file);
    if (ok) cb(null, true);
    else cb(new Error('Only PDF, TXT, DOCX, PNG, JPG, and WEBP files are allowed'));
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
  return openAiQuizFromMessages([{ role: 'user', content: prompt }], maxTokens);
}

async function openAiQuizFromMessages(messages, maxTokens = 2500) {
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
      messages,
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

function buildTextSourcePrompt({ count, difficulty, language, excerpt, label }) {
  const langName = language === 'ar' ? 'Arabic' : 'English';
  return `You are an educator. The following text was extracted from ${label} and may be truncated.
Create exactly ${count} multiple choice questions based ONLY on this content. Each question must have 4 options and one correct answer.
Difficulty style: ${difficulty}.
Output format: JSON array of objects with keys: question, options (array of 4 strings), correctIndex (0-3).
Language for questions and options: ${langName}.
Return only valid JSON, no markdown.

--- SOURCE TEXT ---
${excerpt}
--- END ---`;
}

async function extractTextFromSourceFile(file) {
  const sourceKind = getSourceKind(file);

  if (sourceKind === 'text') {
    return { sourceKind, text: String(file.buffer.toString('utf8') || '').replace(/\s+/g, ' ').trim() };
  }

  if (sourceKind === 'docx') {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return { sourceKind, text: String(result.value || '').replace(/\s+/g, ' ').trim() };
  }

  const parser = new PDFParse({ data: file.buffer });
  try {
    const textResult = await parser.getText();
    return {
      sourceKind,
      text: String(textResult.text || '').replace(/\s+/g, ' ').trim(),
    };
  } finally {
    await parser.destroy().catch(() => {});
  }
}

function getUploadedSource(req) {
  return req.files?.file?.[0] || req.files?.pdf?.[0] || null;
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

async function handleSourceToQuiz(req, res) {
  try {
    const file = getUploadedSource(req);
    if (!file?.buffer?.length) {
      return res.status(400).json({ ok: false, error: 'Source file required', code: 'NO_FILE' });
    }

    const language = req.body.language === 'ar' ? 'ar' : 'en';
    const count = Math.min(10, Math.max(1, Number(req.body.count) || 5));
    const difficulty = ['easy', 'medium', 'hard'].includes(req.body.difficulty)
      ? req.body.difficulty
      : 'medium';
    const sourceKind = getSourceKind(file);

    if (sourceKind === 'image') {
      const langName = language === 'ar' ? 'Arabic' : 'English';
      const prompt = `You are an educator.
Analyze the uploaded educational image and create exactly ${count} multiple choice questions based ONLY on what is visible in it.
The image may contain textbook pages, notes, worksheets, lesson summaries, tables, or diagrams.
Difficulty style: ${difficulty}.
Each question must have 4 options and one correct answer.
Output format: JSON array of objects with keys: question, options (array of 4 strings), correctIndex (0-3).
Language for questions and options: ${langName}.
Return only valid JSON, no markdown.`;

      const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const questions = await openAiQuizFromMessages(
        [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: dataUrl } },
            ],
          },
        ],
        3000
      );

      if (!questions.length) {
        return res.status(500).json({ ok: false, error: 'No valid questions from AI' });
      }

      return res.json({
        ok: true,
        questions,
        meta: { source: 'image', fileName: file.originalname, mimeType: file.mimetype },
      });
    }

    const { text } = await extractTextFromSourceFile(file);
    if (text.length < 80) {
      return res.status(400).json({
        ok: false,
        error: 'Could not extract enough text from this file. Try a clearer source or a text-based document.',
        code: 'FILE_NO_TEXT',
      });
    }

    const excerpt = text.slice(0, 12000);
    const label =
      sourceKind === 'docx' ? 'a DOCX file' : sourceKind === 'text' ? 'a text file' : 'a PDF document';
    const prompt = buildTextSourcePrompt({ count, difficulty, language, excerpt, label });
    const questions = await openAiQuizJson(prompt, 3500);
    if (!questions.length) {
      return res.status(500).json({ ok: false, error: 'No valid questions from AI' });
    }
    return res.json({
      ok: true,
      questions,
      meta: { source: sourceKind, textLength: text.length, fileName: file.originalname },
    });
  } catch (err) {
    if (err.code === 'NO_AI') {
      return res.status(503).json({ ok: false, error: 'AI not configured. Set OPENAI_API_KEY.' });
    }
    return res.status(500).json({ ok: false, error: err.message });
  }
}

/**
 * يدعم الآن: PDF و TXT و DOCX و الصور التعليمية.
 * الصور تعتمد على Vision في OpenAI، والملفات النصية تُستخرج ثم تُحوّل لأسئلة.
 */
router.post('/source-to-quiz', protect, (req, res, next) => {
  upload.fields([{ name: 'file', maxCount: 1 }, { name: 'pdf', maxCount: 1 }])(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        error: err.message || 'Upload failed',
        code: 'UPLOAD',
      });
    }
    next();
  });
}, handleSourceToQuiz);

router.post('/pdf-to-quiz', protect, (req, res, next) => {
  upload.fields([{ name: 'file', maxCount: 1 }, { name: 'pdf', maxCount: 1 }])(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        error: err.message || 'Upload failed',
        code: 'UPLOAD',
      });
    }
    next();
  });
}, handleSourceToQuiz);

export default router;
