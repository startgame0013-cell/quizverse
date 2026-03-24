import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useLanguage } from '@/context/LanguageContext'

export default function SignIn() {
  const { t } = useLanguage()
  const { signIn } = useAuth()
  const { success, error: showError } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    setSubmitting(true)
    try {
      await signIn(email, password)
      success(t('auth.signInSuccess'))
      const r = searchParams.get('redirect')
      const safe = r && r.startsWith('/') && !r.startsWith('//') ? r : '/'
      navigate(safe)
    } catch (err) {
      showError(err.message || t('auth.signInFailed', 'Invalid email or password'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <Card className="shadow-soft">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('signIn.title')}</CardTitle>
          <CardDescription>{t('signIn.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              {submitting ? '...' : t('auth.signIn')}
              <ArrowRight className="size-4" />
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t('auth.noAccount')}{' '}
            <Link
              to={
                (() => {
                  const r = searchParams.get('redirect')
                  if (!r) return '/register'
                  const enc = encodeURIComponent(r)
                  if (r.includes('plan=school')) return `/register?role=teacher&redirect=${enc}`
                  return `/register?redirect=${enc}`
                })()
              }
              className="text-primary font-medium hover:underline"
            >
              {t('auth.register')}
            </Link>
          </p>
          <div className="mt-4 flex justify-center">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">{t('signIn.backToHome')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
