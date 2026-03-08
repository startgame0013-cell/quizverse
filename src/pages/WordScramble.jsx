import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/context/LanguageContext'
import { getScrambledWord } from '@/data/gameData'

const TOTAL_ROUNDS = 5
const TIME_LIMIT = 30

export default function WordScramble() {
  const { t } = useLanguage()
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [current, setCurrent] = useState(null)
  const [input, setInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [finished, setFinished] = useState(false)

  const loadWord = useCallback(() => {
    const w = getScrambledWord()
    setCurrent(w)
    setInput('')
    setTimeLeft(TIME_LIMIT)
  }, [])

  useEffect(() => {
    if (!finished && round < TOTAL_ROUNDS) loadWord()
  }, [round, finished, loadWord])

  useEffect(() => {
    if (finished || !current) return
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [round, current, finished])

  useEffect(() => {
    if (timeLeft === 0 && current && !finished) {
      if (round + 1 >= TOTAL_ROUNDS) setFinished(true)
      else setRound((r) => r + 1)
    }
  }, [timeLeft, current, finished, round])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!current || !input.trim()) return
    const correct = input.trim().toLowerCase() === current.word.toLowerCase()
    nextRound(correct)
  }

  const nextRound = (correct) => {
    if (correct) setScore((s) => s + 1)
    if (round + 1 >= TOTAL_ROUNDS) {
      setFinished(true)
    } else {
      setRound((r) => r + 1)
      loadWord()
    }
  }

  const restart = () => {
    setRound(0)
    setScore(0)
    setFinished(false)
    loadWord()
  }

  if (!current && !finished) return null

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
              <p className="text-sm text-muted-foreground mb-2">{t('games.unscramble')}</p>
              <p className="text-3xl font-mono font-bold text-primary mb-6">{current?.scrambled}</p>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('games.typeAnswer')}
                  className="text-lg"
                  autoFocus
                />
                <Button type="submit" className="gap-2">
                  <Check className="size-4" />
                  {t('games.submit')}
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
