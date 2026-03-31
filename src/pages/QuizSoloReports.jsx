import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { getQuizDisplay, quizContentLang } from '@/lib/quizStore'
import { useQuiz } from '@/hooks/useQuiz'
import API from '@/lib/api.js'

export default function QuizSoloReports() {
  const { id } = useParams()
  const { t, lang } = useLanguage()
  const { isAuthenticated } = useAuth()
  const { quiz, loading: quizLoading, error: quizErr } = useQuiz(id)
  const [attempts, setAttempts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!API || !isAuthenticated || !id) return
    try {
      const token = localStorage.getItem('quizverse_token')
      if (!token) return
      fetch(`${API}/api/reports/solo/quiz/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((d) => {
          if (!d.ok) setError(d.error || t('reports.loadError'))
          else setAttempts(d.attempts || [])
        })
        .catch(() => setError(t('reports.loadError')))
    } catch {
      setError(t('reports.loadError'))
    }
  }, [API, id, isAuthenticated, t])

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

  const display = getQuizDisplay(quiz, quizContentLang(quiz))

  if (!API) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground">
        <p>{t('reports.needApi')}</p>
        <Button asChild className="mt-4">
          <Link to={`/quiz/${id}/details`}>{t('reports.backQuiz')}</Link>
        </Button>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">{t('reports.soloNeedLogin')}</p>
        <Button asChild className="mt-4">
          <Link to="/sign-in">{t('nav.signIn')}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to={`/quiz/${id}/details`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-4" />
        {t('reports.backQuiz')}
      </Link>

      <h1 className="text-2xl font-bold text-foreground mb-1">{t('reports.soloTitle')}</h1>
      <p className="text-muted-foreground mb-8">{display.title}</p>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {attempts.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {t('reports.soloEmpty')}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {attempts.map((att) => (
            <Card key={att._id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex flex-wrap gap-2 justify-between">
                  <span>
                    {att.score} / {att.total} · {new Date(att.createdAt).toLocaleString()}
                  </span>
                  <span className="text-sm font-normal text-muted-foreground tabular-nums">
                    {t('playQuiz.timeTaken')}: {att.timeSpentSec}s
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(att.responses || []).map((r) => {
                  const q = quiz.questions?.[r.questionIndex]
                  const short = q
                    ? (lang === 'ar' ? (q.textAr || q.text || '') : (q.text || q.textAr || '')).slice(0, 80)
                    : `Q${r.questionIndex + 1}`
                  return (
                    <div
                      key={`${att._id}-${r.questionIndex}`}
                      className="flex flex-wrap items-start gap-2 text-sm rounded-lg border border-border/60 px-3 py-2"
                    >
                      {r.correct ? (
                        <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="size-4 text-destructive shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{short}{short.length >= 80 ? '…' : ''}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {t('reports.answered')} {r.answerIndex >= 0 ? String.fromCharCode(65 + r.answerIndex) : '—'} ·{' '}
                          {(r.timeMs / 1000).toFixed(1)}s
                        </p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-8">{t('reports.soloFootnote')}</p>
    </div>
  )
}
