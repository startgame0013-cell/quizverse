import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Gamepad2, Trophy, Send, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/context/LanguageContext'
import { getQuestionDisplay } from '@/lib/quizStore'
import { createSocket } from '@/lib/socket'
import { requestNotificationPermission, notify } from '@/lib/notifications'

import API from '@/lib/api.js'

export default function LiveGamePlayer() {
  const { pin } = useParams()
  const [searchParams] = useSearchParams()
  const { t, lang } = useLanguage()
  const playerIndex = parseInt(searchParams.get('playerIndex') ?? '-1', 10)
  const nickname = searchParams.get('nickname') ?? ''
  const [socket, setSocket] = useState(null)
  const [session, setSession] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(null)
  const [points, setPoints] = useState(0)
  const [leaderboard, setLeaderboard] = useState([])
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [players, setPlayers] = useState([])
  const [timeRemaining, setTimeRemaining] = useState(null)
  const questionStartedAt = useRef(null)

  useEffect(() => {
    if (!pin || !API || playerIndex < 0) return
    fetch(`${API}/api/game/session/${pin}`)
      .then((r) => r.json())
      .then((d) => d.ok && setSession(d.session))
      .catch(() => {})
  }, [pin, playerIndex])

  useEffect(() => {
    requestNotificationPermission()
    const s = createSocket()
    if (!s) return
    setSocket(s)
    s.emit('player:join', { pin, playerIndex })
    s.on('game:started', () => {
      notify('Game started!', { body: 'New question coming...' })
      setAnswered(false)
      setCorrect(null)
      setSelectedIndex(null)
    })
    s.on('game:question', ({ question, currentQuestionIndex }) => {
      if (document.hidden) notify('New question!', { body: 'Answer now to score points.' })
      setCurrentQuestion(question)
      setCurrentIndex(currentQuestionIndex ?? 0)
      setAnswered(false)
      setCorrect(null)
      setSelectedIndex(null)
      setShowLeaderboard(false)
      setTimeRemaining(question?.timeLimit ?? null)
      questionStartedAt.current = Date.now()
    })
    s.on('game:answer', ({ playerIndex: pi, correct: c, points: pts, leaderboard: lb }) => {
      if (pi === playerIndex) {
        setCorrect(c)
        setPoints(pts)
        setAnswered(true)
      }
      if (lb?.length) setLeaderboard(lb)
    })
    s.on('game:leaderboard', ({ leaderboard: lb }) => {
      setLeaderboard(lb || [])
      setShowLeaderboard(true)
      setAnswered(false)
    })
    s.on('game:ended', ({ leaderboard: lb }) => {
      if (document.hidden) notify('Game ended!', { body: 'Check the final leaderboard.' })
      setLeaderboard(lb || [])
      setGameEnded(true)
      setShowLeaderboard(true)
    })
    s.on('game:players', ({ players: pl }) => setPlayers(pl || []))
    return () => s?.disconnect()
  }, [pin, playerIndex])

  useEffect(() => {
    if (answered || timeRemaining == null || timeRemaining <= 0) return
    const id = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev == null || prev <= 1) return 0
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [currentQuestion, answered, timeRemaining])

  const timesUp = timeRemaining === 0 && !answered

  const handleAnswer = (answerIndex) => {
    if (answered || timesUp) return
    setSelectedIndex(answerIndex)
    const timeTaken = questionStartedAt.current ? (Date.now() - questionStartedAt.current) / 1000 : 0
    socket?.emit('player:answer', { pin, playerIndex, answerIndex, timeTaken })
    setAnswered(true)
  }

  const questions = session?.quizData?.questions || []
  const q = currentQuestion

  if (playerIndex < 0 || !nickname) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-muted-foreground">{t('live.invalidJoin', 'Invalid join. Use the Join page.')}</p>
        <Button asChild className="mt-4">
          <Link to="/join">{t('joinGame.title')}</Link>
        </Button>
      </div>
    )
  }

  if (gameEnded) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="shadow-soft border-primary/30">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20 text-primary">
              <Trophy className="size-12" />
            </div>
            <CardTitle className="mt-4 text-2xl text-primary">{t('live.winners', 'Game Over - Winners!')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {leaderboard.slice(0, 10).map((p, i) => (
              <div key={i} className={`flex items-center justify-between rounded-xl border px-4 py-3 ${p.nickname === nickname ? 'border-primary bg-primary/10' : 'border-border bg-muted/20'}`}>
                <span className="font-medium">#{p.rank} {p.nickname} {p.nickname === nickname ? '(You)' : ''}</span>
                <span className="font-bold text-primary">{p.score} pts</span>
              </div>
            ))}
            <Button asChild className="w-full gap-2 mt-6">
              <Link to="/">{t('live.backHome', 'Back to Home')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showLeaderboard && leaderboard.length > 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="size-6 text-primary" />
              {t('live.leaderboard', 'Leaderboard')} - {t('live.question', 'Question')} {currentIndex + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaderboard.slice(0, 10).map((p, i) => (
              <div key={i} className={`flex items-center justify-between rounded-lg border px-4 py-2 ${p.nickname === nickname ? 'border-primary bg-primary/10' : 'border-border'}`}>
                <span>#{p.rank} {p.nickname} {p.nickname === nickname ? '(You)' : ''}</span>
                <span className="font-semibold text-primary">{p.score}</span>
              </div>
            ))}
            <p className="text-center text-sm text-muted-foreground mt-4">{t('live.waitNextQuestion', 'Waiting for next question...')}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentQuestion) {
    const d = getQuestionDisplay(q, lang)
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <span>{t('live.question', 'Question')} {currentIndex + 1} / {questions.length}</span>
              {timeRemaining != null && (
                <span className={`text-lg font-mono tabular-nums ${timeRemaining <= 5 ? 'text-red-600 animate-pulse' : 'text-muted-foreground'}`}>
                  {timesUp ? t('live.timeUp', 'Time\'s up!') : `${timeRemaining}s`}
                </span>
              )}
            </CardTitle>
            <p className="text-lg font-medium text-foreground mt-2">{d.text}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {d.options?.map((opt, j) => (
                <button
                  key={j}
                  type="button"
                  disabled={answered || timesUp}
                  onClick={() => handleAnswer(j)}
                  className={`w-full rounded-lg border px-4 py-3 text-left transition-colors disabled:cursor-not-allowed ${
                    answered && selectedIndex === j
                      ? correct ? 'border-green-500 bg-green-500/20 text-green-700 dark:text-green-400' : 'border-red-500 bg-red-500/20 text-red-700 dark:text-red-400'
                      : answered || timesUp ? 'border-border bg-muted/30 opacity-60' : 'border-border bg-muted/20 hover:border-primary hover:bg-primary/10'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {String.fromCharCode(65 + j)}. {opt}
                    {answered && selectedIndex === j && (correct ? <CheckCircle2 className="size-4 text-green-600" /> : <XCircle className="size-4 text-red-600" />)}
                  </span>
                </button>
              ))}
            </div>
            {(answered || timesUp) && (
              <p className="mt-4 text-center font-medium text-primary">
                {timesUp ? t('live.timeUp', 'Time\'s up!') : correct ? t('live.correct', 'Correct!') : t('live.incorrect', 'Incorrect')} — {points} pts
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary mb-4">
        <Gamepad2 className="size-8" />
      </div>
      <p className="text-muted-foreground">{t('live.waitingHost', 'Waiting for host to start...')}</p>
      <p className="text-sm text-muted-foreground mt-2">{t('live.hello', 'Hello')}, {nickname}!</p>
      {players.length > 0 && (
        <div className="mt-6 rounded-xl border border-border bg-muted/20 p-4">
          <p className="text-sm font-medium text-foreground mb-2">{t('live.playerList', 'Players')}</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {players.map((p, i) => (
              <li key={i} className={p.nickname === nickname ? 'text-primary font-medium' : ''}>
                {i + 1}. {p.nickname} {p.nickname === nickname ? '(You)' : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
