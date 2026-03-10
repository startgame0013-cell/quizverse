import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';

export default function Classes() {
  const { user, getToken } = useAuth();
  const [classes, setClasses] = useState([]);
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = () => {
    if (!user || !getToken()) {
      setLoading(false);
      return;
    }
    fetch('/api/classes', {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setClasses(data.classes);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(load, [user]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!joinCode.trim() || !user || !getToken()) {
      setMessage('Login and enter a class code.');
      return;
    }
    setMessage('');
    apiFetch('/api/classes/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: joinCode.trim().toUpperCase() }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setMessage('Joined class successfully.');
          setJoinCode('');
          load();
        } else {
          setMessage(data.error || 'Failed to join');
        }
      })
      .catch(() => setMessage('Network error'));
  };

  const handleCreate = async () => {
    if (!user || !getToken()) {
      setMessage('Login as teacher to create a class.');
      return;
    }
    const name = window.prompt('Class name:');
    if (!name?.trim()) return;
    setMessage('');
    try {
      const res = await apiFetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (data.ok) {
        setMessage(`Class created. Share code: ${data.class.code}`);
        load();
      } else {
        setMessage(data.error || 'Failed to create');
      }
    } catch {
      setMessage('Network error');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>Classes</h1>

      {user && (user.role === 'teacher' || user.role === 'admin') && (
        <button type="button" className="btn btn-primary" onClick={handleCreate} style={{ marginBottom: '1rem' }}>
          Create class
        </button>
      )}

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Join with code</h3>
        <form onSubmit={handleJoin} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="input"
            placeholder="Class code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            style={{ maxWidth: 160 }}
          />
          <button type="submit" className="btn btn-primary">
            Join
          </button>
        </form>
        {message && <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--accent)' }}>{message}</p>}
      </div>

      {!user ? (
        <p style={{ color: 'var(--text-muted)' }}>Log in to see your classes.</p>
      ) : loading ? (
        <p>Loading…</p>
      ) : classes.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No classes yet. Create one or join with a code.</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {classes.map((c) => (
            <div key={c._id} className="card">
              <strong>{c.name}</strong> — Code: <code>{c.code}</code>
              {c.teacher && <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>by {c.teacher.name}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
