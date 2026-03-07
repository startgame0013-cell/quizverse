import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Leaderboard() {
  const { id } = useParams();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/scores/leaderboard/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setList(data.leaderboard);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container">Loading…</div>;

  return (
    <div className="container" style={{ paddingTop: '1.5rem', maxWidth: 560 }}>
      <h1 style={{ marginBottom: '1rem' }}>Leaderboard</h1>
      <Link to={`/quizzes/${id}`} className="btn btn-ghost" style={{ marginBottom: '1rem' }}>
        ← Back to Quiz
      </Link>
      {list.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No scores yet.</p>
      ) : (
        <div className="card">
          <ul style={{ listStyle: 'none' }}>
            {list.map((entry, i) => (
              <li
                key={entry._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.6rem 0',
                  borderBottom: i < list.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <span>
                  #{i + 1} {entry.user?.name || 'Anonymous'}
                </span>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  {entry.score} / {entry.total}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
