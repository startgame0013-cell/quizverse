import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'

const navItems = [
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
  ['/sign-in', 'nav.signIn'],
  ['/register', 'auth.register'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <>
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: '#0a0a0a', borderBottom: '1px solid #222', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#FACC15', fontWeight: 'bold', fontSize: '1.5rem', textDecoration: 'none' }}>QuizNova</Link>
        <button onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' }} aria-label="Open menu">☰</button>
      </header>
      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '300px', background: '#111', height: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <button onClick={() => setOpen(false)} style={{ alignSelf: 'flex-end', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }} aria-label="Close menu">✕</button>
            {navItems.map(([path, labelKey]) => (
              <Link key={path} to={path} onClick={() => setOpen(false)} style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem', padding: '0.75rem 0', borderBottom: '1px solid #222' }}>{t(labelKey)}</Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
