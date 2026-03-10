import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Users, Radio, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/context/LanguageContext'
import { DEMO_GAME_SESSION } from '@/data/demoContent'

import API from '@/lib/api.js'

export default function WaitingRoom() {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const pin = searchParams.get('pin') || DEMO_GAME_SESSION.pin
  const [session, setSession] = useState({ ...DEMO_GAME_SESSION, pin })

  useEffect(() => {
    if (!pin || !API) return
    fetch(`${API}/api/game/session/${pin}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.session) {
          setSession({
            pin: d.session.pin,
            hostName: d.session.hostName || 'Host',
            quizTitle: d.session.quizTitle || 'Quiz',
            playersJoined: d.session.playersCount || 0,
            players: d.session.players || [],
          })
        }
      })
      .catch(() => {})
  }, [pin])

  const players = session.players || []
  const playersCount = players.length || session.playersJoined || 0

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <Card className="shadow-soft border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary">
            <Radio className="size-8" />
          </div>
          <CardTitle className="mt-4 text-xl text-primary">{t('waitingRoom.youJoined')}</CardTitle>
          <p className="text-muted-foreground">{t('waitingRoom.title')}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-xl bg-muted/30 p-4 space-y-2">
            <p className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t('waitingRoom.hostName')}:</span>
              <span className="font-medium">{session.hostName}</span>
            </p>
            <p className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t('waitingRoom.quizTitle')}:</span>
              <span className="font-medium">{session.quizTitle}</span>
            </p>
            <p className="flex items-center gap-2 text-sm">
              <Users className="size-4 text-primary" />
              <span>{playersCount} {t('waitingRoom.playersJoined')}</span>
            </p>
            {players.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {players.map((p, i) => (
                  <li key={i}>{i + 1}. {p.nickname}</li>
                ))}
              </ul>
            )}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Game PIN: <span className="font-mono font-bold text-primary">{pin}</span>
          </p>
          <Button variant="outline" className="w-full gap-2" asChild>
            <Link to="/">
              <Home className="size-4" />
              Back to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
