import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/context/LanguageContext'
import PageComments from '@/components/PageComments'
import { getTriviaQuestion } from '@/data/gameData'

const TOTAL_TIME = 30

export default function QuickTrivia() {
  const { t, lang } = useLanguage()
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState(null)
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [finished, setFinished] = useState(false)
  const questionCount = useRef(0)

  const loadQuestion = useCallback(() => {
    setQuestion(getTriviaQuestion(lang))
    questionCount.current += 1
  }, [lang])

  useEffect(() => {
    if (!finished) loadQuestion()
  }, [finished, loadQuestion])

  useEffect(() => {
    if (finished || !question) return
    const id = setInterval(() => {
      setTimeLeft((x) => {
        if (x <= 1) return 0
        return x - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [question, finished])

  useEffect(() => {
    if (timeLeft === 0 && !finished) setFinished(true)
  }, [timeLeft, finished])

  const handleAnswer = (index) => {
    if (!question || finished) return
    const correct = index === question.correctIndex
    if (correct) setScore((s) => s + 1)
    loadQuestion()
  }

  const restart = () => {
    setScore(0)
    setTimeLeft(TOTAL_TIME)
    setFinished(false)
    questionCount.current = 0
  }

  if (!question && !finished) return null

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <Link to="/mini-games" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          {t('miniGames.title')}
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {t('games.score')}: {score} | {t('games.round')} {questionCount.current}
          </span>
          {!finished && <span className="text-sm font-mono text-primary">{timeLeft}s</span>}
          <Button variant="ghost" size="sm" onClick={restart} className="gap-1">
            <RotateCcw className="size-4" />
            {t('games.restart')}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {finished ? (
            <div className="text-center py-12">
              <p className="text-2xl font-bold text-primary">{t('games.gameOver')}</p>
              <p className="mt-2 text-muted-foreground">
                {t('games.finalScore')}: {score} {t('playQuiz.correct')} in {TOTAL_TIME}s
              </p>
              <Button onClick={restart} className="mt-4 gap-2">
                <RotateCcw className="size-4" />
                {t('playQuiz.playAgain')}
              </Button>
            </div>
          ) : (
            <>
              <p className="text-xl font-medium text-center my-6" dir="auto">
                {question?.question}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {question?.options.map((opt, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="lg"
                    className="w-full justify-center"
                    onClick={() => handleAnswer(i)}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <PageComments pageKey="/mini-games/quick-trivia" />
    </div>
  )
}
