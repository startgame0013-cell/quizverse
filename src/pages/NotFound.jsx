import { Link } from 'react-router-dom'
import { Home, FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/LanguageContext'

export default function NotFound() {
  const { t } = useLanguage()
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-6">
        <FileQuestion className="size-10" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">{t('notFound.title')}</h1>
      <p className="mt-2 text-muted-foreground">{t('notFound.subtitle')}</p>
      <Button asChild className="mt-6 gap-2">
        <Link to="/">
          <Home className="size-4" />
          {t('notFound.goHome')}
        </Link>
      </Button>
    </div>
  )
}
