import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Radio, Users, Trophy, Play, ChevronRight, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/context/LanguageContext'
import { useToast } from '@/context/ToastContext'
import { createSocket } from '@/lib/socket'
import { getQuestionDisplay } from '@/lib/quizStore'

import API from '@/lib/api.js'

export default function HostLiveGame() {
  const { pin } = useParams()
  const [searchParams] = useSearchParams()
  const { t, lang } = useLanguage()
  const { success } = useToast()
  const [session, setSession] = useState(null)
  const [socket, setSocket] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [leaderboard, setLeaderboard] = useState([])
  const [gameEnded, setGameEnded] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [copied, setCopied] = useState(false)
  const [players, setPlayers] = useState([])

  let quizData = session?.quizData
  if (!quizData && searchParams.get('quizData')) {
    try {
      quizData = JSON.parse(decodeURIComponent(searchParams.get('quizData') || '{}'))
    } catch {
      quizData = null
    }
  }
  const questions = quizData?.questions || []
  const joinUrl = `${window.location.origin}/join?pin=${pin}`

  useEffect(() => {
    if (!pin || !API) return
    fetch(`${API}/api/game/session/${pin}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.session) {
          setSession(d.session)
          if (d.session.players?.length) setPlayers(d.session.players.map((p, i) => ({ index: i, nickname: p.nickname })))
        }
      })
      .catch(() => {})
  }, [pin])

  useEffect(() => {
    const s = createSocket()
    if (!s) return
    setSocket(s)
    s.emit('host:join', { pin })
    s.on('game:started', () => setShowLeaderboard(false))
    s.on('game:question', ({ question, currentQuestionIndex }) => {
      setCurrentQuestion(question)
      setCurrentIndex(currentQuestionIndex)
      setShowLeaderboard(false)
    })
    s.on('game:leaderboard', ({ leaderboard: lb }) => setLeaderboard(lb || []))
    s.on('game:answer', ({ leaderboard: lb }) => setLeaderboard(lb || []))
    s.on('game:players', ({ players: pl }) => setPlayers(pl || []))
    s.on('game:ended', ({ leaderboard: lb }) => {
      setLeaderboard(lb || [])
      setGameEnded(true)
      setShowLeaderboard(true)
    })
    return () => s?.disconnect()
  }, [pin])

  const handleStart = () => {
    socket?.emit('host:start', { pin })
    if (questions[0]) {
      setCurrentQuestion(questions[0])
      setCurrentIndex(0)
    }
  }

  const handleNext = () => {
    if (showLeaderboard) {
      setShowLeaderboard(false)
      if (currentIndex + 1 >= questions.length) {
        socket?.emit('host:next', { pin }) // Backend will emit game:ended
      } else {
        socket?.emit('host:next', { pin })
      }
    } else {
      setShowLeaderboard(true)
      socket?.emit('host:showLeaderboard', { pin })
    }
  }

  const copyPin = () => {
    navigator.clipboard?.writeText(pin).then(() => {
      setCopied(true)
      success(t('live.copyPin', 'PIN copied!'))
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const copyLink = () => {
    navigator.clipboard?.writeText(joinUrl).then(() => {
      success(t('live.copyLink', 'Link copied!'))
    })
  }

  if (!session && !quizData) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-muted-foreground">{t('live.loading', 'Loading...')}</p>
        <Button asChild className="mt-4">
          <Link to="/">{t('notFound.goHome')}</Link>
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
              <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-4 py-3">
                <span className="font-medium">#{p.rank} {p.nickname}</span>
                <span className="text-primary font-bold">{p.score} pts</span>
              </div>
            ))}
            <Button asChild className="w-full gap-2 mt-6">
              <Link to="/">
                {t('live.backHome', 'Back to Home')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (session?.status === 'waiting' && !currentQuestion) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
        <Card className="shadow-soft border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary">
              <Radio className="size-8" />
            </div>
            <CardTitle className="mt-4">{t('live.waitingPlayers', 'Waiting for players')}</CardTitle>
            <p className="text-muted-foreground">{t('live.sharePin', 'Share this PIN with players')}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={copyPin}
                className="text-4xl font-mono font-bold tracking-[0.5em] text-primary hover:opacity-90"
              >
                {pin}
              </button>
              <Button variant="outline" size="icon" onClick={copyPin}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </Button>
            </div>
            <Button variant="outline" className="w-full" onClick={copyLink}>
              {t('live.copyJoinLink', 'Copy Join Link')}
            </Button>
            <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Users className="size-4" />
              {players.length || session?.playersCount || 0} {t('live.playersJoined', 'players joined')}
            </p>
            {players.length > 0 && (
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <p className="text-sm font-medium mb-2">{t('live.playerList', 'Players')}</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {players.map((p, i) => (
                    <li key={i}>{i + 1}. {p.nickname}</li>
                  ))}
                </ul>
              </div>
            )}
            <Button size="lg" className="w-full gap-2" onClick={handleStart}>
              <Play className="size-5" />
              {t('live.startGame', 'Start Game')}
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
              <div key={i} className="flex items-center justify-between rounded-lg border border-border px-4 py-2">
                <span>#{p.rank} {p.nickname}</span>
                <span className="font-semibold text-primary">{p.score}</span>
              </div>
            ))}
            <Button size="lg" className="w-full mt-6 gap-2" onClick={handleNext}>
              <ChevronRight className="size-5" />
              {currentIndex + 1 >= questions.length ? t('live.showWinners', 'Show Winners') : t('live.nextQuestion', 'Next Question')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentQuestion) {
    const d = getQuestionDisplay(currentQuestion, lang)
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>
              {t('live.question', 'Question')} {currentIndex + 1} / {questions.length}
            </CardTitle>
            <p className="text-lg font-medium text-foreground mt-2">{d.text}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-8">
              {d.options?.map((opt, j) => (
                <div key={j} className="rounded-lg border border-border bg-muted/20 px-4 py-3 text-muted-foreground">
                  {String.fromCharCode(65 + j)}. {opt}
                </div>
              ))}
            </div>
            <Button size="lg" className="w-full gap-2" onClick={handleNext}>
              <ChevronRight className="size-5" />
              {t('live.showResults', 'Show Results')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <p className="text-muted-foreground">{t('live.loading', 'Loading...')}</p>
    </div>
  )
}
