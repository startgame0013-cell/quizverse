import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'

const socials = [
  {
    key: 'instagram',
    label: 'Instagram',
    href: 'https://example.com',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.38-2.56a1.19 1.19 0 1 1 0 2.38 1.19 1.19 0 0 1 0-2.38Z" />
      </svg>
    ),
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    href: 'https://example.com',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M14.47 3c.2 1.69 1.14 3.28 2.55 4.28A6.62 6.62 0 0 0 21 8.5v2.77a9.2 9.2 0 0 1-3.94-.96v5.27c0 3.34-2.66 6.14-6.05 6.41A6.5 6.5 0 0 1 4 15.53 6.5 6.5 0 0 1 10.5 9c.32 0 .63.02.94.07v3.06a3.75 3.75 0 1 0 2.03 3.45V3h1Z" />
      </svg>
    ),
  },
  {
    key: 'x',
    label: 'X',
    href: 'https://example.com',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M18.9 2H22l-6.77 7.73L23.2 22h-6.26l-4.9-6.41L6.43 22H3.3l7.24-8.28L.8 2h6.42l4.43 5.85L18.9 2Zm-1.1 18.1h1.73L6.3 3.8H4.45L17.8 20.1Z" />
      </svg>
    ),
  },
]

export default function FooterExtras({ compact = false }) {
  const { t } = useLanguage()
  return (
    <div className={compact ? 'mt-5 border-t border-white/5 pt-5' : 'mt-6 border-t border-border pt-6'}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="text-center sm:text-right">
          <p className="mb-2 text-sm">
            <Link
              to="/feedback"
              className="font-semibold text-[#FACC15] underline-offset-4 transition-colors hover:underline"
            >
              {t('nav.feedback')}
            </Link>
          </p>
          <p className="text-sm font-semibold text-[#FACC15]">للتواصل والاقتراحات والشكاوي</p>
          <a
            href="mailto:a.o.sh.369@gmail.com"
            className="mt-2 inline-block text-sm text-gray-300 transition-colors hover:text-[#FACC15]"
          >
            a.o.sh.369@gmail.com
          </a>
          <p className="mt-2 text-xs text-gray-500">Developed by: Ajayeb Alshammari</p>
        </div>

        <div className="flex items-center justify-center gap-3 sm:justify-start">
          {socials.map((social) => (
            <a
              key={social.key}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#FACC15]/30 bg-[#FACC15]/10 text-sm font-semibold text-[#FACC15] transition-all hover:border-[#FACC15] hover:bg-[#FACC15] hover:text-[#0a0a0a]"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
