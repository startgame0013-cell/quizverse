import { useLanguage } from '@/context/LanguageContext'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function BackNextBar() {
  const { t, lang } = useLanguage()
  const isRtl = lang === 'ar'

  return (
    <div
      className="flex items-center justify-center gap-2 border-b border-white/5 bg-[#0a0a0a] px-4 py-2"
      role="navigation"
      aria-label={t('nav.back') + ', ' + t('nav.next')}
    >
      <button
        type="button"
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-3 py-1.5 text-sm text-muted-foreground transition hover:border-[#FACC15] hover:bg-white/5 hover:text-[#FACC15]"
        title={t('nav.back')}
      >
        {isRtl ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        <span>{t('nav.back')}</span>
      </button>
      <button
        type="button"
        onClick={() => window.history.forward()}
        className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-3 py-1.5 text-sm text-muted-foreground transition hover:border-[#FACC15] hover:bg-white/5 hover:text-[#FACC15]"
        title={t('nav.next')}
      >
        <span>{t('nav.next')}</span>
        {isRtl ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
      </button>
    </div>
  )
}
