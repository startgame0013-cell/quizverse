import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { t, lang, setLang } = useLanguage();

  return (
    <div className="container" style={{ paddingTop: '3rem', textAlign: 'center' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          style={{
            background: '#FACC15',
            color: '#0a0a0a',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {lang === 'ar' ? 'English' : 'العربية'}
        </button>
      </div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{t('home.title')}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
        {t('home.subtitle')}
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/quizzes" className="btn btn-primary" style={{ padding: '0.85rem 1.5rem' }}>
          {t('home.browse')}
        </Link>
        <Link to="/register" className="btn btn-ghost" style={{ padding: '0.85rem 1.5rem' }}>
          {t('home.getStarted')}
        </Link>
      </div>
    </div>
  );
}
