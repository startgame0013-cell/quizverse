import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Check, Zap, Users, School, Crown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import API from '@/lib/api.js'

const PLANS = [
  {
    id: 'free',
    nameKey: 'pricing.free',
    descKey: 'pricing.freeDesc',
    price: 0,
    priceYearKey: 'pricing.freePrice',
    features: ['pricing.f1', 'pricing.f2', 'pricing.f3', 'pricing.f4'],
    ctaKey: 'pricing.getStarted',
    to: '/register',
    popular: false,
    icon: Zap,
    paid: false,
    schoolTier: false,
  },
  {
    id: 'basic',
    nameKey: 'pricing.basic',
    descKey: 'pricing.basicDesc',
    price: 2.99,
    priceYearKey: 'pricing.basicYear',
    features: ['pricing.b1', 'pricing.b2', 'pricing.b3', 'pricing.b4'],
    ctaKey: 'pricing.subscribe',
    popular: false,
    icon: Users,
    paid: true,
    schoolTier: false,
  },
  {
    id: 'pro',
    nameKey: 'pricing.pro',
    descKey: 'pricing.proDesc',
    price: 6.99,
    priceYearKey: 'pricing.proYear',
    features: ['pricing.p1', 'pricing.p2', 'pricing.p3', 'pricing.p4'],
    ctaKey: 'pricing.subscribe',
    popular: true,
    icon: Crown,
    paid: true,
    schoolTier: false,
  },
  {
    id: 'school',
    nameKey: 'pricing.school',
    descKey: 'pricing.schoolDesc',
    price: 11.99,
    priceYearKey: 'pricing.schoolYear',
    features: ['pricing.s1', 'pricing.s2', 'pricing.s3', 'pricing.s4', 'pricing.s5'],
    ctaKey: 'pricing.subscribeSchool',
    popular: false,
    icon: School,
    paid: true,
    schoolTier: true,
  },
]

