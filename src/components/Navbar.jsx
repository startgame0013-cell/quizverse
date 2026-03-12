import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useLocation } from 'react-router-dom'

const navItems = [
  ['/', 'nav.home'],
  ['/create-quiz', 'nav.createQuiz'],
  ['/join', 'nav.joinGame'],
  ['/leaderboard', 'nav.leaderboard'],
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t, lang, setLang } = useLanguage()
  const { user, signOut, isAuthenticated } = useAuth()
  const location = useLocation()

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
    transition: 'background 0.2s, color 0.2s',
  }

  const linkStyle = {
    ...baseLinkStyle,
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
        padding: '0.6rem 1rem',
      }}
    >
      <nav
        className="flex items-center justify-between gap-4"
        style={{ maxWidth: '1200px', margin: '0 auto' }}
      >
        {/* Logo - Left */}
        <Link
          to="/"
          className="shrink-0 text-xl font-bold"
          style={{ color: '#FACC15', textDecoration: 'none' }}
        >
          QuizVerse
        </Link>

        {/* روابط في المنتصف (تظهر على اللابتوب فقط) */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-1">
          {navItems.map(([path, labelKey]) => {
            const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path))
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                style={{
                  ...linkStyle,
                  color: isActive ? '#FACC15' : '#fafafa',
                  background: isActive ? 'rgba(250,204,21,0.15)' : 'transparent',
                }}
                className="hover:opacity-90"
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = linkHoverBg
                    e.currentTarget.style.color = '#FACC15'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#fafafa'
                  }
                }}
              >
                {t(labelKey)}
              </Link>
            )
          })}
        </div>

        {/* يمين: زر اللغة + تسجيل الدخول + قائمة الموبايل */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleLang}
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
            title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            aria-label={lang === 'ar' ? 'Switch to English' : 'Switch to Arabic'}
          >
            {lang === 'en' ? 'English' : 'العربية'}
          </button>

          {/* زر تسجيل الدخول – مثل المواقع العادية (يظهر على اللابتوب) */}
          {!isAuthenticated && (
            <Link
              to="/sign-in"
              className="hidden md:inline-flex"
              style={{
                background: '#FACC15',
                color: '#0a0a0a',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(250,204,21,0.3)',
              }}
            >
              {t('nav.signIn', 'Sign In')}
            </Link>
          )}

          {/* زر القائمة (موبايل وأيضاً لو حاب تفتحه على اللابتوب) */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#fafafa', border: 'none', cursor: 'pointer' }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <span style={{ fontSize: '1.5rem' }}>✕</span>
            ) : (
              <span style={{ fontSize: '1.5rem' }}>☰</span>
            )}
          </button>
        </div>
      </nav>

      {/* قائمة كاملة تظهر عند الضغط على زر الخطوط في أي مقاس */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[1999]"
          style={{ top: '56px', background: 'rgba(0,0,0,0.9)' }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            dir={isRtl ? 'rtl' : 'ltr'}
            className="flex flex-col gap-1 p-4"
            style={{ background: '#111', borderTop: '1px solid #222' }}
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map(([path, labelKey]) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                style={{
                  ...baseLinkStyle,
                  padding: '0.75rem 1rem',
                  fontSize: '1.1rem',
                  borderBottom: '1px solid #222',
                }}
                className="hover:bg-white/5"
              >
                {t(labelKey)}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-3 mt-2 border-t border-[#222]">
              <span style={{ color: '#888', fontSize: '0.9rem' }}>{t('settings.language', 'Language')}</span>
              <button
                onClick={() => {
                  toggleLang()
                  setMenuOpen(false)
                }}
                style={{
                  background: lang === 'en' ? '#FACC15' : 'rgba(250,204,21,0.15)',
                  color: lang === 'en' ? '#0a0a0a' : '#FACC15',
                  border: '1px solid #FACC15',
                  padding: '0.4rem 0.8rem',
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
              <Link
                to="/sign-in"
                onClick={() => setMenuOpen(false)}
                className="block mt-3 text-center"
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
                {t('nav.signIn', 'Login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
