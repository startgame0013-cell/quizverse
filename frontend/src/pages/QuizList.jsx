import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/quizzes')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setQuizzes(data.quizzes);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="container">Loading quizzes…</div>;

  return (
    <div className="container" style={{ paddingTop: '1.5rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>Quizzes</h1>
      {quizzes.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No quizzes yet. Create one to get started.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {quizzes.map((q) => (
            <div key={q._id} className="card">
              <h3 style={{ marginBottom: '0.35rem' }}>{q.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                {q.questions?.length || 0} questions
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {q.description || 'No description'}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to={`/quizzes/${q._id}`} className="btn btn-primary">
                  Play
                </Link>
                <Link to={`/quizzes/${q._id}/leaderboard`} className="btn btn-ghost">
                  Leaderboard
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
