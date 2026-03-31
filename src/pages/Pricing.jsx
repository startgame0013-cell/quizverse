import { Link } from 'react-router-dom'
import { Check, Crown, GraduationCap, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/context/ToastContext'
import { useLanguage } from '@/context/LanguageContext'

const plans = [
  {
    id: 'free',
    name: 'مجاني',
    price: '0 د.ك',
    period: '',
    icon: Sparkles,
    cta: 'ابدأ مجاناً',
    to: '/quizzes',
    features: [
      'العب كويزات غير محدودة',
      'لا تحتاج تسجيل',
      'مناسب للتجربة السريعة واللعب المباشر',
    ],
  },
  {
    id: 'premium',
    name: 'بريميوم',
    price: '4.99 د.ك',
    period: '/ شهر',
    icon: Crown,
    cta: 'اشترك الآن',
    popular: true,
    features: [
      'إنشاء كويزات غير محدودة',
      'شهادات إتمام',
      'تحليلات ونتائج مفصلة',
      'أفضل خيار للأفراد وصنّاع المحتوى التعليمي',
    ],
  },
  {
    id: 'teacher',
    name: 'معلم',
    price: '9.99 د.ك',
    period: '/ شهر',
    icon: GraduationCap,
    cta: 'اختر خطة المعلم',
    features: [
      'كل مميزات البريميوم',
      'لوحة تحكم للمعلم',
      'إدارة الطلاب والنتائج',
      'مناسب للفصول والمدارس والمتابعة المستمرة',
    ],
  },
]

export default function Pricing() {
  const { lang } = useLanguage()
  const { info } = useToast()

  const handlePlaceholderCheckout = () => {
    info('الدفع Placeholder حالياً. Paddle مجهز وسيتم ربطه لاحقاً.')
  }

  return (
    <div dir="rtl" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">الأسعار والاشتراكات</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          اختر الخطة المناسبة لك وابدأ بتجربة تعليمية أقوى. خطط واضحة، قيمة أعلى، وتجربة عربية متكاملة.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map(({ id, name, price, period, icon: Icon, cta, features, to, popular }) => (
          <Card
            key={id}
            className={`relative flex h-full flex-col border-border/60 bg-card/90 transition-all hover:border-primary/40 hover:shadow-soft ${
              popular ? 'scale-[1.02] border-primary shadow-glow' : ''
            }`}
          >
            {popular && (
              <Badge className="absolute -top-3 right-1/2 translate-x-1/2 bg-primary text-primary-foreground">
                الأكثر شيوعاً
              </Badge>
            )}
            <CardHeader className="space-y-5 pb-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Icon className="size-7" />
              </div>
              <div>
                <CardTitle className="text-2xl">{name}</CardTitle>
                <p className="mt-3 text-4xl font-bold text-foreground">
                  {price}
                  {period && <span className="text-lg font-medium text-muted-foreground"> {period}</span>}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {id === 'free'
                    ? 'ابدأ فوراً بدون التزام'
                    : id === 'premium'
                      ? 'لأفضل توازن بين السعر والمميزات'
                      : 'حل عملي للمعلمين والإدارة الصفية'}
                </p>
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col">
              <ul className="flex-1 space-y-3 text-right">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {to ? (
                <Button className="mt-8 w-full" variant={popular ? 'default' : 'outline'} asChild>
                  <Link to={to}>{cta}</Link>
                </Button>
              ) : (
                <Button className="mt-8 w-full" variant={popular ? 'default' : 'outline'} onClick={handlePlaceholderCheckout}>
                  {cta}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 text-center text-sm text-muted-foreground">
        الدفع Placeholder حالياً. Paddle مجهز في المشروع وسيتم ربط أزرار الاشتراك به لاحقاً.
      </div>
      <p className="mt-5 text-center text-xs text-muted-foreground">
        {lang === 'ar'
          ? 'جميع الخطط تحافظ على تجربة QuizVerse العربية مع دعم RTL والثيم الأسود والذهبي.'
          : 'QuizVerse keeps the Arabic-first RTL experience with the same black and gold theme.'}
      </p>
    </div>
  )
}
