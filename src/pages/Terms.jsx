import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import Section from '@/components/Section'

export default function Terms() {
  const { t } = useLanguage()

  return (
    <div className="py-10">
      <Section title={t('terms.title')} subtitle={t('terms.subtitle')}>
        <div className="max-w-none space-y-6 text-muted-foreground">
          <h3 className="text-lg font-semibold text-foreground">{t('terms.acceptance')}</h3>
          <p>{t('terms.acceptanceText')}</p>

          <h3 className="text-lg font-semibold text-foreground">{t('terms.service')}</h3>
          <p>{t('terms.serviceText')}</p>

          <h3 className="text-lg font-semibold text-foreground">{t('terms.accounts')}</h3>
          <p>{t('terms.accountsText')}</p>

          <h3 className="text-lg font-semibold text-foreground">{t('terms.subscriptions')}</h3>
          <p>{t('terms.subscriptionsText')}</p>

          <h3 className="text-lg font-semibold text-foreground">{t('terms.content')}</h3>
          <p>{t('terms.contentText')}</p>

          <h3 className="text-lg font-semibold text-foreground">{t('terms.conduct')}</h3>
          <p>{t('terms.conductText')}</p>

          <h3 className="text-lg font-semibold text-foreground">{t('terms.termination')}</h3>
          <p>{t('terms.terminationText')}</p>

          <h3 className="text-lg font-semibold text-foreground">{t('terms.contact')}</h3>
          <p>{t('terms.contactText')}</p>

          <p className="pt-6 text-sm text-muted-foreground">{t('terms.updated')}</p>

          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline">
            <FileText className="size-4" />
            {t('terms.backHome')}
          </Link>
        </div>
      </Section>
    </div>
  )
}
