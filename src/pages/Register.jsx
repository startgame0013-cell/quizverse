import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useLanguage } from '@/context/LanguageContext'

export default function Register() {
  const { t } = useLanguage()
  const { register } = useAuth()
  const { success, error: showError } = useToast()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [displayName, setDisplayName] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    setSubmitting(true)
    try {
      await register(email, password, name.trim() || undefined, displayName.trim() || undefined)
      success(t('auth.registerSuccess'))
      navigate('/')
    } catch (err) {
      showError(err.message || t('auth.registerFailed', 'Registration failed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <Card className="shadow-soft">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('auth.register')}</CardTitle>
          <CardDescription>{t('getStarted.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('auth.name')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="pl-9" />
              </div>
              <p className="text-xs text-muted-foreground">{t('auth.namePrivate', 'Kept private, not shown publicly.')}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">{t('auth.displayName')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input id="displayName" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g. QuizMaster99" className="pl-9" />
              </div>
              <p className="text-xs text-muted-foreground">{t('auth.displayNameHint', 'Optional. Shown in leaderboard and games. Leave empty to use your name.')}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={4} className="pl-9" />
              </div>
            </div>
            <Button type="submit" className="w-full gap-2" disabled={submitting}>
              {submitting ? '...' : t('auth.register')}
              <ArrowRight className="size-4" />
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t('auth.haveAccount')}{' '}
            <Link to="/sign-in" className="text-primary font-medium hover:underline">
              {t('auth.signIn')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
