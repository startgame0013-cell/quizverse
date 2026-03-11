import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PenSquare, Trash2, Play, Copy, Radio, Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getAllQuizzes, deleteQuiz, duplicateQuiz, getQuizDisplay, resetQuizzesToDefault } from '@/lib/quizStore'
import { useLanguage } from '@/context/LanguageContext'
import { useToast } from '@/context/ToastContext'
import Pagination from '@/components/Pagination'

const PAGE_SIZE = 5

function formatDate(ts, lang) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { dateStyle: 'medium' })
}

function buildDisplayTitle(quiz, lang, t, display) {
  const rawTitle = (display.title || '').trim()
  if (rawTitle) return rawTitle

  const parts = []
  if (quiz.category) {
    const catLabel = t(`category.${quiz.category}`) || quiz.category
    parts.push(catLabel)
  }
  if (quiz.stage) {
    parts.push(t(`stage.${quiz.stage}`))
  }
  if (quiz.difficulty) {
    parts.push(t(`difficulty.${quiz.difficulty}`))
  }

  if (parts.length > 0) {
    if (lang === 'ar') {
      return `كويز ${parts.join(' - ')}`
    }
    return `Quiz - ${parts.join(' · ')}`
  }

  const datePart = formatDate(quiz.updatedAt || quiz.createdAt, lang)
  if (datePart) {
    if (lang === 'ar') {
      return `كويز ${datePart}`
    }
    return `Quiz ${datePart}`
  }

  return t('myQuizzes.untitled')
}

