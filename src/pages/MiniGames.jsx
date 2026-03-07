import { Link } from 'react-router-dom'
import { Gamepad2, Zap, Type, CheckCircle, Calculator, Flag, Brain, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/LanguageContext'

const GAMES = [
  { id: 'memory', nameKey: 'miniGames.memoryMatch', descKey: 'miniGames.memoryMatchDesc', status: 'playable', icon: Brain, path: '/mini-games/memory' },
  { id: 'word', nameKey: 'miniGames.wordScramble', descKey: 'miniGames.wordScrambleDesc', status: 'coming', icon: Type },
  { id: 'math', nameKey: 'miniGames.quickMath', descKey: 'miniGames.quickMathDesc', status: 'coming', icon: Calculator },
  { id: 'flag', nameKey: 'miniGames.flagChallenge', descKey: 'miniGames.flagChallengeDesc', status: 'coming', icon: Flag },
  { id: 'trivia', nameKey: 'miniGames.quickTrivia', descKey: 'miniGames.quickTriviaDesc', status: 'coming', icon: Zap },
  { id: 'tf', nameKey: 'miniGames.trueOrFalse', descKey: 'miniGames.trueOrFalseDesc', status: 'coming', icon: CheckCircle },
]

export default function MiniGames() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Gamepad2 className="size-7" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('miniGames.title')}</h1>
          <p className="mt-0.5 text-muted-foreground">{t('miniGames.subtitle')}</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map(({ id, nameKey, descKey, status, icon: Icon, path }) => (
          <Card key={id} className="flex flex-col transition-all hover:border-primary/30 hover:shadow-soft">
            <CardContent className="flex flex-1 flex-col p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{t(nameKey)}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{t(descKey)}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <Badge variant={status === 'playable' ? 'default' : 'secondary'}>
                  {status === 'playable' ? t('miniGames.playable') : t('miniGames.comingSoon')}
                </Badge>
                {status === 'playable' && path ? (
                  <Button size="sm" className="gap-1" asChild>
                    <Link to={path}>
                      {t('miniGames.play')}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" className="gap-1" disabled>
                    {t('miniGames.play')}
                    <ArrowRight className="size-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
