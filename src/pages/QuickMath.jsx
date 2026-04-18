import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/context/LanguageContext'
import PageComments from '@/components/PageComments'

const OPS = [
  { fn: (a, b) => a + b, sym: '+' },
  { fn: (a, b) => a - b, sym: '-' },
  { fn: (a, b) => a * b, sym: '×' },
]
const TOTAL_ROUNDS = 10
const TIME_PER_QUESTION = 10

function genQuestion() {
  const op = OPS[Math.floor(Math.random() * OPS.length)]
  let a, b
  if (op.sym === '-') {
    a = Math.floor(Math.random() * 20) + 10
    b = Math.floor(Math.random() * 10)
    if (b > a) [a, b] = [b, a]
  } else if (op.sym === '×') {
    a = Math.floor(Math.random() * 9) + 2
    b = Math.floor(Math.random() * 9) + 2
  } else {
    a = Math.floor(Math.random() * 20)
    b = Math.floor(Math.random() * 20)
  }
  const answer = op.fn(a, b)
  const wrong = [answer - 2, answer - 1, answer + 1, answer + 2].filter((x) => x !== answer && x >= 0)
  const options = [answer, ...wrong.slice(0, 3)]
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]]
  }
  return { a, b, op, answer, options }
}

export default function QuickMath() {
  const { t } = useLanguage()
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState(null)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const [finished, setFinished] = useState(false)

  const loadQuestion = useCallback(() => {
    setQuestion(genQuestion())
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
    const correct = Number(choice) === question.answer
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
              <p className="text-4xl font-bold text-center my-8">
                {question?.a} {question?.op.sym} {question?.b} = ?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {question?.options.map((opt) => (
                  <Button
                    key={opt}
                    variant="outline"
                    size="lg"
                    className="text-xl"
                    onClick={() => handleAnswer(opt)}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <PageComments pageKey="/mini-games/quick-math" />
    </div>
  )
}
