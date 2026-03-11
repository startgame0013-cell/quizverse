import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  ['/pricing', 'nav.pricing'],
]

const authNavItems = [
  ['/sign-in', 'nav.signIn'],
  ['/register', 'auth.register'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { t, lang, setLang } = useLanguage()
  const { user, signOut, isAuthenticated } = useAuth()

  const navItems = [...mainNavItems, ...(isAuthenticated ? [] : authNavItems)]

  const toggleLang = () => {
    setLang(lang === 'ar' ? 'en' : 'ar')
  }

  const goBack = () => {
    if (window.history.length > 1) window.history.back()
    else navigate('/', { replace: true })
  }

  const goForward = () => {
    window.history.forward()
  }

  const isRtl = lang === 'ar'

  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    pointerEvents: 'auto',
    background: '#0a0a0a',
    borderBottom: '1px solid #222',
    padding: '0.6rem 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
  }

  return (
    <>
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, pointerEvents: 'auto' }}>
        {/* زر الرجوع — Link يضمن أن الضغط يعمل حتى لو حدث خطأ في الصفحة */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FACC15', border: 'none', color: '#0a0a0a', padding: '0.6rem 1.2rem', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 700, boxShadow: '0 2px 8px rgba(250,204,21,0.4)', textDecoration: 'none' }} title={t('nav.back')} aria-label={t('nav.back')}>
          <span style={{ fontSize: '1.3rem' }}>{isRtl ? '→' : '←'}</span> {t('nav.back')}
        </Link>
        <button type="button" onClick={() => { try { goForward() } catch (_) {} }} title={t('nav.next')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)', color: '#fafafa', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 }} aria-label={t('nav.next')}>
          {t('nav.next')} <span style={{ fontSize: '1.2rem' }}>{isRtl ? '←' : '→'}</span>
        </button>
        </div>
        <Link to="/" style={{ color: '#FACC15', fontWeight: 'bold', fontSize: '1.5rem', textDecoration: 'none', pointerEvents: 'auto' }}>QuizVerse</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', pointerEvents: 'auto' }}>
          <button
            type="button"
            onClick={() => { try { toggleLang() } catch (_) {} }}
            style={{ background: lang === 'en' ? '#FACC15' : 'transparent', color: lang === 'en' ? '#0a0a0a' : '#FACC15', border: '1px solid #FACC15', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 }}
            title={lang === 'ar' ? 'Click to switch to English' : 'اضغط للتبديل إلى العربية'}
          >
            {lang === 'en' ? 'English' : 'العربية'}
          </button>
          <button type="button" onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' }} aria-label="Open menu">☰</button>
        </div>
      </header>
      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '300px', background: '#111', height: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <button onClick={() => setOpen(false)} style={{ alignSelf: 'flex-end', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }} aria-label="Close menu">✕</button>
            <button type="button" onClick={() => { window.history.back(); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', background: '#FACC15', border: 'none', color: '#0a0a0a', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 600 }}>
              ← {t('nav.back')}
            </button>
            <button type="button" onClick={() => { window.history.forward(); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid #333', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer' }}>
              {t('nav.next')} →
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid #222' }}>
              <span style={{ color: '#888', fontSize: '0.9rem' }}>{t('settings.language')}</span>
              <button onClick={toggleLang} style={{ background: lang === 'en' ? '#FACC15' : 'rgba(250,204,21,0.15)', border: '1px solid #FACC15', color: lang === 'en' ? '#0a0a0a' : '#FACC15', padding: '0.35rem 0.7rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                {lang === 'en' ? 'English' : 'العربية'}
              </button>
            </div>
            {navItems.map(([path, labelKey]) => (
              <Link key={path} to={path} onClick={() => setOpen(false)} style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem', padding: '0.75rem 0', borderBottom: '1px solid #222' }}>{t(labelKey)}</Link>
            ))}
            {isAuthenticated && (
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #222' }}>
                <span style={{ color: '#FACC15', fontSize: '0.9rem' }}>{user?.displayName || user?.name}</span>
                <button onClick={() => { signOut(); setOpen(false); }} style={{ display: 'block', marginTop: '0.5rem', background: 'none', border: 'none', color: '#888', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline' }}>{t('auth.signOut', 'Sign Out')}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
