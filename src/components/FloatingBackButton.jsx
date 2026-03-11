/**
 * زر رجوع عائم يظهر في كل الصفحات بموضع ثابت.
 * يبقى ظاهراً حتى لو بقية الصفحة سوداء أو فيها خطأ.
 */
import { useLocation } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'

export default function FloatingBackButton() {
  const location = useLocation()
  const { t, lang } = useLanguage()
  const isRtl = lang === 'ar'

  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      aria-label={t('nav.back')}
      style={{
        position: 'fixed',
        top: 80,
        ...(isRtl ? { right: 12, left: 'auto' } : { left: 12, right: 'auto' }),
        zIndex: 9998,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: '#FACC15',
        color: '#0a0a0a',
        border: 'none',
        padding: '10px 16px',
        borderRadius: 8,
        fontWeight: 700,
        fontSize: '1rem',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
      }}
    >
      {isRtl ? '→' : '←'} {t('nav.back')}
    </button>
  )
}
