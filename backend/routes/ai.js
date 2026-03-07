import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate-quiz', protect, async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ ok: false, error: 'AI not configured. Set OPENAI_API_KEY.' });
  }
  try {
    const { topic, language = 'en', count = 5 } = req.body;
    if (!topic?.trim()) {
      return res.status(400).json({ ok: false, error: 'Topic required' });
    }
    const lang = language === 'ar' ? 'Arabic' : 'English';
    const prompt = `Generate exactly ${count} multiple choice quiz questions about "${topic}". 
Each question must have 4 options (A, B, C, D) and one correct answer. 
Output format: JSON array of objects with keys: question, options (array of 4 strings), correctIndex (0-3). 
Language: ${lang}. Return only valid JSON, no markdown.`;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
      }),
    });
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() || '[]';
    let questions;
    try {
      const cleaned = content.replace(/^```json?\s*|\s*```$/g, '');
      questions = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({ ok: false, error: 'Failed to parse AI response' });
    }
    if (!Array.isArray(questions)) {
      return res.status(500).json({ ok: false, error: 'Invalid AI response format' });
    }
    res.json({ ok: true, questions });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
