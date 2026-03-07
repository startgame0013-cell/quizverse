import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { Plus, Trash2, Save, Sparkles, PenSquare, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { saveQuiz, getQuizById } from '@/lib/quizStore'
import { useLanguage } from '@/context/LanguageContext'
import { useToast } from '@/context/ToastContext'

const DIFFICULTIES = [
  { value: 'easy', labelKey: 'difficulty.easy' },
  { value: 'medium', labelKey: 'difficulty.medium' },
  { value: 'hard', labelKey: 'difficulty.hard' },
]

const CATEGORIES = [
  { value: 'general', labelKey: 'category.general' },
  { value: 'science', labelKey: 'category.science' },
  { value: 'history', labelKey: 'category.history' },
  { value: 'geography', labelKey: 'category.geography' },
  { value: 'language', labelKey: 'category.language' },
  { value: 'religion', labelKey: 'category.religion' },
]

const AUDIENCES = [
  { value: 'teachers', labelKey: 'audience.teachers' },
  { value: 'students', labelKey: 'audience.students' },
  { value: 'families', labelKey: 'audience.families' },
  { value: 'schools', labelKey: 'audience.schools' },
]

const emptyQuestion = () => ({
  text: '',
  options: ['', '', '', ''],
  correctIndex: 0,
  explanation: '',
})

function QuestionBlock({ index, question, onChange, onRemove, canRemove, t }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-medium text-primary">{t('common.questionNum')} {index + 1}</span>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onRemove}
          >
            <Trash2 className="size-4" />
            {t('createQuiz.delete')}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`q-${index}`}>{t('createQuiz.questionText')}</Label>
          <input
            type="text"
            id={`q-${index}`}
            value={question.text}
            onChange={(e) => onChange(index, 'text', e.target.value)}
            placeholder={t('createQuiz.questionPlaceholder')}
            required
            className="flex h-10 w-full rounded-lg border border-[#404040] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
          />
        </div>
        <div className="space-y-2">
          <Label>{t('createQuiz.optionsLabel')}</Label>
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-3 rounded-lg border border-[#404040] bg-[#ffffff] px-3 py-2 transition-colors hover:border-[#FACC15]/50',
                  question.correctIndex === i && 'border-[#FACC15]/50 bg-[#FACC15]/10'
                )}
              >
                <input
                  type="radio"
                  id={`correct-${index}-${i}`}
                  name={`correct-${index}`}
                  checked={question.correctIndex === i}
                  onChange={() => onChange(index, 'correctIndex', i)}
                  className="h-4 w-4 shrink-0 border-input text-primary focus:ring-primary"
                />
                <input
                  type="text"
                  value={question.options[i] ?? ''}
                  onChange={(e) => onChange(index, `option${i}`, e.target.value)}
                  placeholder={`${t('createQuiz.optionPlaceholder')} ${i + 1}`}
                  className="min-w-0 flex-1 border-0 bg-transparent px-0 py-1 text-sm text-[#000000] placeholder:text-[#737373] focus:outline-none focus:ring-0"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`exp-${index}`}>{t('createQuiz.explanation')}</Label>
          <input
            type="text"
            id={`exp-${index}`}
            value={question.explanation ?? ''}
            onChange={(e) => onChange(index, 'explanation', e.target.value)}
            placeholder={t('createQuiz.explanationPlaceholder')}
            className="flex h-10 w-full rounded-lg border border-[#404040] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
          />
        </div>
      </CardContent>
    </Card>
  )
}

