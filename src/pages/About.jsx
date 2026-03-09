import { Link } from 'react-router-dom'
import { BookOpen, Target, Users } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import Section from '@/components/Section'
import { Button } from '@/components/ui/button'

export default function About() {
  const { t } = useLanguage()

  return (
    <div className="py-10">
      <Section title={t('about.title')} subtitle={t('about.subtitle')}>
        <div className="mx-auto max-w-2xl space-y-8">
          <p className="text-lg text-muted-foreground">{t('about.intro')}</p>

          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Target className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{t('about.missionTitle')}</h3>
              <p className="mt-1 text-muted-foreground">{t('about.missionText')}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Users className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{t('about.whoTitle')}</h3>
              <p className="mt-1 text-muted-foreground">{t('about.whoText')}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <BookOpen className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{t('about.featuresTitle')}</h3>
              <p className="mt-1 text-muted-foreground">{t('about.featuresText')}</p>
            </div>
          </div>

          <Button asChild>
            <Link to="/create-quiz">{t('about.cta')}</Link>
          </Button>
        </div>
      </Section>
    </div>
  )
}
