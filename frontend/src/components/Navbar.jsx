import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}
    >
      <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)' }}>
        QuizVerse
      </Link>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/quizzes" className="btn btn-ghost">
          Quizzes
        </Link>
        <Link to="/classes" className="btn btn-ghost">
          Classes
        </Link>
        {user ? (
          <>
            <Link to="/dashboard" className="btn btn-ghost">
              Dashboard
            </Link>
            {(user.role === 'teacher' || user.role === 'admin') && (
              <Link to="/create-quiz" className="btn btn-primary">
                Create Quiz
              </Link>
            )}
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {user.name} ({user.role})
            </span>
            <button type="button" className="btn btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
