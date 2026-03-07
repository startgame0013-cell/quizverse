import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PenSquare, Trash2, Play, Copy, Radio, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { getAllQuizzes, deleteQuiz, duplicateQuiz } from '@/lib/quizStore'
import { useLanguage } from '@/context/LanguageContext'
import { useToast } from '@/context/ToastContext'

function formatDate(ts, lang) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { dateStyle: 'medium' })
}

export default function MyQuizzes() {
  const { t, lang } = useLanguage()
  const { success } = useToast()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  const quizzes = getAllQuizzes()

  const filtered = useMemo(() => {
    return quizzes.filter((q) => {
      const matchSearch = !search.trim() || (q.title || '').toLowerCase().includes(search.toLowerCase()) || (q.description || '').toLowerCase().includes(search.toLowerCase())
      const matchDiff = !filterDifficulty || (q.difficulty || '') === filterDifficulty
      const matchCat = !filterCategory || (q.category || '') === filterCategory
      return matchSearch && matchDiff && matchCat
    })
  }, [quizzes, search, filterDifficulty, filterCategory])

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

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('myQuizzes.title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('myQuizzes.subtitle')}</p>
        </div>
        <Button asChild>
          <Link to="/create-quiz" className="gap-2">
            <PenSquare className="size-4" />
            {t('myQuizzes.createQuiz')}
          </Link>
        </Button>
      </div>

      {quizzes.length > 0 && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={t('myQuizzes.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">{t('myQuizzes.filterAll')} {t('createQuiz.difficulty')}</option>
            <option value="easy">{t('difficulty.easy')}</option>
            <option value="medium">{t('difficulty.medium')}</option>
            <option value="hard">{t('difficulty.hard')}</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">{t('myQuizzes.filterAll')} {t('createQuiz.category')}</option>
            <option value="general">{t('category.general')}</option>
            <option value="science">{t('category.science')}</option>
            <option value="history">{t('category.history')}</option>
            <option value="geography">{t('category.geography')}</option>
            <option value="language">{t('category.language')}</option>
            <option value="religion">{t('category.religion')}</option>
          </select>
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
        <div className="space-y-4">
          {filtered.map((quiz) => (
            <Card key={quiz.id} className="transition-shadow hover:shadow-soft">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <Link to={`/quiz/${quiz.id}/details`} className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{quiz.title || t('myQuizzes.untitled')}</CardTitle>
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
                {quiz.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{quiz.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {quiz.difficulty && <Badge variant="secondary">{t(`difficulty.${quiz.difficulty}`)}</Badge>}
                  {quiz.category && <Badge variant="outline">{t(`category.${quiz.category}`) || quiz.category}</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
