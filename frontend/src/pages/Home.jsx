import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container" style={{ paddingTop: '3rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>QuizVerse</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
        Create and play interactive quizzes. For teachers, parents, and students.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/quizzes" className="btn btn-primary" style={{ padding: '0.85rem 1.5rem' }}>
          Browse Quizzes
        </Link>
        <Link to="/register" className="btn btn-ghost" style={{ padding: '0.85rem 1.5rem' }}>
          Get Started
        </Link>
      </div>
    </div>
  );
}
