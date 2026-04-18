import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function Vortex() {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-[#0a0a0a]">
      {/* Back link - above iframe */}
      <div className="absolute top-4 left-4 z-10">
        <Link
          to="/mini-games"
          className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-black/50 px-4 py-2 text-sm text-white backdrop-blur-sm hover:bg-white/10"
        >
          <ArrowLeft className="size-4" />
          {t('miniGames.title')}
        </Link>
      </div>

      {/* Loading screen */}
      {loading && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-[#0a0a0a]"
          style={{ margin: 0, padding: 0 }}
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-[0.3em] text-[#FACC15] sm:text-5xl">
              VORTEX.IO
            </h1>
            <p className="mt-4 text-sm text-white/60">{t('miniGames.loading', 'Loading...')}</p>
          </div>
        </div>
      )}

      {/* Fullscreen iframe - no padding, no margins */}
      <iframe
        src="/game/game.html"
        title="VORTEX.IO"
        className="absolute inset-0 h-full w-full border-0"
        style={{ margin: 0, padding: 0 }}
        allow="autoplay; fullscreen"
        onLoad={() => setLoading(false)}
      />

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 flex justify-center pb-4 pt-8">
        <Link
          to="/mini-games#mini-games-comments"
          className="pointer-events-auto rounded-full border border-white/25 bg-black/70 px-4 py-2 text-xs font-medium text-[#FACC15] backdrop-blur-sm transition-colors hover:border-[#FACC15]/60 hover:bg-black/85 sm:text-sm"
        >
          {t('pageComments.vortexLink')}
        </Link>
      </div>
    </div>
  )
}
