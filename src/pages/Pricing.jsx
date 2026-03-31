import { Link } from 'react-router-dom'
import { Check, Crown, GraduationCap, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/context/ToastContext'
import { useLanguage } from '@/context/LanguageContext'

export default function Pricing() {
  const { lang } = useLanguage()
  const { info } = useToast()

  const handlePlaceholderCheckout = () => {
    info(lang === 'ar'
      ? 'الدفع Placeholder حالياً. Paddle مجهز وسيتم ربطه لاحقاً.'
      : 'Payment is placeholder for now. Paddle is already configured and will be connected later.')
  }

  const copy =
    lang === 'ar'
      ? {
          dir: 'rtl',
          title: 'الاشتراكات',
          subtitle: 'اختر الخطة المناسبة لك وابدأ بتجربة تعليمية أقوى. خطط واضحة، قيمة أعلى، وتجربة عربية متكاملة.',
          popular: 'الأكثر شيوعاً',
          placeholder: 'الدفع Placeholder حالياً. Paddle مجهز في المشروع وسيتم ربط أزرار الاشتراك به لاحقاً.',
          note: 'جميع الخطط تحافظ على تجربة QuizVerse العربية مع دعم RTL والثيم الأسود والذهبي.',
          plans: [
            {
              id: 'free',
              name: 'مجاني',
              price: '0 د.ك',
              period: '',
              icon: Sparkles,
              cta: 'ابدأ مجاناً',
              to: '/quizzes',
              subtext: 'ابدأ فوراً بدون التزام',
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
              subtext: 'لأفضل توازن بين السعر والمميزات',
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
              subtext: 'حل عملي للمعلمين والإدارة الصفية',
              features: [
                'كل مميزات البريميوم',
                'لوحة تحكم للمعلم',
                'إدارة الطلاب والنتائج',
                'مناسب للفصول والمدارس والمتابعة المستمرة',
              ],
            },
          ],
        }
      : {
          dir: 'ltr',
          title: 'Subscriptions',
          subtitle: 'Choose the plan that fits you best and start with a stronger learning experience.',
          popular: 'Most Popular',
          placeholder: 'Payment is placeholder for now. Paddle is already configured and will be connected later.',
          note: 'All plans keep the same QuizVerse black and gold experience with Arabic-first RTL support.',
          plans: [
            {
              id: 'free',
              name: 'Free',
              price: '0 KWD',
              period: '',
              icon: Sparkles,
              cta: 'Start Free',
              to: '/quizzes',
              subtext: 'Start immediately with no commitment',
              features: [
                'Play unlimited quizzes',
                'No sign-in required',
                'Great for quick trial and instant play',
              ],
            },
            {
              id: 'premium',
              name: 'Premium',
              price: '4.99 KWD',
              period: '/ month',
              icon: Crown,
              cta: 'Subscribe Now',
              popular: true,
              subtext: 'Best balance between value and features',
              features: [
                'Unlimited quiz creation',
                'Completion certificates',
                'Detailed analytics and results',
                'Best for individual educators and creators',
              ],
            },
            {
              id: 'teacher',
              name: 'Teacher',
              price: '9.99 KWD',
              period: '/ month',
              icon: GraduationCap,
              cta: 'Choose Teacher Plan',
              subtext: 'A practical option for teachers and class management',
              features: [
                'Everything in Premium',
                'Teacher dashboard',
                'Student and result management',
                'Great for classrooms and ongoing follow-up',
              ],
            },
          ],
        }

  return (
    <div dir={copy.dir} className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{copy.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{copy.subtitle}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {copy.plans.map(({ id, name, price, period, icon: Icon, cta, features, to, popular, subtext }) => (
          <Card
            key={id}
            className={`relative flex h-full flex-col border-border/60 bg-card/90 transition-all hover:border-primary/40 hover:shadow-soft ${
              popular ? 'scale-[1.02] border-primary shadow-glow' : ''
            }`}
          >
            {popular && (
              <Badge className="absolute -top-3 right-1/2 translate-x-1/2 bg-primary text-primary-foreground">
                {copy.popular}
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
                <p className="mt-2 text-sm text-muted-foreground">{subtext}</p>
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col">
              <ul className={`flex-1 space-y-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
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
        {copy.placeholder}
      </div>
      <p className="mt-5 text-center text-xs text-muted-foreground">{copy.note}</p>
    </div>
  )
}
