import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Gamepad2, KeyRound, User, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/context/LanguageContext'
import PageComments from '@/components/PageComments'
import { useToast } from '@/context/ToastContext'
import API from '@/lib/api.js'

export default function JoinGame() {
  const { t } = useLanguage()
  const { success, error: showError } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [pin, setPin] = useState(searchParams.get('pin') || '')
  const [nickname, setNickname] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!API) {
      success(t('live.demoJoin', 'Demo mode — joining...'))
      navigate(`/live/play/123456?playerIndex=0&nickname=${encodeURIComponent(nickname)}`)
      return
    }
    try {
      const res = await fetch(`${API}/api/game/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pin.trim(), nickname: nickname.trim() }),
      })
      const data = await res.json()
      if (data.ok && data.playerIndex !== undefined) {
        success(t('waitingRoom.youJoined'))
        navigate(`/live/play/${pin}?playerIndex=${data.playerIndex}&nickname=${encodeURIComponent(nickname.trim())}`)
      } else {
        showError(data.error || t('joinGame.error', 'Could not join game'))
      }
    } catch (e) {
      showError(t('joinGame.error', 'Could not join game'))
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <Card className="shadow-soft">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Gamepad2 className="size-8" />
          </div>
          <CardTitle className="mt-4 text-2xl">{t('joinGame.title')}</CardTitle>
          <CardDescription>
            {t('joinGame.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pin" className="flex items-center gap-2">
                <KeyRound className="size-4 text-primary" />
                {t('joinGame.gamePin')}
              </Label>
              <Input
                id="pin"
                type="text"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder={t('joinGame.pinPlaceholder')}
                maxLength={6}
                className="text-center text-xl font-mono tracking-widest"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname" className="flex items-center gap-2">
                <User className="size-4 text-primary" />
                {t('joinGame.nickname')}
              </Label>
              <Input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={t('joinGame.nicknamePlaceholder')}
                maxLength={20}
                required
              />
            </div>
            <Button type="submit" size="lg" className="w-full gap-2">
              <Play className="size-5" />
              {t('joinGame.join')}
            </Button>
          </form>
        </CardContent>
      </Card>
      <PageComments pageKey="/join" />
    </div>
  )
}
