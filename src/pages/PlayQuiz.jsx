import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getQuizById } from '@/lib/quizStore'
import { useLanguage } from '@/context/LanguageContext'

export default function PlayQuiz() {
  const { t } = useLanguage()
  const { id } = useParams()
  const quiz = getQuizById(id)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)

  if (!quiz) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">{t('playQuiz.notFound')}</p>
        <Button asChild className="mt-4">
          <Link to="/my-quizzes">{t('playQuiz.backToQuizzes')}</Link>
        </Button>
      </div>
    )
  }

  const questions = quiz.questions || []
  const current = questions[currentIndex]
  const selected = answers[currentIndex] ?? null
  const isFirst = currentIndex === 0
  const isLast = currentIndex === questions.length - 1

  const handleAnswer = (index) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: index }))
  }

  const handleNext = () => {
    if (isLast) {
      setFinished(true)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirst) setCurrentIndex((i) => i - 1)
  }

  const score = Object.entries(answers).reduce(
    (acc, [idx, choice]) =>
      questions[Number(idx)]?.correctIndex === choice ? acc + 1 : acc,
    0
  )

  if (finished) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <CheckCircle className="size-6" />
              {t('playQuiz.quizComplete')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {score} / {questions.length} {t('playQuiz.correct')}
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild>
                <Link to="/my-quizzes">{t('playQuiz.myQuizzes')}</Link>
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                {t('playQuiz.playAgain')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const showResult = selected !== null

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/my-quizzes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="size-4" />
        {t('playQuiz.backToQuizzes')}
      </Link>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{quiz.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('playQuiz.questionOf')} {currentIndex + 1} {t('playQuiz.of')} {questions.length}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg font-medium text-foreground">{current?.text}</p>
          <div className="space-y-2">
            {current?.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAnswer(i)}
                className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                  selected === null
                    ? 'border-input bg-background hover:border-primary/30'
                    : i === current.correctIndex
                    ? 'border-primary bg-primary/15 text-primary'
                    : selected === i && i !== current.correctIndex
                    ? 'border-destructive bg-destructive/10 text-destructive'
                    : 'border-input bg-muted/30 text-muted-foreground'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* أسهم رجوع وتالي */}
          <div className="flex items-center justify-between gap-4 pt-6 border-t border-border mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirst}
              className="gap-2 min-w-[120px]"
            >
              <ChevronLeft className="size-5" />
              {t('playQuiz.previous')}
            </Button>
            <span className="text-sm text-muted-foreground shrink-0">
              {currentIndex + 1} / {questions.length}
            </span>
            <Button
              type="button"
              onClick={handleNext}
              disabled={!showResult}
              className="gap-2 min-w-[120px]"
            >
              {isLast ? t('playQuiz.seeResults') : t('playQuiz.next')}
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
