import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'

const CONSENT_KEY = 'quiznova_cookie_consent'

export default function CookieBanner() {
  const { t } = useLanguage()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY)
      if (stored !== 'accepted' && stored !== 'dismissed') setVisible(true)
    } catch {
      setVisible(false)
    }
  }, [])

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'accepted')
    } catch {}
    setVisible(false)
  }

  const dismiss = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'dismissed')
    } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0a0a0a]/95 px-4 py-3 shadow-lg backdrop-blur sm:px-6"
      role="dialog"
      aria-label={t('cookie.bannerLabel')}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {t('cookie.message')}{' '}
          <Link to="/privacy" className="text-[#FACC15] underline hover:no-underline">
            {t('nav.privacy')}
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={dismiss}
            className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-white/5"
          >
            {t('cookie.decline')}
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-md bg-[#FACC15] px-3 py-1.5 text-sm font-medium text-[#0a0a0a] transition hover:opacity-90"
          >
            {t('cookie.accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
