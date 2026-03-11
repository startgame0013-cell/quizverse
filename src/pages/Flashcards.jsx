import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, RotateCw, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getQuizById, getQuestionDisplay, getQuizDisplay, getAllQuizzes } from '@/lib/quizStore'
import { useLanguage } from '@/context/LanguageContext'

export default function Flashcards() {
  const { t, lang } = useLanguage()
  const { quizId } = useParams()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const quiz = quizId ? getQuizById(quizId) : null
  const quizzes = getAllQuizzes()

  // اختر كويز — عرض قائمة الكويزات
  if (!quizId) {
    const withQuestions = quizzes.filter((q) => (q.questions || []).length > 0)
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">{t('flashcards.title')}</h1>
        <p className="text-muted-foreground mb-8">{t('flashcards.subtitle')}</p>
        {withQuestions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Layers className="mx-auto size-12 mb-4 opacity-50" />
              <p>{t('flashcards.noQuizzes')}</p>
              <Button asChild className="mt-4">
                <Link to="/my-quizzes">{t('flashcards.goToMyQuizzes')}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {withQuestions.map((q) => {
              const d = getQuizDisplay(q, lang)
              const title = d.title || t('flashcards.untitledQuiz')
              return (
                <Link key={q.id} to={`/flashcards/${q.id}`}>
                  <Card className="transition-shadow hover:shadow-lg cursor-pointer">
                    <CardContent className="py-4 flex items-center justify-between">
                      <span className="font-medium truncate">{title}</span>
                      <span className="text-sm text-muted-foreground">{q.questions?.length || 0} {t('flashcards.cards')}</span>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
        <div className="mt-8">
          <Button variant="outline" asChild>
            <Link to="/my-quizzes" className="gap-2">
              <ChevronLeft className="size-4" />
              {t('playQuiz.backToQuizzes')}
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // كويز غير موجود
  if (!quiz) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">{t('playQuiz.notFound')}</p>
        <Button asChild className="mt-4">
          <Link to="/flashcards">{t('flashcards.backToFlashcards')}</Link>
        </Button>
      </div>
    )
  }

  const questions = quiz.questions || []
  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">{t('flashcards.noCards')}</p>
        <Button asChild className="mt-4">
          <Link to="/flashcards">{t('flashcards.backToFlashcards')}</Link>
        </Button>
      </div>
    )
  }

  const current = questions[currentIndex]
  const display = getQuestionDisplay(current, lang)
  const correctAnswer = Array.isArray(display.options) && typeof current.correctIndex === 'number'
    ? (display.options[current.correctIndex] ?? '')
    : ''
  const explanation = lang === 'ar' ? (current.explanationAr || '') : (current.explanation || '')
  const isFirst = currentIndex === 0
  const isLast = currentIndex === questions.length - 1

  const handleFlip = () => setFlipped((f) => !f)
  const handleNext = () => {
    setFlipped(false)
    if (!isLast) setCurrentIndex((i) => i + 1)
  }
  const handlePrev = () => {
    setFlipped(false)
    if (!isFirst) setCurrentIndex((i) => i - 1)
  }

  const quizTitle = getQuizDisplay(quiz, lang).title || ''

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/flashcards" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="size-4" />
        {t('flashcards.backToFlashcards')}
      </Link>

      <p className="text-sm text-muted-foreground mb-2 truncate">{quizTitle}</p>
      <p className="text-sm font-medium text-foreground mb-6">
        {t('flashcards.cardOf')} {currentIndex + 1} / {questions.length}
      </p>

      <div
        className="perspective-[1000px] cursor-pointer mb-8"
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleFlip(); } }}
        aria-label={t('flashcards.flipCard')}
      >
        <div
          className="relative w-full min-h-[280px] transition-transform duration-500 transform-style-3d"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            className="absolute inset-0 rounded-2xl border border-border bg-card shadow-xl backface-hidden flex flex-col overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <p className="text-xl font-medium text-foreground leading-relaxed">{display.text || t('flashcards.noQuestion')}</p>
            </div>
            <div className="px-6 pb-6 pt-2">
              <p className="text-xs text-muted-foreground">{t('flashcards.tapToFlip')}</p>
            </div>
          </div>
          <div
            className="absolute inset-0 rounded-2xl border border-primary/50 bg-primary/5 shadow-xl backface-hidden flex flex-col overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: flipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
            }}
          >
            <div className="flex-1 flex flex-col justify-center p-8 text-center">
              <p className="text-lg font-semibold text-primary mb-2">{correctAnswer}</p>
              {explanation && (
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{explanation}</p>
              )}
            </div>
            <div className="px-6 pb-6 pt-2">
              <p className="text-xs text-muted-foreground">{t('flashcards.tapToFlip')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" size="lg" onClick={handlePrev} disabled={isFirst} className="gap-2">
          {lang === 'ar' ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
          {t('flashcards.prev')}
        </Button>
        <Button variant="outline" size="icon" onClick={handleFlip} title={t('flashcards.flipCard')}>
          <RotateCw className="size-5" />
        </Button>
        <Button variant="outline" size="lg" onClick={handleNext} disabled={isLast} className="gap-2">
          {t('flashcards.next')}
          {lang === 'ar' ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
        </Button>
      </div>
    </div>
  )
}
