import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, PenSquare, ClipboardList, Sparkles, Gamepad2, Trophy, Brain, LogIn, Rocket, Menu, X, Languages, UserPlus, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const iconClass = 'size-4 shrink-0'
const navItems = [
  { to: '/', labelKey: 'nav.home', icon: Home },
  { to: '/create-quiz', labelKey: 'nav.createQuiz', icon: PenSquare },
  { to: '/my-quizzes', labelKey: 'nav.myQuizzes', icon: ClipboardList },
  { to: '/ai-generator', labelKey: 'nav.aiGenerator', icon: Sparkles },
  { to: '/join', labelKey: 'nav.joinGame', icon: Gamepad2 },
  { to: '/leaderboard', labelKey: 'nav.leaderboard', icon: Trophy },
  { to: '/mini-games', labelKey: 'nav.miniGames', icon: Brain },
]

export default function Navbar() {
  const { lang, setLang, t } = useLanguage()
  const { user, signOut, isAuthenticated } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const toggleLang = () => setLang(lang === 'en' ? 'ar' : 'en')

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
        >
          <span className="text-primary">QuizVerse</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map(({ to, labelKey, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                location.pathname === to
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className={iconClass} strokeWidth={2} />
              {t(labelKey)}
            </Link>
          ))}
          <button
            type="button"
            onClick={toggleLang}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            title={lang === 'en' ? 'العربية' : 'English'}
          >
            <Languages className="size-4" />
            <span>{lang === 'en' ? 'عربي' : 'EN'}</span>
          </button>
          <div className="ms-2 flex items-center gap-2 border-s border-border ps-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground truncate max-w-[120px]">{user?.name}</span>
                <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
                  <LogOut className={iconClass} />
                  {t('auth.signOut')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/sign-in" className="gap-2">
                    <LogIn className={iconClass} />
                    {t('nav.signIn')}
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/register" className="gap-2">
                    <UserPlus className={iconClass} />
                    {t('auth.register')}
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/get-started" className="gap-2">
                    <Rocket className={iconClass} />
                    {t('nav.getStarted')}
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLang}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
            title={lang === 'en' ? 'العربية' : 'English'}
          >
            <span className="text-sm font-medium">{lang === 'en' ? 'عربي' : 'EN'}</span>
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-3 md:hidden animate-fade-in">
          <div className="flex flex-col gap-1">
            {navItems.map(({ to, labelKey, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  location.pathname === to ? 'bg-primary/15 text-primary' : 'text-muted-foreground'
                )}
                onClick={() => setMobileOpen(false)}
              >
                <Icon className={iconClass} />
                {t(labelKey)}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => { toggleLang(); setMobileOpen(false); }}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground"
            >
              <Languages className={iconClass} />
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              {isAuthenticated ? (
                <Button variant="ghost" size="sm" onClick={() => { signOut(); setMobileOpen(false); }} className="gap-2">
                  <LogOut className={iconClass} />
                  {t('auth.signOut')}
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <Link to="/sign-in" onClick={() => setMobileOpen(false)}>
                      <LogIn className={iconClass} />
                      {t('nav.signIn')}
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <Link to="/register" onClick={() => setMobileOpen(false)}>
                      <UserPlus className={iconClass} />
                      {t('auth.register')}
                    </Link>
                  </Button>
                  <Button size="sm" className="gap-2" asChild>
                    <Link to="/get-started" onClick={() => setMobileOpen(false)}>
                      <Rocket className={iconClass} />
                      {t('nav.getStarted')}
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
