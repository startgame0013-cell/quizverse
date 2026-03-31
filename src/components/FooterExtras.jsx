const socials = [
  { key: 'instagram', label: 'Instagram', href: 'https://example.com', icon: '◎' },
  { key: 'tiktok', label: 'TikTok', href: 'https://example.com', icon: '♪' },
  { key: 'x', label: 'X', href: 'https://example.com', icon: '𝕏' },
]

export default function FooterExtras({ compact = false }) {
  return (
    <div className={compact ? 'mt-5 border-t border-white/5 pt-5' : 'mt-6 border-t border-border pt-6'}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="text-center sm:text-right">
          <p className="text-sm font-semibold text-[#FACC15]">للتواصل والاقتراحات والشكاوي</p>
          <a
            href="mailto:a.o.sh.369@gmail.com"
            className="mt-2 inline-block text-sm text-gray-300 transition-colors hover:text-[#FACC15]"
          >
            a.o.sh.369@gmail.com
          </a>
          <p className="mt-2 text-xs text-gray-500">تطوير: عجايب الشمري</p>
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
              <span aria-hidden="true">{social.icon}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
