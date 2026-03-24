import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/context/LanguageContext'
import API from '@/lib/api.js'

export default function LiveGameReport() {
  const { pin } = useParams()
  const { t } = useLanguage()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!API || !pin) {
      setError(t('reports.needApi'))
      return
    }
    fetch(`${API}/api/reports/live/${pin}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.ok) setError(d.error || t('reports.loadError'))
        else setData(d.report)
      })
      .catch(() => setError(t('reports.loadError')))
  }, [pin, t])

  if (!API) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground">
        <p>{t('reports.needApi')}</p>
        <Button asChild className="mt-4">
          <Link to="/">{t('notFound.goHome')}</Link>
        </Button>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">{error}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/">{t('notFound.goHome')}</Link>
        </Button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground">
        {t('live.loading', 'Loading...')}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-4" />
        {t('reports.backHome')}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t('reports.liveTitle')}</h1>
        <p className="text-muted-foreground mt-1">
          PIN {data.pin} · {data.quizTitle}
        </p>
        {data.legacyAnswersWithoutQuestionIndex > 0 && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
            {t('reports.legacyAnswersWarning').replace('{{n}}', String(data.legacyAnswersWithoutQuestionIndex))}
          </p>
        )}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="size-5" />
            {t('reports.perStudent')}
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2 pe-4 font-medium">{t('reports.player')}</th>
                <th className="py-2 pe-4 font-medium">{t('reports.score')}</th>
                {Array.from({ length: data.questionCount }, (_, i) => (
                  <th key={i} className="py-2 px-1 font-medium text-center whitespace-nowrap">
                    Q{i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.byPlayer.map((row) => (
                <tr key={row.playerIndex} className="border-b border-border/60">
                  <td className="py-2 pe-4 font-medium">{row.nickname}</td>
                  <td className="py-2 pe-4 tabular-nums">{row.score}</td>
                  {row.perQuestion.map((cell, i) => (
                    <td key={i} className="py-2 px-1 text-center">
                      {cell.correct === true && <CheckCircle2 className="size-4 text-primary mx-auto" />}
                      {cell.correct === false && <XCircle className="size-4 text-destructive mx-auto" />}
                      {cell.correct === null && <span className="text-muted-foreground">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('reports.perQuestion')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.byQuestion.map((q) => (
            <div key={q.questionIndex} className="rounded-lg border border-border p-4">
              <p className="font-medium text-foreground mb-2">
                {q.questionIndex + 1}. {q.text || t('createQuiz.noQuestion')}
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                {t('reports.correctOption')} {String.fromCharCode(65 + (q.correctIndex ?? 0))}
              </p>
              {q.responses.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('reports.noResponses')}</p>
              ) : (
                <ul className="text-sm space-y-1">
                  {q.responses.map((r, idx) => (
                    <li key={idx} className="flex flex-wrap gap-2 items-center">
                      <span className="font-medium">{r.nickname}</span>
                      <span className="text-muted-foreground">
                        {t('reports.answered')} {r.answerIndex != null ? String.fromCharCode(65 + r.answerIndex) : '—'}
                      </span>
                      {r.correct ? (
                        <CheckCircle2 className="size-4 text-primary" />
                      ) : (
                        <XCircle className="size-4 text-destructive" />
                      )}
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {r.timeTaken != null ? `${t('reports.timeSec')}: ${Number(r.timeTaken).toFixed(1)}` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
