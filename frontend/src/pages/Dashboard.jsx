import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container" style={{ paddingTop: '1.5rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Welcome, {user?.name}. Role: {user?.role}.
      </p>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <Link to="/quizzes" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{ color: 'var(--accent)', marginBottom: '0.35rem' }}>Quizzes</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Browse and take quizzes</p>
        </Link>
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <Link to="/create-quiz" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 style={{ color: 'var(--accent)', marginBottom: '0.35rem' }}>Create Quiz</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Add a new quiz</p>
          </Link>
        )}
        <Link to="/classes" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{ color: 'var(--accent)', marginBottom: '0.35rem' }}>Classes</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Join or manage classes</p>
        </Link>
      </div>
    </div>
  );
}
