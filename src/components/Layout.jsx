import { useLocation, Link } from 'react-router-dom'
import Navbar from './Navbar'
import { useLanguage } from '@/context/LanguageContext'

export default function Layout({ children }) {
  const { t } = useLanguage()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Navbar />
      <main className="flex-1 pt-14">
        {children}
      </main>
      {!isHome && (
        <footer className="border-t border-white/5 bg-[#0a0a0a] px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <Link to="/" className="text-sm font-bold text-[#FACC15] hover:opacity-90">
                QuizNova
              </Link>
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                <Link to="/create-quiz" className="transition-colors hover:text-foreground">{t('nav.createQuiz')}</Link>
                <Link to="/join" className="transition-colors hover:text-foreground">{t('nav.joinGame')}</Link>
                <Link to="/leaderboard" className="transition-colors hover:text-foreground">{t('nav.leaderboard')}</Link>
                <Link to="/mini-games" className="transition-colors hover:text-foreground">{t('nav.miniGames')}</Link>
                <Link to="/ai-generator" className="transition-colors hover:text-foreground">{t('nav.aiGenerator')}</Link>
                <Link to="/about" className="transition-colors hover:text-foreground">{t('nav.about')}</Link>
                <Link to="/privacy" className="transition-colors hover:text-foreground">{t('nav.privacy')}</Link>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground sm:text-left">
              {t('home.footerTagline')}
            </p>
          </div>
        </footer>
      )}
    </div>
  )
}