export default function Pricing() {
  const { t } = useLanguage()
  const { isAuthenticated, getToken, user } = useAuth()
  const { error: showError } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(null)
  const [planAvailability, setPlanAvailability] = useState(null)
  const schoolCardRef = useRef(null)

  const success = searchParams.get('success') === 'true'
  const canceled = searchParams.get('canceled') === 'true'

  useEffect(() => {
    if (!API) return
    fetch(`${API}/api/subscription/plans`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setPlanAvailability(d)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const p = searchParams.get('plan')
    if (p === 'school' && schoolCardRef.current) {
      schoolCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [searchParams])

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin'

  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) {
      navigate(`/sign-in?redirect=${encodeURIComponent(`/pricing?plan=${planId}`)}`)
      return
    }
    if (planId === 'school' && !isTeacher) {
      showError(t('pricing.schoolTeachersOnly'))
      return
    }
    if (!API) {
      showError(t('pricing.noBackend', 'Backend not connected. Set VITE_API_URL.'))
      return
    }
    if (planAvailability?.plans && planAvailability.plans[planId] === false) {
      showError(t('pricing.planNotConfigured'))
      return
    }
    setLoading(planId)
    try {
      const res = await fetch(`${API}/api/subscription/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ plan: planId }),
      })
      const data = await res.json()
      if (data.ok && data.url) {
        window.location.href = data.url
      } else {
        if (data.code === 'SCHOOL_TEACHERS_ONLY') {
          showError(t('pricing.schoolTeachersOnly'))
        } else {
          showError(data.error || t('pricing.checkoutError', 'Could not start checkout.'))
        }
      }
    } catch {
      showError(t('pricing.checkoutError', 'Could not start checkout.'))
    } finally {
      setLoading(null)
    }
  }

  const currentPlan = user?.plan || 'free'

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{t('pricing.title')}</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{t('pricing.subtitle')}</p>
        {success && (
          <p className="mt-4 text-primary font-medium">{t('pricing.successMsg', 'Payment successful! Thank you.')}</p>
        )}
        {canceled && (
          <p className="mt-4 text-muted-foreground">{t('pricing.canceledMsg', 'Payment was canceled.')}</p>
        )}
        {isAuthenticated && currentPlan !== 'free' && (
          <p className="mt-4 text-sm text-muted-foreground">
            {t('pricing.currentPlan')}: <strong className="text-foreground capitalize">{currentPlan}</strong>
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map(
          ({
            id,
            nameKey,
            descKey,
            price,
            priceYearKey,
            features,
            ctaKey,
            to,
            popular,
            icon: Icon,
            paid,
            schoolTier,
          }) => {
            const paddleReady =
              !paid ||
              !planAvailability ||
              (planAvailability.paddle && planAvailability.plans?.[id] !== false)
            const schoolLocked = id === 'school' && isAuthenticated && !isTeacher

            return (
              <Card
                key={id}
                ref={id === 'school' ? schoolCardRef : undefined}
                id={id === 'school' ? 'plan-school' : undefined}
                className={`relative flex flex-col transition-all hover:shadow-soft ${
                  popular ? 'border-primary shadow-glow scale-[1.02]' : 'hover:border-primary/30'
                } ${schoolTier ? 'border-primary/40 bg-primary/5' : ''}`}
              >
                {popular && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    {t('pricing.mostPopular')}
                  </Badge>
                )}
                {schoolTier && (
                  <Badge
                    variant="outline"
                    className="absolute -top-2 left-1/2 -translate-x-1/2 border-primary/60 bg-background text-primary gap-1"
                  >
                    <Sparkles className="size-3" />
                    {t('pricing.schoolBadge')}
                  </Badge>
                )}
                <CardHeader className={schoolTier ? 'pt-8' : ''}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-xl mt-2">{t(nameKey)}</CardTitle>
                  <CardDescription>{t(descKey)}</CardDescription>
                  <div className="mt-4">
                    {price === 0 ? (
                      <span className="text-3xl font-bold text-foreground">{t(priceYearKey)}</span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold text-foreground">${price}</span>
                        <span className="text-muted-foreground">/{t('pricing.month')}</span>
                        <p className="text-sm text-muted-foreground mt-1">{t(priceYearKey)}</p>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col pt-0">
                  <ul className="space-y-3 flex-1">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="size-4 text-primary shrink-0 mt-0.5" />
                        <span>{t(f)}</span>
                      </li>
                    ))}
                  </ul>
                  {id === 'free' ? (
                    <Button className="mt-6 w-full" variant={popular ? 'default' : 'outline'} asChild>
                      <Link to={to}>{t(ctaKey)}</Link>
                    </Button>
                  ) : schoolLocked ? (
                    <div className="mt-6 space-y-2">
                      <p className="text-xs text-muted-foreground text-center">{t('pricing.schoolTeachersOnly')}</p>
                      <Button variant="outline" className="w-full" asChild>
                        <Link
                          to={`/register?role=teacher&redirect=${encodeURIComponent('/pricing?plan=school')}`}
                        >
                          {t('pricing.registerAsTeacher')}
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="mt-6 w-full"
                      variant={popular || schoolTier ? 'default' : 'outline'}
                      disabled={loading === id || !paddleReady}
                      onClick={() => handleSubscribe(id)}
                    >
                      {loading === id ? '...' : t(ctaKey)}
                    </Button>
                  )}
                  {schoolTier && isTeacher && (
                    <p className="text-xs text-center text-muted-foreground mt-2">{t('pricing.schoolPaddleHint')}</p>
                  )}
                </CardContent>
              </Card>
            )
          }
        )}
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground max-w-2xl mx-auto">{t('pricing.note')}</p>
      <p className="mt-4 text-center text-xs text-muted-foreground max-w-2xl mx-auto">{t('pricing.paddleNote')}</p>
    </div>
  )
}
