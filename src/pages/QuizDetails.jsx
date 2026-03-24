import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  PenSquare,
  Play,
  Radio,
  Copy,
  CheckCircle2,
  ClipboardList,
  LayoutDashboard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '@/context/LanguageContext'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import { duplicateQuiz, getQuestionDisplay, getQuizDisplay } from '@/lib/quizStore'
import { useQuiz } from '@/hooks/useQuiz'
import { isMongoObjectId, createQuizOnServer, quizClientToServerPayload } from '@/lib/quizApi'
import API from '@/lib/api.js'

export default function QuizDetails() {
  const { t, lang } = useLanguage()
  const { success, error: showError } = useToast()
  const { user, getToken } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const { quiz, loading: quizLoading, error: quizErr } = useQuiz(id)

  useEffect(() => {
    if (!API || !user || (user.role !== 'teacher' && user.role !== 'admin')) return
    const token = getToken()
    if (!token) return
    fetch(`${API}/api/classes`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && Array.isArray(d.classes)) setClasses(d.classes)
      })
      .catch(() => {})
  }, [API, user, getToken])

  if (quizLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground">
        <p>{t('playQuiz.loadingQuiz')}</p>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">
          {quizErr === 'noApi' ? t('playQuiz.cloudNeedsApi') : t('playQuiz.notFound')}
        </p>
        <Button asChild className="mt-4">
          <Link to="/my-quizzes">{t('playQuiz.backToQuizzes')}</Link>
        </Button>
      </div>
    )
  }

  const handleDuplicate = async () => {
    if (!quiz) return
    if (isMongoObjectId(id) && API && user && !user.demo && getToken()) {
      try {
        const payload = quizClientToServerPayload({
          ...quiz,
          title: `${quiz.title || t('myQuizzes.untitled')} (Copy)`,
        })
        const created = await createQuizOnServer(getToken(), payload)
        success(t('createQuiz.saved'))
        navigate(`/quiz/${String(created._id)}/details`)
      } catch (e) {
        showError(e.message || 'Duplicate failed')
      }
      return
    }
    const copy = duplicateQuiz(id)
    if (copy) {
      success(t('createQuiz.saved'))
      navigate(`/quiz/${copy.id}/details`)
    }
  }

  const handleHost = async () => {
    if (!API) {
      success(t('live.demoPin', 'Demo mode — PIN: 123456'))
      navigate(`/live/host/123456?quizData=${encodeURIComponent(JSON.stringify(quiz))}`)
      return
    }
    try {
      const token = getToken()
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers.Authorization = `Bearer ${token}`
      const body = {
        quizId: id,
        quizTitle: quizDisplay.title || t('myQuizzes.untitled'),
        quizData: quiz,
      }
      if (selectedClassId) {
        if (!token) {
          showError(t('quizDetails.needTokenForClass'))
          return
        }
        body.classId = selectedClassId
      }
      const res = await fetch(`${API}/api/game/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.ok && data.pin) {
        success(t('live.sessionCreated', 'Game session created!'))
        navigate(`/live/host/${data.pin}?quizData=${encodeURIComponent(JSON.stringify(quiz))}`)
      } else {
        showError(data.error || t('live.createFailed', 'Failed to create session'))
      }
    } catch (e) {
      showError(t('live.createFailed', 'Failed to create session'))
    }
  }

  const questions = quiz.questions || []
  const quizDisplay = getQuizDisplay(quiz, lang)

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/my-quizzes"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-4" />
        {t('playQuiz.backToQuizzes')}
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {quizDisplay.title || t('myQuizzes.untitled')}
        </h1>
        {quizDisplay.description && (
          <p className="mt-2 text-muted-foreground">
            {quizDisplay.description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary">{t(`difficulty.${quiz.difficulty || 'medium'}`)}</Badge>
          {quiz.category && <Badge variant="outline">{t(`category.${quiz.category}`) || quiz.category}</Badge>}
          {quiz.stage && <Badge variant="outline">{t(`stage.${quiz.stage}`)}</Badge>}
          {quiz.audience && <Badge variant="outline">{t(`audience.${quiz.audience}`) || quiz.audience}</Badge>}
        </div>
      </div>

      {(user?.role === 'teacher' || user?.role === 'admin') && classes.length > 0 && (
        <div className="mb-6 max-w-lg space-y-2 rounded-xl border border-border bg-muted/20 p-4">
          <Label className="text-foreground">{t('quizDetails.linkToClass')}</Label>
          <Select
            value={selectedClassId || 'none'}
            onValueChange={(v) => setSelectedClassId(v === 'none' ? '' : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('quizDetails.selectClass')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t('quizDetails.noClass')}</SelectItem>
              {classes.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name} ({c.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{t('quizDetails.classTrackingHint')}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-8">
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <Button variant="outline" className="gap-2" asChild>
            <Link to="/tracking">
              <LayoutDashboard className="size-4" />
              {t('quizDetails.institutionalTracking')}
            </Link>
          </Button>
        )}
        <Button asChild className="gap-2">
          <Link to={`/create-quiz?edit=${id}`}>
            <PenSquare className="size-4" />
            {t('quizDetails.editQuiz')}
          </Link>
        </Button>
        <Button variant="outline" className="gap-2" asChild>
          <Link
            to={`/quiz/${id}${selectedClassId ? `?classId=${encodeURIComponent(selectedClassId)}` : ''}`}
          >
            <Play className="size-4" />
            {t('quizDetails.play')}
          </Link>
        </Button>
        <Button variant="outline" className="gap-2" onClick={handleHost}>
          <Radio className="size-4" />
          {t('quizDetails.hostLive')}
        </Button>
        <Button variant="outline" className="gap-2" asChild>
          <Link to={`/quiz/${id}/reports`}>
            <ClipboardList className="size-4" />
            {t('quizDetails.soloReports')}
          </Link>
        </Button>
        <Button variant="outline" className="gap-2" onClick={handleDuplicate}>
          <Copy className="size-4" />
          {t('quizDetails.duplicate')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {questions.length} {t('quizDetails.questionCount')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((q, i) => {
            const d = getQuestionDisplay(q, lang)
            const explanation = lang === 'ar' ? (q.explanationAr || '') : (q.explanation || '')
            return (
            <div key={q.id || i} className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="font-medium text-foreground">{i + 1}. {d.text || t('createQuiz.noQuestion')}</p>
              <ul className="mt-3 space-y-2">
                {d.options?.map((opt, j) => (
                  <li
                    key={j}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                      j === q.correctIndex ? 'bg-primary/15 text-primary border border-primary/30' : 'text-muted-foreground'
                    }`}
                  >
                    {opt || t('createQuiz.empty')}
                    {j === q.correctIndex && <CheckCircle2 className="size-4 shrink-0" />}
                  </li>
                ))}
              </ul>
              {explanation && (
                <p className="mt-2 text-xs text-muted-foreground italic">{explanation}</p>
              )}
            </div>
          )})}
        </CardContent>
      </Card>
    </div>
  )
}
