import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'

const mainNavItems = [
  ['/', 'nav.home'],
  ['/create-quiz', 'nav.createQuiz'],
  ['/my-quizzes', 'nav.myQuizzes'],
  ['/ai-generator', 'nav.aiGenerator'],
  ['/join', 'nav.joinGame'],
  ['/leaderboard', 'nav.leaderboard'],
  ['/mini-games', 'nav.miniGames'],
  ['/visitor-stats', 'nav.visitorStats'],
  ['/about', 'nav.about'],
  ['/privacy', 'nav.privacy'],
]

const authNavItems = [
  ['/sign-in', 'nav.signIn'],
  ['/register', 'auth.register'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { t, lang, setLang } = useLanguage()
  const { user, signOut, isAuthenticated } = useAuth()

  const navItems = [...mainNavItems, ...(isAuthenticated ? [] : authNavItems)]

  const toggleLang = () => {
    setLang(lang === 'ar' ? 'en' : 'ar')
  }

  return (
    <>
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: '#0a0a0a', borderBottom: '1px solid #222', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#FACC15', fontWeight: 'bold', fontSize: '1.5rem', textDecoration: 'none' }}>QuizNova</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={toggleLang}
            style={{ background: '#FACC15', color: '#0a0a0a', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 }}
            title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            {lang === 'ar' ? 'EN' : 'العربية'}
          </button>
          <button onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' }} aria-label="Open menu">☰</button>
        </div>
      </header>
      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '300px', background: '#111', height: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <button onClick={() => setOpen(false)} style={{ alignSelf: 'flex-end', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }} aria-label="Close menu">✕</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid #222' }}>
              <span style={{ color: '#888', fontSize: '0.9rem' }}>{t('settings.language')}</span>
              <button onClick={toggleLang} style={{ background: 'rgba(250,204,21,0.15)', border: '1px solid #FACC15', color: '#FACC15', padding: '0.35rem 0.7rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                {lang === 'ar' ? 'English' : 'العربية'}
              </button>
            </div>
            {navItems.map(([path, labelKey]) => (
              <Link key={path} to={path} onClick={() => setOpen(false)} style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem', padding: '0.75rem 0', borderBottom: '1px solid #222' }}>{t(labelKey)}</Link>
            ))}
            {isAuthenticated && (
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #222' }}>
                <span style={{ color: '#FACC15', fontSize: '0.9rem' }}>{user?.name}</span>
                <button onClick={() => { signOut(); setOpen(false); }} style={{ display: 'block', marginTop: '0.5rem', background: 'none', border: 'none', color: '#888', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline' }}>{t('auth.signOut', 'Sign Out')}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
