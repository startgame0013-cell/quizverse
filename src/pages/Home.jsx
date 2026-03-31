import { Link } from 'react-router-dom'
import { Play, Sparkles, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/context/LanguageContext'

export default function Home() {
  const { t } = useLanguage()
  const featureCards = [
    {
      titleKey: 'home.kuwaitCurriculaTitle',
      descKey: 'home.cleanFeatureCurriculaDesc',
      to: '/quizzes',
      icon: GraduationCap,
    },
    {
      titleKey: 'home.cleanFeaturePlay',
      descKey: 'home.cleanFeaturePlayDesc',
      to: '/join',
      icon: Play,
    },
    {
      titleKey: 'home.aiGeneration',
      descKey: 'home.cleanFeatureAiDesc',
      to: '/ai-generator',
      icon: Sparkles,
    },
  ]

  return (
    <div>
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
            QuizVerse
          </p>
          <div className="mt-8">
            <Button size="lg" className="min-w-[180px] shadow-glow" asChild>
              <Link to="/quizzes">
                {t('home.getStarted')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {featureCards.map(({ titleKey, descKey, to, icon: Icon }) => (
            <Link key={to} to={to} className="group">
              <Card className="h-full border-border/60 bg-card/90 transition-all hover:border-primary/40 hover:shadow-soft">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary/25">
                    <Icon className="size-6" />
                  </div>
                  <CardTitle className="pt-2 text-xl group-hover:text-primary">
                    {t(titleKey)}
                  </CardTitle>
                  <CardDescription className="text-sm leading-6">
                    {t(descKey)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-sm font-medium text-primary">
                    {t('home.cleanFeatureExplore')}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-border bg-card px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Link to="/" className="text-lg font-bold text-primary">
              QuizVerse
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <Link to="/create-quiz" className="transition-colors hover:text-foreground">{t('nav.createQuiz')}</Link>
              <Link to="/join" className="transition-colors hover:text-foreground">{t('nav.joinGame')}</Link>
              <Link to="/leaderboard" className="transition-colors hover:text-foreground">{t('nav.leaderboard')}</Link>
              <Link to="/mini-games" className="transition-colors hover:text-foreground">{t('nav.miniGames')}</Link>
              <Link to="/flashcards" className="transition-colors hover:text-foreground">{t('nav.flashcards')}</Link>
              <Link to="/ai-generator" className="transition-colors hover:text-foreground">{t('nav.aiGenerator')}</Link>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            {t('home.footerTagline')}
          </p>
        </div>
      </footer>
    </div>
  )
}
