import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'

const staticNavItems = [
  ['/', 'nav.home'],
  ['/curricula', 'nav.curricula'],
  ['/study', 'nav.studyLibrary'],
  ['/pricing', 'nav.pricing'],
  ['/create-quiz', 'nav.createQuiz'],
  ['/ai-generator', 'nav.aiGenerator'],
  ['/join', 'nav.joinGame'],
  ['/leaderboard', 'nav.leaderboard'],
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t, lang, setLang } = useLanguage()
  const { user, signOut, isAuthenticated } = useAuth()
  const location = useLocation()

  const navItems = [
    ...staticNavItems,
    ...(user?.role === 'teacher' || user?.role === 'admin' ? [['/tracking', 'nav.tracking']] : []),
  ]

  const toggleLang = () => {
    try {
      setLang(lang === 'ar' ? 'en' : 'ar')
    } catch (_) {}
  }

  const isRtl = lang === 'ar'

  const baseLinkStyle = {
    color: '#fafafa',
    textDecoration: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    fontWeight: 500,
    transition: 'background 0.15s ease-out, color 0.15s ease-out, transform 0.1s ease-out',
  }

  const linkHoverBg = 'rgba(250,204,21,0.15)'

  return (
    <header
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: '#0a0a0a',
        borderBottom: '1px solid #222',
      }}
      className="px-4 py-2.5 sm:px-5 md:px-6 md:py-3 lg:px-8"
    >
      <nav
        className="flex items-center justify-between gap-4"
        style={{ maxWidth: '1200px', margin: '0 auto' }}
      >
        <div className="flex items-center gap-6 min-w-0">
          <Link
            to="/"
            className="shrink-0 text-xl font-bold transition-opacity duration-150 hover:opacity-90 active:opacity-95"
            style={{ color: '#FACC15', textDecoration: 'none' }}
          >
            QuizVerse
          </Link>

          <div className="hidden lg:flex items-center gap-1 min-w-0">
            {navItems.map(([path, labelKey]) => {
              const isActive =
                location.pathname === path || (path !== '/' && location.pathname.startsWith(path))
              return (
                <Link
                  key={path}
                  to={path}
                  className="transition-colors duration-150 hover:bg-[rgba(250,204,21,0.1)] rounded-lg"
                  style={{
                    ...baseLinkStyle,
                    color: isActive ? '#FACC15' : '#fafafa',
                    background: isActive ? linkHoverBg : 'transparent',
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t(labelKey)}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleLang}
            className="transition-all duration-150 ease-out hover:opacity-90 active:scale-[0.98] hover:brightness-105"
            style={{
              background: lang === 'en' ? '#FACC15' : 'transparent',
              color: lang === 'en' ? '#0a0a0a' : '#FACC15',
              border: '1px solid #FACC15',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {lang === 'en' ? 'English' : 'العربية'}
          </button>

          {!isAuthenticated && (
            <>
              <Link
                to="/sign-in"
                className="hidden md:inline-flex transition-all duration-150 hover:opacity-90 hover:brightness-105 active:scale-[0.98]"
                style={{
                  background: '#FACC15',
                  color: '#0a0a0a',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {t('nav.signIn', 'Sign In')}
              </Link>
              <Link
                to="/register"
                className="hidden md:inline-flex transition-all duration-150 hover:bg-[rgba(250,204,21,0.12)] active:scale-[0.98]"
                style={{
                  background: 'transparent',
                  color: '#FACC15',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  border: '1px solid #FACC15',
                }}
              >
                {t('auth.register', 'Register')}
              </Link>
            </>
          )}

          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-2">
              <span style={{ color: '#FACC15', fontSize: '0.9rem' }}>
                {user?.displayName || user?.name}
              </span>
              <button
                type="button"
                onClick={signOut}
                className="transition-colors duration-150 hover:bg-white/10 hover:border-gray-500 hover:text-gray-300"
                style={{
                  background: 'transparent',
                  color: '#888',
                  border: '1px solid #444',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                {t('auth.signOut', 'Sign Out')}
              </button>
            </div>
          )}

          {/* Hamburger: mobile / tablet */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex lg:hidden items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg transition-colors duration-150 hover:bg-white/12 active:bg-white/16 active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: '#fafafa',
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <span style={{ fontSize: '1.5rem' }}>✕</span> : <span style={{ fontSize: '1.5rem' }}>☰</span>}
          </button>
        </div>
      </nav>

      {/* Dropdown menu: opens when clicking the hamburger (all screen sizes) */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[1999]"
          style={{ top: '56px', background: 'rgba(0,0,0,0.9)' }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            dir={isRtl ? 'rtl' : 'ltr'}
            className="flex flex-col gap-0.5 p-4 pb-6 sm:p-5 sm:pb-8"
            style={{ background: '#111', borderTop: '1px solid #222' }}
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map(([path, labelKey]) => {
              const isActive =
                location.pathname === path || (path !== '/' && location.pathname.startsWith(path))
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMenuOpen(false)}
                  className="hover:bg-[rgba(250,204,21,0.1)] active:bg-[rgba(250,204,21,0.18)] rounded-lg transition-colors duration-150"
                  style={{
                    ...baseLinkStyle,
                    padding: '0.75rem 1rem',
                    fontSize: '1.05rem',
                    borderBottom: '1px solid #222',
                    color: isActive ? '#FACC15' : '#fafafa',
                    background: isActive ? linkHoverBg : 'transparent',
                  }}
                >
                  {t(labelKey)}
                </Link>
              )
            })}

            <div className="flex items-center gap-2 pt-3 mt-2 border-t border-[#222]">
              <span style={{ color: '#888', fontSize: '0.9rem' }}>{t('settings.language', 'Language')}</span>
              <button
                onClick={() => {
                  toggleLang()
                  setMenuOpen(false)
                }}
                className="transition-all duration-150 active:scale-[0.98]"
                style={{
                  background: lang === 'en' ? '#FACC15' : 'rgba(250,204,21,0.15)',
                  color: lang === 'en' ? '#0a0a0a' : '#FACC15',
                  border: '1px solid #FACC15',
                  padding: '0.5rem 0.9rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                {lang === 'en' ? 'English' : 'العربية'}
              </button>
            </div>

            {isAuthenticated ? (
              <div className="pt-3 mt-2 border-t border-[#222]">
                <span style={{ color: '#FACC15', fontSize: '0.9rem' }}>
                  {user?.displayName || user?.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    signOut()
                    setMenuOpen(false)
                  }}
                  className="block mt-1 w-full text-left"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#888',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    padding: '0.5rem 0',
                  }}
                >
                  {t('auth.signOut', 'Sign Out')}
                </button>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <Link
                  to="/sign-in"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center transition-all duration-150 hover:opacity-90 active:scale-[0.99] min-h-[44px] flex items-center justify-center"
                  style={{
                    background: '#FACC15',
                    color: '#0a0a0a',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  {t('nav.signIn', 'Sign In')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center transition-all duration-150 hover:bg-[rgba(250,204,21,0.12)] active:scale-[0.99] min-h-[44px] flex items-center justify-center"
                  style={{
                    background: 'transparent',
                    color: '#FACC15',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    border: '1px solid #FACC15',
                  }}
                >
                  {t('auth.register', 'Register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
