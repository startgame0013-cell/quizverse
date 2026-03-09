import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import Section from '@/components/Section'

export default function Privacy() {
  const { t } = useLanguage()

  return (
    <div className="py-10">
      <Section title={t('privacy.title')} subtitle={t('privacy.subtitle')}>
        <div className="max-w-none space-y-6 text-muted-foreground">
          <h3 className="text-lg font-semibold text-foreground">{t('privacy.collect')}</h3>
          <p>{t('privacy.collectText')}</p>

          <h3 className="text-lg font-semibold text-foreground">{t('privacy.use')}</h3>
          <p>{t('privacy.useText')}</p>

          <h3 className="text-lg font-semibold text-foreground">{t('privacy.cookies')}</h3>
          <p>{t('privacy.cookiesText')}</p>

          <h3 className="text-lg font-semibold text-foreground">{t('privacy.analytics')}</h3>
          <p>{t('privacy.analyticsText')}</p>

          <h3 className="text-lg font-semibold text-foreground">{t('privacy.rights')}</h3>
          <p>{t('privacy.rightsText')}</p>

          <h3 className="text-lg font-semibold text-foreground">{t('privacy.contact')}</h3>
          <p>{t('privacy.contactText')}</p>

          <p className="pt-6 text-sm text-muted-foreground">{t('privacy.updated')}</p>

          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline">
            <Shield className="size-4" />
            {t('privacy.backHome')}
          </Link>
        </div>
      </Section>
    </div>
  )
}