function QuizPreview({ title, description, difficulty, questions, t }) {
  const hasContent = title.trim() || questions.some((q) => q.text.trim())
  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Eye className="size-4 text-primary" />
          {t('createQuiz.livePreview')}
        </CardTitle>
        <CardDescription>{t('createQuiz.livePreviewDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasContent ? (
          <p className="text-sm text-muted-foreground italic">{t('createQuiz.startAdding')}</p>
        ) : (
          <>
            <div>
              <h3 className="font-semibold text-foreground">
                {title.trim() || t('createQuiz.untitled')}
              </h3>
              {description.trim() && (
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              )}
              {difficulty && (
                <Badge variant="secondary" className="mt-2">
                  {t(`difficulty.${difficulty}`)}
                </Badge>
              )}
            </div>
            <div className="space-y-3">
              {questions.map((q, i) => (
                <div key={i} className="rounded-lg border border-border bg-muted/20 p-3 text-sm">
                  <p className="font-medium text-foreground">
                    {i + 1}. {q.text || t('createQuiz.noQuestion')}
                  </p>
                  <ul className="mt-2 space-y-1 pl-4">
                    {q.options.map((opt, j) => (
                      <li
                        key={j}
                        className={cn(
                          'list-disc',
                          j === q.correctIndex && 'text-primary font-medium'
                        )}
                      >
                        {opt || t('createQuiz.empty')}
                        {j === q.correctIndex && ' ✓'}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default function CreateQuiz() {
  const { t } = useLanguage()
  const { success } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const editId = searchParams.get('edit')
  const aiState = location.state?.fromAi ? location.state : null

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [category, setCategory] = useState('')
  const [audience, setAudience] = useState('')
  const [questions, setQuestions] = useState([emptyQuestion()])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (aiState?.topic) {
      setTitle(aiState.topic)
      setDescription(`Generated from topic: ${aiState.topic}.`)
      setDifficulty(aiState.difficulty || 'medium')
      setQuestions(
        (aiState.questions || []).map((qn) => ({
          text: qn.text || '',
          options: qn.options?.length === 4 ? qn.options : ['', '', '', ''],
          correctIndex: qn.correctIndex ?? 0,
          explanation: qn.explanation || '',
        }))
      )
      return
    }
    if (editId) {
      const q = getQuizById(editId)
      if (q) {
        setTitle(q.title || '')
        setDescription(q.description || '')
        setDifficulty(q.difficulty || 'medium')
        setCategory(q.category || '')
        setAudience(q.audience || '')
        setQuestions(
          (q.questions?.length ? q.questions : [emptyQuestion()]).map((qn) => ({
            text: qn.text || '',
            options: qn.options?.length === 4 ? qn.options : ['', '', '', ''],
            correctIndex: qn.correctIndex ?? 0,
            explanation: qn.explanation || '',
          }))
        )
      }
    }
  }, [editId, aiState?.topic])

  const addQuestion = () => setQuestions((q) => [...q, emptyQuestion()])
  const removeQuestion = (index) => {
    if (questions.length <= 1) return
    setQuestions((q) => q.filter((_, i) => i !== index))
  }
  const updateQuestion = (index, field, value) => {
    setQuestions((q) => {
      const next = [...q]
      if (field === 'text') next[index] = { ...next[index], text: value }
      else if (field === 'correctIndex') next[index] = { ...next[index], correctIndex: Number(value) }
      else if (field === 'explanation') next[index] = { ...next[index], explanation: value }
      else if (field?.startsWith('option')) {
        const i = Number(field.slice(6))
        const opts = [...(next[index].options || ['', '', '', ''])]
        opts[i] = value
        next[index] = { ...next[index], options: opts }
      }
      return next
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const quiz = {
      id: editId,
      title: title.trim(),
      description: description.trim(),
      difficulty,
      category: category || undefined,
      audience: audience || undefined,
      questions: questions.map((q) => ({
        ...q,
        text: q.text.trim(),
        options: (q.options || ['', '', '', '']).map((o) => (o || '').trim()),
        correctIndex: q.correctIndex,
        explanation: q.explanation?.trim() || undefined,
      })),
    }
    saveQuiz(quiz)
    success(t('createQuiz.saved'))
    setSaved(true)
    setTimeout(() => navigate(editId ? `/quiz/${editId}/details` : '/my-quizzes'), 1200)
  }

  const handleCancel = () => {
    if (title.trim() || questions.some((q) => q.text.trim() || q.options.some((o) => o.trim()))) {
      if (window.confirm(t('common.discardConfirm'))) navigate(-1)
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('createQuiz.title')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('createQuiz.subtitle')}{' '}
          <Link to="/ai-generator" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
            <Sparkles className="size-4" /> {t('createQuiz.orGenerateAI')}
          </Link>
          {' · '}
          <Link to="/my-quizzes" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
            {t('createQuiz.viewMyQuizzes')}
          </Link>
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <PenSquare className="size-5 text-primary" />
                {t('createQuiz.quizDetails')}
              </CardTitle>
              <CardDescription>{t('createQuiz.quizDetailsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t('createQuiz.quizTitle')}</Label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('createQuiz.quizTitlePlaceholder')}
                  required
                  className="flex h-10 w-full rounded-lg border border-[#404040] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t('createQuiz.description')}</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('createQuiz.descriptionPlaceholder')}
                  rows={2}
                  className="flex min-h-[80px] w-full rounded-lg border border-[#404040] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">{t('createQuiz.difficulty')}</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder={t('common.selectDifficulty')} />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTIES.map((d) => (
                        <SelectItem key={d.value} value={d.value}>
                          {t(d.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">{t('createQuiz.category')}</Label>
                  <Select value={category || 'general'} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {t(c.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience">{t('createQuiz.audience')}</Label>
                <Select value={audience || 'students'} onValueChange={setAudience}>
                  <SelectTrigger id="audience">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDIENCES.map((a) => (
                      <SelectItem key={a.value} value={a.value}>
                        {t(a.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">{t('createQuiz.questions')}</h2>
              <Button type="button" onClick={addQuestion} size="sm" className="gap-2">
                <Plus className="size-4" />
                {t('createQuiz.addQuestion')}
              </Button>
            </div>
            <div className="space-y-6">
              {questions.map((q, index) => (
                <QuestionBlock
                  key={index}
                  index={index}
                  question={q}
                  onChange={updateQuestion}
                  onRemove={() => removeQuestion(index)}
                  canRemove={questions.length > 1}
                  t={t}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              {t('createQuiz.cancel')}
            </Button>
            <Button type="submit" className="gap-2" disabled={saved}>
              <Save className="size-4" />
              {saved ? t('createQuiz.saved') : t('createQuiz.saveQuiz')}
            </Button>
          </div>
        </form>

        <aside className="hidden lg:block">
          <QuizPreview
            title={title}
            description={description}
            difficulty={difficulty}
            questions={questions}
            t={t}
          />
        </aside>
      </div>

      {/* Mobile preview - collapsible */}
      <div className="mt-8 lg:hidden">
        <QuizPreview
          title={title}
          description={description}
          difficulty={difficulty}
          questions={questions}
          t={t}
        />
      </div>
    </div>
  )
}
