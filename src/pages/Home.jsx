import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Play,
  PenSquare,
  Trophy,
  Users,
  Sparkles,
  BookOpen,
  School,
  UserCircle,
  Heart,
  LayoutList,
  Radio,
  Brain,
  Layers,
  ChevronLeft,
  ChevronRight,
  RotateCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Section from '@/components/Section'
import { useLanguage } from '@/context/LanguageContext'
import { getAllQuizzes, getQuizById, getQuestionDisplay, getQuizDisplay } from '@/lib/quizStore'

const iconClass = 'size-5 shrink-0'

import API from '@/lib/api.js'

function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(n)
}

function FlashcardBlock({ t, lang }) {
  let quizzes = []
  try {
    quizzes = getAllQuizzes().filter((q) => (q.questions || []).length > 0)
  } catch {
    // localStorage قد لا يكون متاحاً أثناء البناء
  }
  const [quizId, setQuizId] = useState(quizzes[0]?.id || '')
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const quiz = quizId ? getQuizById(quizId) : null
  const questions = quiz?.questions || []
  const current = questions[index]
  const display = current ? getQuestionDisplay(current, lang) : { text: '', options: [] }
  const correctAnswer = current && Array.isArray(display.options) && typeof current.correctIndex === 'number'
    ? (display.options[current.correctIndex] ?? '')
    : ''
  const explanation = current && (lang === 'ar' ? (current.explanationAr || current.explanation) : (current.explanation || current.explanationAr))
  const isFirst = index === 0
  const isLast = index >= questions.length - 1

  if (quizzes.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Layers className="size-6" />
          </div>
          <CardTitle className="text-lg mt-3">{t('home.flashcardsCard')}</CardTitle>
          <CardDescription>{t('flashcards.noQuizzes')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" size="sm" asChild>
            <Link to="/my-quizzes">{t('flashcards.goToMyQuizzes')}</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  useEffect(() => {
    if (quizzes.length > 0 && !quizId) setQuizId(quizzes[0].id)
  }, [quizzes.length, quizId])

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Layers className="size-6" />
        </div>
        <CardTitle className="text-lg mt-3">{t('home.flashcardsCard')}</CardTitle>
        <CardDescription>{t('home.flashcardsCardDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0 pt-2">
        <select
          value={quizId}
          onChange={(e) => { setQuizId(e.target.value); setIndex(0); setFlipped(false); }}
          className="mb-3 w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground"
        >
          {quizzes.map((q) => (
            <option key={q.id} value={q.id}>
              {getQuizDisplay(q, lang).title || t('flashcards.untitledQuiz')}
            </option>
          ))}
        </select>
        {current ? (
          <>
            <div
              className="flex-1 min-h-[120px] rounded-xl border border-border bg-muted/20 p-4 flex flex-col justify-center cursor-pointer"
              onClick={() => setFlipped((f) => !f)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped((f) => !f); } }}
            >
              {!flipped ? (
                <p className="text-sm font-medium text-foreground line-clamp-3">{display.text || t('flashcards.noQuestion')}</p>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-primary">{correctAnswer}</p>
                  {explanation && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{explanation}</p>}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">{t('flashcards.tapToFlip')}</p>
            </div>
            <div className="flex items-center justify-between gap-2 mt-3">
              <Button variant="outline" size="sm" onClick={() => { setIndex((i) => Math.max(0, i - 1)); setFlipped(false); }} disabled={isFirst}>
                {lang === 'ar' ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
              </Button>
              <span className="text-xs text-muted-foreground">{index + 1} / {questions.length}</span>
              <Button variant="outline" size="sm" onClick={() => { setIndex((i) => Math.min(questions.length - 1, i + 1)); setFlipped(false); }} disabled={isLast}>
                {lang === 'ar' ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
              </Button>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const { t, lang } = useLanguage()
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
    { titleKey: 'home.step1Title', descKey: 'home.step1Desc', icon: PenSquare },
    { titleKey: 'home.step2Title', descKey: 'home.step2Desc', icon: Play },
    { titleKey: 'home.step3Title', descKey: 'home.step3Desc', icon: Trophy },
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

      {/* Feature cards + بطاقات تعليمية (مستطيل مدمج بجانب ألعاب مصغرة) */}
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
          <FlashcardBlock t={t} lang={lang} />
        </div>
      </Section>

      {/* How it works */}
      <Section
        title={t('home.howItWorks')}
        subtitle={t('home.howItWorksSub')}
        className="border-t border-border"
      >
        <div className="grid gap-6 sm:grid-cols-3">
          {howItWorksSteps.map(({ titleKey, descKey, icon: Icon }) => (
            <Card key={titleKey} className="h-full">
              <CardContent className="pt-6 text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Icon className="size-6" strokeWidth={2} />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {t(titleKey)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{t(descKey)}</p>
              </CardContent>
            </Card>
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
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Footer */}
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
