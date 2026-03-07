import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ maxWidth: 400, marginTop: '2rem' }}>
      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Register</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <p style={{ color: '#ef4444', marginBottom: '0.75rem', fontSize: '0.9rem' }}>{error}</p>
          )}
          <input
            type="text"
            className="input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ marginBottom: '0.75rem' }}
          />
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: '0.75rem' }}
          />
          <input
            type="password"
            className="input"
            placeholder="Password (min 6)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
            style={{ marginBottom: '0.75rem' }}
          />
          <select
            className="input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ marginBottom: '1rem' }}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
          </select>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? '…' : 'Register'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
