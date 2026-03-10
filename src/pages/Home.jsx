import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Play,
  PenSquare,
  Trophy,
  Gamepad2,
  Users,
  Sparkles,
  BookOpen,
  School,
  UserCircle,
  Heart,
  LayoutList,
  Radio,
  Brain,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Section from '@/components/Section'
import { useLanguage } from '@/context/LanguageContext'

const iconClass = 'size-5 shrink-0'

import API from '@/lib/api.js'

function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(n)
}

export default function Home() {
  const { t, lang, setLang } = useLanguage()
  const [stats, setStats] = useState([
    { value: '...', labelKey: 'home.statsQuizzes', icon: PenSquare },
    { value: '...', labelKey: 'home.statsPlayers', icon: Users },
    { value: '...', labelKey: 'home.statsSchools', icon: School },
  ])

  useEffect(() => {
    if (!API) return
    fetch(`${API}/api/stats`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.quizzes !== undefined) {
          setStats([
            { value: formatCount(data.quizzes), labelKey: 'home.statsQuizzes', icon: PenSquare },
            { value: formatCount(data.players), labelKey: 'home.statsPlayers', icon: Users },
            { value: formatCount(data.schools), labelKey: 'home.statsSchools', icon: School },
          ])
        } else {
          setStats([
            { value: '0', labelKey: 'home.statsQuizzes', icon: PenSquare },
            { value: '0', labelKey: 'home.statsPlayers', icon: Users },
            { value: '0', labelKey: 'home.statsSchools', icon: School },
          ])
        }
      })
      .catch(() => {
        setStats([
          { value: '0', labelKey: 'home.statsQuizzes', icon: PenSquare },
          { value: '0', labelKey: 'home.statsPlayers', icon: Users },
          { value: '0', labelKey: 'home.statsSchools', icon: School },
        ])
      })
  }, [API])


  const audienceSections = [
    {
      titleKey: 'home.forTeachers',
      subtitleKey: 'home.forTeachersSub',
      descKey: 'home.forTeachersDesc',
      icon: BookOpen,
      ctaKey: 'home.forTeachersCta',
      to: '/create-quiz',
    },
    {
      titleKey: 'home.forSchools',
      subtitleKey: 'home.forSchoolsSub',
      descKey: 'home.forSchoolsDesc',
      icon: School,
      ctaKey: 'home.forSchoolsCta',
      to: '/create-quiz',
    },
    {
      titleKey: 'home.forStudents',
      subtitleKey: 'home.forStudentsSub',
      descKey: 'home.forStudentsDesc',
      icon: UserCircle,
      ctaKey: 'home.forStudentsCta',
      to: '/join',
    },
    {
      titleKey: 'home.forFamilies',
      subtitleKey: 'home.forFamiliesSub',
      descKey: 'home.forFamiliesDesc',
      icon: Heart,
      ctaKey: 'home.forFamiliesCta',
      to: '/join',
    },
  ]

  const howItWorksSteps = [
    { titleKey: 'home.step1Title', descKey: 'home.step1Desc', to: '/create-quiz', icon: PenSquare },
    { titleKey: 'home.step2Title', descKey: 'home.step2Desc', to: '/join', icon: Play },
    { titleKey: 'home.step3Title', descKey: 'home.step3Desc', to: '/leaderboard', icon: Trophy },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t('home.headline')}{' '}
            <span className="text-primary">{t('home.brand')}</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="gap-2 shadow-glow" asChild>
              <Link to="/create-quiz">
                <PenSquare className={iconClass} />
                {t('home.startCreating')}
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link to="/join">
                <Play className={iconClass} />
                {t('home.joinGame')}
              </Link>
            </Button>
            <button
              type="button"
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="inline-flex items-center justify-center rounded-lg border-2 border-[#FACC15] bg-[#FACC15] px-6 py-3 text-base font-semibold text-[#0a0a0a] transition-colors hover:bg-[#FACC15]/90"
            >
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <Section className="border-t border-border bg-muted/30" title={null} subtitle={null}>
        <div className="grid gap-6 sm:grid-cols-3">
          {stats.map(({ value, labelKey, icon: Icon }) => (
            <Card key={labelKey} className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary mb-3">
                  <Icon className="size-6" />
                </div>
                <p className="text-2xl font-bold text-foreground sm:text-3xl">{value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t(labelKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Feature cards */}
      <Section title={null} subtitle={null} className="border-t border-border">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { titleKey: 'home.interactiveQuizzes', descKey: 'home.interactiveQuizzesDesc', to: '/create-quiz', icon: LayoutList },
            { titleKey: 'home.aiGeneration', descKey: 'home.aiGenerationDesc', to: '/ai-generator', icon: Sparkles },
            { titleKey: 'home.liveModes', descKey: 'home.liveModesDesc', to: '/join', icon: Radio },
            { titleKey: 'home.leaderboardCard', descKey: 'home.leaderboardCardDesc', to: '/leaderboard', icon: Trophy },
            { titleKey: 'home.miniGamesCard', descKey: 'home.miniGamesCardDesc', to: '/mini-games', icon: Brain },
          ].map(({ titleKey, descKey, to, icon: Icon }) => (
            <Link key={to} to={to}>
              <Card className="h-full transition-all hover:border-primary/30 hover:shadow-soft group">
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary group-hover:bg-primary/25 transition-colors">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {t(titleKey)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t(descKey)}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section
        title={t('home.howItWorks')}
        subtitle={t('home.howItWorksSub')}
        className="border-t border-border"
      >
        <div className="grid gap-6 sm:grid-cols-3">
          {howItWorksSteps.map(({ titleKey, descKey, to, icon: Icon }) => (
            <Link key={to} to={to}>
              <Card className="h-full transition-all hover:border-primary/30 hover:shadow-soft group">
                <CardContent className="pt-6 text-center">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary group-hover:bg-primary/25 transition-colors">
                    <Icon className="size-6" strokeWidth={2} />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {t(titleKey)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t(descKey)}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* Audience: teachers, schools, students, families */}
      <Section
        title={t('home.builtFor')}
        subtitle={t('home.builtForSub')}
        className="border-t border-border bg-muted/20"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {audienceSections.map(({ titleKey, subtitleKey, descKey, icon: Icon, ctaKey, to }) => (
            <Card key={titleKey} className="overflow-hidden">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Icon className="size-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{t(titleKey)}</CardTitle>
                  <CardDescription className="mt-1">{t(subtitleKey)}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t(descKey)}</p>
                <Button size="sm" className="mt-4 gap-2" asChild>
                  <Link to={to}>
                    {t(ctaKey)}
                    <Play className="size-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="border-t border-border pb-20" title={null} subtitle={null}>
        <Card className="mx-auto max-w-2xl text-center">
          <CardHeader>
            <CardTitle className="text-2xl">{t('home.readyToPlay')}</CardTitle>
            <CardDescription className="text-base">
              {t('home.readyToPlaySub')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="gap-2" asChild>
              <Link to="/get-started">
                <Sparkles className={iconClass} />
                {t('home.getStarted')}
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link to="/join">
                <Play className={iconClass} />
                {t('home.joinWithPin')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </Section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Link to="/" className="text-lg font-bold text-primary">
              QuizNova
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <Link to="/create-quiz" className="transition-colors hover:text-foreground">{t('nav.createQuiz')}</Link>
              <Link to="/join" className="transition-colors hover:text-foreground">{t('nav.joinGame')}</Link>
              <Link to="/leaderboard" className="transition-colors hover:text-foreground">{t('nav.leaderboard')}</Link>
              <Link to="/mini-games" className="transition-colors hover:text-foreground">{t('nav.miniGames')}</Link>
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
