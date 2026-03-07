import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CreateQuiz() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctIndex: 0, timeLimit: 30 },
  ]);
  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addQuestion = () => {
    setQuestions((q) => [...q, { question: '', options: ['', '', '', ''], correctIndex: 0, timeLimit: 30 }]);
  };

  const updateQuestion = (index, field, value) => {
    setQuestions((q) => {
      const next = [...q];
      if (field === 'options') next[index].options = value;
      else next[index][field] = value;
      return next;
    });
  };

  const generateWithAI = async () => {
    if (!aiTopic.trim()) return;
    setAiLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ topic: aiTopic.trim(), language: 'en', count: 5 }),
      });
      const data = await res.json();
      if (data.ok && Array.isArray(data.questions) && data.questions.length > 0) {
        setTitle(aiTopic.trim());
        setQuestions(
          data.questions.map((q) => ({
            question: q.question || '',
            options: Array.isArray(q.options) ? q.options : ['', '', '', ''],
            correctIndex: Math.max(0, parseInt(q.correctIndex, 10) || 0),
            timeLimit: 30,
          }))
        );
      } else {
        setError(data.error || 'Could not generate questions');
      }
    } catch {
      setError('Network error');
    }
    setAiLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title required');
      return;
    }
    const valid = questions.filter((q) => q.question.trim() && q.options.some((o) => o.trim()));
    if (valid.length === 0) {
      setError('Add at least one question with options');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          questions: valid.map((q) => ({
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            timeLimit: q.timeLimit,
          })),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        navigate(`/quizzes/${data.quiz._id}`);
      } else {
        setError(data.error || 'Failed to create quiz');
      }
    } catch {
      setError('Network error');
    }
    setSaving(false);
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', maxWidth: 720 }}>
      <h1 style={{ marginBottom: '1rem' }}>Create Quiz</h1>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>AI Generate (optional)</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="input"
            placeholder="Topic (e.g. Math, History)"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            style={{ flex: 1, minWidth: 180 }}
          />
          <button type="button" className="btn btn-primary" onClick={generateWithAI} disabled={aiLoading}>
            {aiLoading ? '…' : 'Generate'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <p style={{ color: '#ef4444', marginBottom: '0.75rem', fontSize: '0.9rem' }}>{error}</p>
        )}
        <input
          type="text"
          className="input"
          placeholder="Quiz title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ marginBottom: '0.75rem' }}
        />
        <textarea
          className="input"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          style={{ marginBottom: '1rem' }}
        />

        {questions.map((q, i) => (
          <div key={i} className="card" style={{ marginBottom: '1rem' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Question {i + 1}</h4>
            <input
              type="text"
              className="input"
              placeholder="Question text"
              value={q.question}
              onChange={(e) => updateQuestion(i, 'question', e.target.value)}
              style={{ marginBottom: '0.5rem' }}
            />
            {q.options.map((opt, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <input
                  type="radio"
                  name={`correct-${i}`}
                  checked={q.correctIndex === j}
                  onChange={() => updateQuestion(i, 'correctIndex', j)}
                />
                <input
                  type="text"
                  className="input"
                  placeholder={`Option ${j + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const opts = [...q.options];
                    opts[j] = e.target.value;
                    updateQuestion(i, 'options', opts);
                  }}
                  style={{ flex: 1 }}
                />
              </div>
            ))}
          </div>
        ))}
        <button type="button" className="btn btn-ghost" onClick={addQuestion} style={{ marginBottom: '1rem' }}>
          + Add question
        </button>
        <br />
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? '…' : 'Create Quiz'}
        </button>
      </form>
    </div>
  );
}
