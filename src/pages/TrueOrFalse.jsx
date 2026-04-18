import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/context/LanguageContext'
import PageComments from '@/components/PageComments'
import { getTrueFalseQuestion } from '@/data/gameData'

const TOTAL_ROUNDS = 10
const TIME_PER_QUESTION = 10

export default function TrueOrFalse() {
  const { t } = useLanguage()
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState(null)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const [finished, setFinished] = useState(false)

  const loadQuestion = useCallback(() => {
    setQuestion(getTrueFalseQuestion())
    setTimeLeft(TIME_PER_QUESTION)
  }, [])

  useEffect(() => {
    if (round < TOTAL_ROUNDS && !finished) loadQuestion()
  }, [round, finished, loadQuestion])

  useEffect(() => {
    if (finished || !question) return
    const id = setInterval(() => setTimeLeft((x) => (x <= 1 ? 0 : x - 1)), 1000)
    return () => clearInterval(id)
  }, [round, question, finished])

  useEffect(() => {
    if (timeLeft === 0 && question && !finished) {
      if (round + 1 >= TOTAL_ROUNDS) setFinished(true)
      else setRound((r) => r + 1)
    }
  }, [timeLeft, question, finished, round])

  const handleAnswer = (choice) => {
    if (!question) return
    const correct = choice === question.answer
    if (correct) setScore((s) => s + 1)
    if (round + 1 >= TOTAL_ROUNDS) setFinished(true)
    else setRound((r) => r + 1)
  }

  const restart = () => {
    setRound(0)
    setScore(0)
    setFinished(false)
    loadQuestion()
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
            {t('games.score')}: {score} | {t('games.round')} {round + 1}/{TOTAL_ROUNDS}
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
                {t('games.finalScore')}: {score} / {TOTAL_ROUNDS}
              </p>
              <Button onClick={restart} className="mt-4 gap-2">
                <RotateCcw className="size-4" />
                {t('playQuiz.playAgain')}
              </Button>
            </div>
          ) : (
            <>
              <p className="text-xl font-medium text-center my-8" dir="auto">
                {question?.statement}
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" variant="outline" onClick={() => handleAnswer(true)} className="gap-2">
                  <ThumbsUp className="size-5" />
                  {t('games.true')}
                </Button>
                <Button size="lg" variant="outline" onClick={() => handleAnswer(false)} className="gap-2">
                  <ThumbsDown className="size-5" />
                  {t('games.false')}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <PageComments pageKey="/mini-games/true-false" />
    </div>
  )
}
