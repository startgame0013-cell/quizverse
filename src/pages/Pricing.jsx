import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Check, Zap, Users, School, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
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
  },
  {
    id: 'basic',
    nameKey: 'pricing.basic',
    descKey: 'pricing.basicDesc',
    price: 2.99,
    priceYearKey: 'pricing.basicYear',
    features: ['pricing.b1', 'pricing.b2', 'pricing.b3', 'pricing.b4'],
    ctaKey: 'pricing.subscribe',
    to: '/pricing?plan=basic',
    popular: false,
    icon: Users,
  },
  {
    id: 'pro',
    nameKey: 'pricing.pro',
    descKey: 'pricing.proDesc',
    price: 6.99,
    priceYearKey: 'pricing.proYear',
    features: ['pricing.p1', 'pricing.p2', 'pricing.p3', 'pricing.p4'],
    ctaKey: 'pricing.subscribe',
    to: '/pricing?plan=pro',
    popular: true,
    icon: Crown,
  },
  {
    id: 'school',
    nameKey: 'pricing.school',
    descKey: 'pricing.schoolDesc',
    price: 11.99,
    priceYearKey: 'pricing.schoolYear',
    features: ['pricing.s1', 'pricing.s2', 'pricing.s3', 'pricing.s4'],
    ctaKey: 'pricing.subscribe',
    to: '/pricing?plan=school',
    popular: false,
    icon: School,
  },
]

export default function Pricing() {
  const { t } = useLanguage()
  const { isAuthenticated, getToken } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(null)

  const success = searchParams.get('success') === 'true'
  const canceled = searchParams.get('canceled') === 'true'

  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) {
      navigate(`/sign-in?redirect=${encodeURIComponent('/pricing')}`)
      return
    }
    if (!API) {
      alert(t('pricing.noBackend', 'Backend not connected. Set VITE_API_URL.'))
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
        alert(data.error || t('pricing.checkoutError', 'Could not start checkout.'))
      }
    } catch (e) {
      alert(t('pricing.checkoutError', 'Could not start checkout.'))
    } finally {
      setLoading(null)
    }
  }

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
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map(({ id, nameKey, descKey, price, priceYearKey, features, ctaKey, to, popular, icon: Icon }) => (
          <Card
            key={id}
            className={`relative flex flex-col transition-all hover:shadow-soft ${
              popular ? 'border-primary shadow-glow scale-[1.02]' : 'hover:border-primary/30'
            }`}
          >
            {popular && (
              <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                {t('pricing.mostPopular')}
              </Badge>
            )}
            <CardHeader>
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
              ) : (
                <Button
                  className="mt-6 w-full"
                  variant={popular ? 'default' : 'outline'}
                  disabled={loading === id}
                  onClick={() => handleSubscribe(id)}
                >
                  {loading === id ? '...' : t(ctaKey)}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">{t('pricing.note')}</p>
    </div>
  )
}
