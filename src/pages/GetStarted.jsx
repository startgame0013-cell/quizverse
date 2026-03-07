import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Gamepad2, PenSquare, UserPlus } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function GetStarted() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <Card className="shadow-soft">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('getStarted.title')}</CardTitle>
          <CardDescription>{t('getStarted.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button size="lg" className="w-full gap-2" asChild>
            <Link to="/join">
              <Gamepad2 className="size-4" />
              {t('getStarted.joinGame')}
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full gap-2" asChild>
            <Link to="/create-quiz">
              <PenSquare className="size-4" />
              {t('getStarted.createQuiz')}
            </Link>
          </Button>
          <Button size="lg" variant="secondary" className="w-full gap-2" asChild>
            <Link to="/register">
              <UserPlus className="size-4" />
              {t('auth.register')}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
