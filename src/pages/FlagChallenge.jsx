import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/context/LanguageContext'
import { getFlagQuestion } from '@/data/gameData'

const TOTAL_ROUNDS = 8
const TIME_PER_QUESTION = 15

export default function FlagChallenge() {
  const { t, lang } = useLanguage()
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState(null)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const [finished, setFinished] = useState(false)

  const loadQuestion = useCallback(() => {
    setQuestion(getFlagQuestion(lang))
    setTimeLeft(TIME_PER_QUESTION)
  }, [lang])

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

  const handleAnswer = (index) => {
    if (!question) return
    const correct = index === question.correctIndex
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
              <p className="text-6xl text-center my-8">{question?.flag}</p>
              <p className="text-sm text-muted-foreground text-center mb-4">
                {t('games.whichCountry')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {question?.options.map((opt, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="lg"
                    onClick={() => handleAnswer(i)}
                    className="justify-center"
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