export default function MyQuizzes() {
  const { t, lang } = useLanguage()
  const { success } = useToast()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStage, setFilterStage] = useState('')
  const [page, setPage] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const quizzes = getAllQuizzes()

  const filtered = useMemo(() => {
    return quizzes.filter((q) => {
      const searchLower = search.toLowerCase()
      const matchSearch = !search.trim() ||
        (q.title || '').toLowerCase().includes(searchLower) ||
        (q.titleAr || '').toLowerCase().includes(searchLower) ||
        (q.description || '').toLowerCase().includes(searchLower) ||
        (q.descriptionAr || '').toLowerCase().includes(searchLower)
      const matchDiff = !filterDifficulty || (q.difficulty || '') === filterDifficulty
      const matchCat = !filterCategory || (q.category || '') === filterCategory
      const matchStage = !filterStage || (q.stage || '') === filterStage
      return matchSearch && matchDiff && matchCat && matchStage
    })
  }, [quizzes, search, filterDifficulty, filterCategory, filterStage])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  useEffect(() => {
    setPage(0)
  }, [search, filterDifficulty, filterCategory, filterStage])

  const handleDelete = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm(t('common.deleteConfirm'))) {
      deleteQuiz(id)
      success(t('common.deleteSuccess'))
      window.location.reload()
    }
  }

  const handleDuplicate = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    const copy = duplicateQuiz(id)
    if (copy) {
      success(t('createQuiz.saved'))
      navigate(`/quiz/${copy.id}/details`)
    }
  }

  const handleReset = async () => {
    if (!window.confirm(t('myQuizzes.resetConfirm'))) return
    await resetQuizzesToDefault()
    success(t('myQuizzes.resetSuccess'))
    window.location.reload()
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('myQuizzes.title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('myQuizzes.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} title={t('myQuizzes.resetToDefault')}>
            {t('myQuizzes.resetToDefault')}
          </Button>
          <Button asChild>
            <Link to="/create-quiz" className="gap-2">
              <PenSquare className="size-4" />
              {t('myQuizzes.createQuiz')}
            </Link>
          </Button>
        </div>
      </div>

      {quizzes.length > 0 && (
        <div className="mb-8 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={t('myQuizzes.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 pl-11 rounded-xl border-border/60 bg-muted/30"
            />
          </div>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="h-11 gap-2 rounded-xl border-border/60 bg-muted/30 px-4"
              onClick={() => setFiltersOpen((o) => !o)}
            >
              <SlidersHorizontal className="size-4" />
              {t('myQuizzes.filters')}
              {(filterDifficulty || filterCategory || filterStage) && (
                <span className="size-2 rounded-full bg-primary" />
              )}
            </Button>
            {filtersOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setFiltersOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute end-0 top-full z-50 mt-2 w-72 rounded-xl border border-border bg-card p-4 shadow-xl">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium">{t('myQuizzes.filters')}</span>
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => setFiltersOpen(false)}>
                      <X className="size-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1.5 block text-xs text-muted-foreground">{t('createQuiz.difficulty')}</label>
                      <Select value={filterDifficulty || '__all__'} onValueChange={(v) => setFilterDifficulty(v === '__all__' ? '' : v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__all__">{t('myQuizzes.filterAll')}</SelectItem>
                          <SelectItem value="easy">{t('difficulty.easy')}</SelectItem>
                          <SelectItem value="medium">{t('difficulty.medium')}</SelectItem>
                          <SelectItem value="hard">{t('difficulty.hard')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs text-muted-foreground">{t('createQuiz.category')}</label>
                      <Select value={filterCategory || '__all__'} onValueChange={(v) => setFilterCategory(v === '__all__' ? '' : v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__all__">{t('myQuizzes.filterAll')}</SelectItem>
                          <SelectItem value="general">{t('category.general')}</SelectItem>
                          <SelectItem value="science">{t('category.science')}</SelectItem>
                          <SelectItem value="history">{t('category.history')}</SelectItem>
                          <SelectItem value="geography">{t('category.geography')}</SelectItem>
                          <SelectItem value="language">{t('category.language')}</SelectItem>
                          <SelectItem value="religion">{t('category.religion')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs text-muted-foreground">{t('createQuiz.stage')}</label>
                      <Select value={filterStage || '__all__'} onValueChange={(v) => setFilterStage(v === '__all__' ? '' : v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__all__">{t('myQuizzes.filterAll')}</SelectItem>
                          <SelectItem value="elementary">{t('stage.elementary')}</SelectItem>
                          <SelectItem value="intermediate">{t('stage.intermediate')}</SelectItem>
                          <SelectItem value="secondary">{t('stage.secondary')}</SelectItem>
                          <SelectItem value="university">{t('stage.university')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground">{t('myQuizzes.noQuizzes')}</p>
            <Button asChild className="mt-4">
              <Link to="/create-quiz" className="gap-2">
                <PenSquare className="size-4" />
                {t('myQuizzes.createQuiz')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No quizzes match your filters.
          </CardContent>
        </Card>
      ) : (
        <>
        <div className="space-y-4">
          {paginated.map((quiz) => {
            const d = getQuizDisplay(quiz, lang)
            const title = buildDisplayTitle(quiz, lang, t, d)
            return (
            <Card key={quiz.id} className="transition-shadow hover:shadow-soft">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <Link to={`/quiz/${quiz.id}/details`} className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">
                    {title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {quiz.questions?.length || 0} {t('myQuizzes.questions')} · {formatDate(quiz.updatedAt, lang)}
                  </CardDescription>
                </Link>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="icon" asChild title={t('quizDetails.editQuiz')}>
                    <Link to={`/create-quiz?edit=${quiz.id}`}>
                      <PenSquare className="size-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild title={t('myQuizzes.play')}>
                    <Link to={`/quiz/${quiz.id}`}>
                      <Play className="size-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={(e) => handleDuplicate(e, quiz.id)} title={t('myQuizzes.duplicate')}>
                    <Copy className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" asChild title={t('myQuizzes.host')}>
                    <Link to={`/waiting?pin=123456`}>
                      <Radio className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={(e) => handleDelete(e, quiz.id)}
                    title={t('myQuizzes.delete')}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {d.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{d.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {quiz.difficulty && <Badge variant="secondary">{t(`difficulty.${quiz.difficulty}`)}</Badge>}
                  {quiz.category && <Badge variant="outline">{t(`category.${quiz.category}`) || quiz.category}</Badge>}
                  {quiz.stage && <Badge variant="outline">{t(`stage.${quiz.stage}`)}</Badge>}
                </div>
              </CardContent>
            </Card>
            )
          })}
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
