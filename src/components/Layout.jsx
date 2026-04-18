import { useLocation, Link } from 'react-router-dom'
import Navbar from './Navbar'
import CookieBanner from './CookieBanner'
import { PageErrorBoundary } from './PageErrorBoundary'
import FooterExtras from './FooterExtras'
import { useLanguage } from '@/context/LanguageContext'

export default function Layout({ children }) {
  const { t, lang } = useLanguage()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Navbar />
      <main className="flex-1 pt-14 relative z-[1]">
        {!isHome && (
          <div
            role="status"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            className="border-b border-[#FACC15]/40 bg-[#FACC15]/15 px-4 py-2.5 text-center text-xs font-medium text-[#FEF9C3] sm:text-sm"
          >
            {t('layout.betaBanner')}
          </div>
        )}
        <PageErrorBoundary>
          {children}
        </PageErrorBoundary>
      </main>
      <CookieBanner />
      {!isHome && (
        <footer className="border-t border-white/5 bg-[#0a0a0a] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:gap-8">
              <Link
                to="/"
                className="text-sm font-bold text-[#FACC15] transition-opacity duration-150 hover:opacity-90 active:opacity-95"
              >
                QuizVerse
              </Link>
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-400">
                <Link to="/create-quiz" className="transition-colors duration-150 hover:text-[#FACC15] py-1">{t('nav.createQuiz')}</Link>
                <Link to="/join" className="transition-colors duration-150 hover:text-[#FACC15] py-1">{t('nav.joinGame')}</Link>
                <Link to="/leaderboard" className="transition-colors duration-150 hover:text-[#FACC15] py-1">{t('nav.leaderboard')}</Link>
                <Link to="/curricula" className="transition-colors duration-150 hover:text-[#FACC15] py-1">{t('nav.curricula')}</Link>
                <Link to="/mini-games" className="transition-colors duration-150 hover:text-[#FACC15] py-1">{t('nav.miniGames')}</Link>
                <Link to="/ai-generator" className="transition-colors duration-150 hover:text-[#FACC15] py-1">{t('nav.aiGenerator')}</Link>
                <Link to="/flashcards" className="transition-colors duration-150 hover:text-[#FACC15] py-1">{t('nav.flashcards')}</Link>
                <Link to="/about" className="transition-colors duration-150 hover:text-[#FACC15] py-1">{t('nav.about')}</Link>
                <Link to="/privacy" className="transition-colors duration-150 hover:text-[#FACC15] py-1">{t('nav.privacy')}</Link>
                <Link to="/terms" className="transition-colors duration-150 hover:text-[#FACC15] py-1">{t('nav.terms')}</Link>
                <Link to="/faq" className="transition-colors duration-150 hover:text-[#FACC15] py-1">{t('nav.faq')}</Link>
                <Link to="/pricing" className="transition-colors duration-150 hover:text-[#FACC15] py-1">{t('nav.pricing')}</Link>
                <Link to="/feedback" className="transition-colors duration-150 hover:text-[#FACC15] py-1">{t('nav.feedback')}</Link>
              </div>
            </div>
            <p className="mt-5 text-center text-xs text-gray-500 sm:text-left max-w-2xl">
              {t('home.footerTagline')}
            </p>
            <FooterExtras compact />
          </div>
        </footer>
      )}
    </div>
  )
}
