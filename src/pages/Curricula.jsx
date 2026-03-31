import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllQuizzes, getQuizDisplay, saveQuiz, quizContentLang } from '@/lib/quizStore'
import { useLanguage } from '@/context/LanguageContext'
import { KUWAIT_ELEMENTARY_2026_QUIZZES } from '@/data/kuwaitElementary2026'
import { KUWAIT_INTERMEDIATE_2026_QUIZZES } from '@/data/kuwaitIntermediate2026'
import { KUWAIT_SECONDARY_2026_QUIZZES } from '@/data/kuwaitSecondary2026'

/** نعرض المناهج مباشرة من الملف — القائمة تظهر دائماً. عند اللعب نضيف الكويز للمخزن إذا لم يكن موجوداً. */
function ensureQuizId(quizFromFile) {
  if (!quizFromFile) return null
  const existing = getAllQuizzes().find(
    (q) => (q.title === quizFromFile.title && q.titleAr === quizFromFile.titleAr)
  )
  if (existing?.id) return existing.id
  const saved = saveQuiz({ ...quizFromFile })
  return saved?.id || null
}

export default function Curricula() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const elementaryList = Array.isArray(KUWAIT_ELEMENTARY_2026_QUIZZES) ? KUWAIT_ELEMENTARY_2026_QUIZZES : []
  const intermediateList = Array.isArray(KUWAIT_INTERMEDIATE_2026_QUIZZES) ? KUWAIT_INTERMEDIATE_2026_QUIZZES : []
  const secondaryList = Array.isArray(KUWAIT_SECONDARY_2026_QUIZZES) ? KUWAIT_SECONDARY_2026_QUIZZES : []

  const sections = useMemo(
    () => [
      { key: 'elementary', label: t('curricula.elementaryShort'), items: elementaryList },
      { key: 'intermediate', label: t('curricula.intermediateShort'), items: intermediateList },
      { key: 'secondary', label: t('curricula.secondaryShort'), items: secondaryList },
    ],
    [t, elementaryList, intermediateList, secondaryList]
  )

  const filterTabs = [
    { key: 'all', label: t('curricula.filterAll') },
    { key: 'elementary', label: t('curricula.elementaryShort') },
    { key: 'intermediate', label: t('curricula.intermediateShort') },
    { key: 'secondary', label: t('curricula.secondaryShort') },
    { key: 'religion', label: t('curricula.filterReligion') },
    { key: 'math', label: t('curricula.filterMath') },
    { key: 'science', label: t('curricula.filterScience') },
    { key: 'arabic', label: t('curricula.filterArabic') },
  ]

  const handlePlay = (quiz) => {
    const id = ensureQuizId(quiz)
    if (id) navigate(`/quiz/${id}`)
  }

  const getSubjectKey = (quiz) => {
    const title = `${quiz.title || ''} ${quiz.titleAr || ''}`.toLowerCase()
    if (quiz.category === 'religion' || title.includes('islamic') || title.includes('إسلامية')) return 'religion'
    if (title.includes('math') || title.includes('رياضيات')) return 'math'
    if (title.includes('arabic') || title.includes('لغة عربية')) return 'arabic'
    return 'science'
  }

  const getSubjectLabel = (quiz) => t(`curricula.subject_${getSubjectKey(quiz)}`)

  const matchesFilter = (quiz, levelKey) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'elementary' || activeFilter === 'intermediate' || activeFilter === 'secondary') {
      return levelKey === activeFilter
    }
    return getSubjectKey(quiz) === activeFilter
  }

  const grouped = useMemo(() => {
    const term = search.trim().toLowerCase()
    return sections
      .map((section) => {
        const items = section.items.filter((quiz) => {
          const display = getQuizDisplay(quiz, quizContentLang(quiz))
          const haystack = [
            display.title,
            display.description,
            quiz.title,
            quiz.titleAr,
            getSubjectLabel(quiz),
            section.label,
          ]
            .join(' ')
            .toLowerCase()
          const searchOk = !term || haystack.includes(term)
          return searchOk && matchesFilter(quiz, section.key)
        })
        return { ...section, items }
      })
      .filter((section) => section.items.length > 0)
  }, [sections, search, activeFilter, t])

  const flatCount = grouped.reduce((sum, section) => sum + section.items.length, 0)

  const renderQuizCard = (quiz, levelLabel, key) => {
    const d = getQuizDisplay(quiz, quizContentLang(quiz))
    const count = (quiz.questions || []).length
    return (
      <Card key={key} className="border-border/60 bg-card/90 transition-all hover:border-primary/40 hover:shadow-md">
        <CardHeader className="space-y-3 pb-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <CardTitle className="line-clamp-2 text-lg leading-8">{d.title || quiz.title}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{getSubjectLabel(quiz)}</Badge>
              <Badge variant="outline">{levelLabel}</Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {count} {t('curricula.questions')}
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <Button className="w-full gap-2" onClick={() => handlePlay(quiz)}>
            <Play className="size-4" />
            {t('curricula.play')}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t('curricula.quizzesPageTitle')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t('curricula.quizzesPageSubtitle')}
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-border/70 bg-card/70 p-4 shadow-soft">
        <div className="relative">
          <Search className="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('curricula.searchPlaceholder')}
            className="h-11 border-border/60 bg-muted/20 pe-10"
          />
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                activeFilter === tab.key
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-muted/20 text-muted-foreground hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {flatCount === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center text-muted-foreground">
          {t('curricula.noResults')}
        </div>
      ) : activeFilter === 'all' ? (
        <div className="space-y-10">
          {grouped.map((section) => (
            <section key={section.key}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{section.label}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {section.items.length} {t('curricula.quizzesCount')}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {section.items.map((quiz, index) =>
                  renderQuizCard(quiz, section.label, `${section.key}-${index}`)
                )}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              {filterTabs.find((tab) => tab.key === activeFilter)?.label || t('curricula.filterAll')}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {flatCount} {t('curricula.quizzesCount')}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {grouped.flatMap((section) =>
              section.items.map((quiz, index) =>
                renderQuizCard(quiz, section.label, `${section.key}-${index}`)
              )
            )}
          </div>
        </section>
      )}
    </div>
  )
}
