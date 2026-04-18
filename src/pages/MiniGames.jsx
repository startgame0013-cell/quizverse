import { Link } from 'react-router-dom'
import { Gamepad2, Zap, Type, CheckCircle, Calculator, Flag, Brain, CircleDot, Grid3x3, Camera, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/LanguageContext'
import PageComments from '@/components/PageComments'

const GAMES = [
  {
    id: 'memory',
    nameEn: 'Memory Match',
    nameAr: 'تطابق الذاكرة',
    descEn: 'Flip cards to find matching pairs. Train your memory!',
    descAr: 'اقلب البطاقات لإيجاد الأزواج المتطابقة. درّب ذاكرتك!',
    path: '/mini-games/memory',
    icon: Brain,
  },
  {
    id: 'word',
    nameEn: 'Word Scramble',
    nameAr: 'كلمات مشوشة',
    descEn: 'Unscramble letters to form words. Great for vocabulary.',
    descAr: 'رتب الحروف لتكوين كلمات. رائع للمفردات.',
    path: '/mini-games/word-scramble',
    icon: Type,
  },
  {
    id: 'math',
    nameEn: 'Quick Math',
    nameAr: 'رياضيات سريعة',
    descEn: 'Solve math problems against the clock.',
    descAr: 'حل مسائل رياضية ضد الوقت.',
    path: '/mini-games/quick-math',
    icon: Calculator,
  },
  {
    id: 'flag',
    nameEn: 'Flag Challenge',
    nameAr: 'تحدي الأعلام',
    descEn: 'Identify country flags. Test your geography.',
    descAr: 'تعرف على أعلام الدول. اختبر جغرافيتك.',
    path: '/mini-games/flag-challenge',
    icon: Flag,
  },
  {
    id: 'trivia',
    nameEn: 'Quick Trivia',
    nameAr: 'ترافيا سريعة',
    descEn: '30-second rapid fire questions. Test your speed and knowledge.',
    descAr: 'أسئلة سريعة خلال 30 ثانية. اختبر سرعتك ومعرفتك.',
    path: '/mini-games/quick-trivia',
    icon: Zap,
  },
  {
    id: 'tf',
    nameEn: 'True or False',
    nameAr: 'صح أو خطأ',
    descEn: 'Speed round of true or false. Quick and fun.',
    descAr: 'جولة سريعة من صح أو خطأ. سريع وممتع.',
    path: '/mini-games/true-false',
    icon: CheckCircle,
  },
  {
    id: 'vortex',
    nameEn: 'Vortex',
    nameAr: 'فورتكس',
    descEn: 'Interactive particle vortex. Touch or move to control the flow.',
    descAr: 'دوامة جزيئات تفاعلية. المس أو حرّك للتحكم بالتيار.',
    path: '/mini-games/vortex',
    icon: CircleDot,
  },
  {
    id: 'shade-grid',
    nameEn: 'Shade Spot',
    nameAr: 'لون مختلف',
    descEn: 'Find the one square with a slightly different pastel shade. Easy, medium, or barely visible.',
    descAr: 'اعثر على المربع بلون باستيل مختلف قليلاً. سهل، متوسط، أو فرق يكاد لا يُرى.',
    path: '/mini-games/shade-grid',
    icon: Grid3x3,
  },
  {
    id: 'visual-riddle',
    nameEn: 'Photo Spot',
    nameAr: 'صورة مختلفة',
    descEn: 'Same portrait in three panels — find the one with a slightly different tone, like Shade Spot but with a real photo.',
    descAr: 'نفس الصورة في ثلاث لوحات — اعثر على اللوحة اللي إضاءتها أو لونها مختلف شوي، نفس فكرة لون مختلف لكن بصورة حقيقية.',
    path: '/mini-games/visual-riddle',
    icon: Camera,
  },
]

export default function MiniGames() {
  const { t, lang } = useLanguage()

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
        {GAMES.map(({ id, nameEn, nameAr, descEn, descAr, path, icon: Icon }) => (
          <Card key={id} className="flex flex-col transition-all hover:border-primary/30 hover:shadow-soft">
            <CardContent className="flex flex-1 flex-col p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {lang === 'ar' ? nameAr : nameEn}
              </h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                {lang === 'ar' ? descAr : descEn}
              </p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <Badge variant="default">{t('miniGames.playable')}</Badge>
                <Button size="sm" className="gap-1" asChild>
                  <Link to={path}>
                    {t('miniGames.play')}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PageComments id="mini-games-comments" pageKey="/mini-games" />
    </div>
  )
}
