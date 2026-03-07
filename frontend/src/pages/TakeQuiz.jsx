import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, getToken } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    fetch(`/api/quizzes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setQuiz(data.quiz);
      })
      .catch(() => {});
  }, [id]);

  const start = () => {
    setStartTime(Date.now());
    setCurrent(0);
    setAnswers({});
    setFinished(false);
    setScore(null);
  };

  const selectAnswer = (index) => {
    setAnswers((a) => ({ ...a, [current]: index }));
  };

  const next = () => {
    if (current < quiz.questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = () => {
    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++;
    });
    const total = quiz.questions.length;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    setScore({ correct, total, timeSpent });
    setFinished(true);

    if (user && getToken()) {
      fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          quizId: quiz._id,
          score: correct,
          total,
          timeSpent,
        }),
      }).catch(() => {});
    }
  };

  if (!quiz) return <div className="container">Loading…</div>;

  const q = quiz.questions[current];
  const hasAnswer = answers[current] !== undefined;

  if (finished && score !== null) {
    return (
      <div className="container" style={{ maxWidth: 480, paddingTop: '2rem', textAlign: 'center' }}>
        <div className="card">
          <h2 style={{ marginBottom: '0.5rem' }}>Results</h2>
          <p style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>
            {score.correct} / {score.total}
          </p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Time: {score.timeSpent}s
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={start}>
              Retry
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate(`/quizzes/${id}/leaderboard`)}
            >
              Leaderboard
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/quizzes')}>
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!startTime) {
    return (
      <div className="container" style={{ maxWidth: 480, paddingTop: '2rem' }}>
        <div className="card">
          <h2 style={{ marginBottom: '0.5rem' }}>{quiz.title}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {quiz.questions.length} questions
          </p>
          <button type="button" className="btn btn-primary" onClick={start}>
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 560, paddingTop: '1.5rem' }}>
      <div className="card">
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Question {current + 1} of {quiz.questions.length}
        </p>
        <h3 style={{ marginBottom: '1rem' }}>{q.question}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {q.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              className="btn"
              style={{
                textAlign: 'left',
                justifyContent: 'flex-start',
                background: answers[current] === i ? 'rgba(212, 175, 55, 0.2)' : 'var(--surface)',
                borderColor: answers[current] === i ? 'var(--accent)' : 'var(--border)',
              }}
              onClick={() => selectAnswer(i)}
            >
              {opt}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-primary"
          style={{ marginTop: '1rem', width: '100%' }}
          onClick={next}
          disabled={!hasAnswer}
        >
          {current < quiz.questions.length - 1 ? 'Next' : 'Finish'}
        </button>
      </div>
    </div>
  );
}
