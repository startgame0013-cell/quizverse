import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Loader2, PenSquare, CheckCircle2, Save, FileText, Type } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getMockQuestions } from '@/data/mockAiQuestions'
import { saveQuiz } from '@/lib/quizStore'
import { useLanguage } from '@/context/LanguageContext'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import API from '@/lib/api.js'

const DIFFICULTIES = [
  { value: 'easy', labelKey: 'difficulty.easy' },
  { value: 'medium', labelKey: 'difficulty.medium' },
  { value: 'hard', labelKey: 'difficulty.hard' },
]

const COUNTS = [3, 5, 7, 10]

export default function AiQuizGenerator() {
  const { t, lang } = useLanguage()
  const { success, error: showError, info } = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('topic')
  const [topic, setTopic] = useState('')
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfName, setPdfName] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [questionCount, setQuestionCount] = useState(5)
  const [questions, setQuestions] = useState(null)
  const [loading, setLoading] = useState(false)
  /** 'topic' | 'pdf' — what was used for the last successful generation */
  const [generatedFrom, setGeneratedFrom] = useState(null)

  const useRealApi = () =>
    !!(API && user && !user.demo && typeof localStorage !== 'undefined' && localStorage.getItem('quizverse_token'))

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (mode === 'topic' && !topic.trim()) return
    if (mode === 'pdf' && !API) {
      showError(t('aiGenerator.needApiPdf'))
      return
    }
    if (mode === 'pdf' && !pdfFile) {
      showError(t('aiGenerator.pdfPickFile'))
      return
    }
    if (mode === 'pdf' && !localStorage.getItem('quizverse_token')) {
      showError(t('aiGenerator.needSignIn'))
      return
    }

    setLoading(true)
    setQuestions(null)

    try {
      if (mode === 'topic') {
        if (useRealApi()) {
          const token = localStorage.getItem('quizverse_token')
          const res = await fetch(`${API}/api/ai/generate-quiz`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              topic: topic.trim(),
              language: lang === 'ar' ? 'ar' : 'en',
              count: questionCount,
            }),
          })
          const data = await res.json()
          if (!data.ok) throw new Error(data.error || 'AI failed')
          setQuestions(data.questions)
          setGeneratedFrom('topic')
        } else {
          await new Promise((r) => setTimeout(r, 400))
          setQuestions(getMockQuestions(topic, difficulty, questionCount, lang))
          setGeneratedFrom('topic')
          info(t('aiGenerator.mockFallback'))
        }
      } else {
        const token = localStorage.getItem('quizverse_token')
        const fd = new FormData()
        fd.append('pdf', pdfFile)
        fd.append('count', String(questionCount))
        fd.append('language', lang === 'ar' ? 'ar' : 'en')
        fd.append('difficulty', difficulty)
        const res = await fetch(`${API}/api/ai/pdf-to-quiz`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        })
        const data = await res.json()
        if (!data.ok) {
          if (data.code === 'PDF_NO_TEXT') throw new Error(t('aiGenerator.pdfNoText'))
          throw new Error(data.error || 'PDF quiz failed')
        }
        setQuestions(data.questions)
        setGeneratedFrom('pdf')
      }
    } catch (err) {
      showError(err.message || t('aiGenerator.errorGeneric'))
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    if (!questions?.length) return
    const titleFallback = lang === 'ar' ? 'كويز مولّد بالذكاء الاصطناعي' : 'AI Generated Quiz'
    const title =
      topic.trim() ||
      (generatedFrom === 'pdf' && pdfName ? pdfName.replace(/\.pdf$/i, '') : '') ||
      titleFallback
    const desc =
      generatedFrom === 'pdf'
        ? lang === 'ar'
          ? `مولّد من ملف PDF: ${pdfName || '—'}. الصعوبة: ${t(`difficulty.${difficulty}`)}.`
          : `Generated from PDF: ${pdfName || '—'}. Difficulty: ${difficulty}.`
        : lang === 'ar'
          ? `مولّد من الموضوع: ${topic}. الصعوبة: ${t(`difficulty.${difficulty}`)}.`
          : `Generated from topic: ${topic}. Difficulty: ${difficulty}.`
    const quiz = {
      title,
      description: desc,
      difficulty,
      questions,
    }
    const saved = saveQuiz(quiz)
    success(t('createQuiz.saved'))
    navigate(`/quiz/${saved.id}/details`)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Sparkles className="size-7" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('aiGenerator.title')}</h1>
          <p className="mt-0.5 text-muted-foreground">{t('aiGenerator.subtitle')}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('aiGenerator.generateTitle')}</CardTitle>
          <CardDescription>{t('aiGenerator.generateDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              type="button"
              variant={mode === 'topic' ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
              onClick={() => setMode('topic')}
            >
              <Type className="size-4" />
              {t('aiGenerator.modeTopic')}
            </Button>
            <Button
              type="button"
              variant={mode === 'pdf' ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
              onClick={() => setMode('pdf')}
            >
              <FileText className="size-4" />
              {t('aiGenerator.modePdf')}
            </Button>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            {mode === 'topic' ? (
              <div className="space-y-2">
                <Label htmlFor="topic">{t('aiGenerator.topic')}</Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={t('aiGenerator.topicPlaceholder')}
                  required={mode === 'topic'}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="pdf">{t('aiGenerator.pdfFile')}</Label>
                <Input
                  id="pdf"
                  type="file"
                  accept=".pdf,application/pdf"
                  className="cursor-pointer"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    setPdfFile(f || null)
                    setPdfName(f?.name || '')
                  }}
                />
                <p className="text-xs text-muted-foreground">{t('aiGenerator.pdfHint')}</p>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('aiGenerator.difficulty')}</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
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
                <Label>{t('aiGenerator.questionCount')}</Label>
                <Select value={String(questionCount)} onValueChange={(v) => setQuestionCount(Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTS.map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                {loading ? t('aiGenerator.generating') : t('aiGenerator.generate')}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/create-quiz" className="gap-2">
                  <PenSquare className="size-4" />
                  {t('aiGenerator.buildManually')}
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {questions && questions.length > 0 && (
        <section className="mt-10 animate-fade-in">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{t('aiGenerator.generatedTitle')}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {generatedFrom === 'pdf' ? (
                  <>
                    {t('aiGenerator.sourcePdf')}: {pdfName || '—'} · {t('aiGenerator.difficultyLabel')}:{' '}
                    {t(`difficulty.${difficulty}`)}
                  </>
                ) : (
                  <>
                    {t('aiGenerator.topicLabel')}: {topic || '—'} · {t('aiGenerator.difficultyLabel')}:{' '}
                    {t(`difficulty.${difficulty}`)}
                  </>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="gap-2">
                <Save className="size-4" />
                {t('aiGenerator.saveToMyQuizzes')}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  navigate('/create-quiz', {
                    state: { fromAi: true, topic, difficulty, questions },
                  })
                }
                className="gap-2"
              >
                <PenSquare className="size-4" />
                {t('aiGenerator.editAndSave')}
              </Button>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {questions.map((q, i) => (
              <Card key={i}>
                <CardContent className="pt-5">
                  <p className="font-medium text-foreground">
                    {i + 1}. {q.text}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {q.options.map((opt, j) => (
                      <li
                        key={j}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                          j === q.correctIndex
                            ? 'bg-primary/15 text-primary border border-primary/30'
                            : 'bg-muted/50 text-muted-foreground'
                        }`}
                      >
                        {String.fromCharCode(65 + j)}. {opt}
                        {j === q.correctIndex && <CheckCircle2 className="size-4 shrink-0" />}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
