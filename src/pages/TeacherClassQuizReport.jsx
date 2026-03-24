import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BarChart3, BookOpen, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import API from '@/lib/api.js'

function isMongoObjectId(s) {
  return typeof s === 'string' && /^[a-f0-9]{24}$/i.test(s)
}

export default function TeacherClassQuizReport() {
  const { classId, quizId } = useParams()
  const { t, lang } = useLanguage()
  const { user, getToken } = useAuth()
  const [data, setData] = useState(null)
  const [quizMeta, setQuizMeta] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const token = getToken?.() ?? null
  const canSee = user && (user.role === 'teacher' || user.role === 'admin')

  useEffect(() => {
    if (!API || !token || !canSee || !classId || !quizId) {
      setLoading(false)
      return
    }
    setLoading(true)
    const q = encodeURIComponent(quizId)
    fetch(`${API}/api/tracking/class/${classId}/quiz/${q}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (!d.ok) setError(d.error || '')
        else setData(d)
      })
      .catch(() => setError('fetch failed'))
      .finally(() => setLoading(false))
  }, [API, token, canSee, classId, quizId, user])

  useEffect(() => {
    if (!API || !quizId || !isMongoObjectId(quizId)) return
    fetch(`${API}/api/quizzes/${quizId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.quiz) setQuizMeta(d.quiz)
      })
      .catch(() => {})
  }, [API, quizId])

  const title = useMemo(() => {
    const fromAttempt = data?.attempts?.[0]?.quizTitle
    if (fromAttempt?.trim()) return fromAttempt.trim()
    if (quizMeta) return lang === 'ar' && quizMeta.titleAr ? quizMeta.titleAr : quizMeta.title
    return quizId
  }, [data, quizMeta, lang, quizId])

  const questionLabel = (qi) => {
    const q = quizMeta?.questions?.[qi]
    if (!q) return `${t('teacherReports.question')} ${qi + 1}`
    const text = lang === 'ar' ? q.questionAr || q.question : q.question || q.questionAr
    const short = (text || '').slice(0, 72)
    return short.length >= 72 ? `${short}…` : short || `Q${qi + 1}`
  }

  const studentRows = useMemo(() => {
    const attempts = data?.attempts || []
    const map = {}
    for (const att of attempts) {
      const u = att.user
      const uid = String(u?._id || u)
      if (!map[uid]) {
        map[uid] = {
          uid,
          name: u?.displayName || u?.name || uid,
          externalId: u?.externalStudentId || '—',
          count: 0,
          ratios: [],
          lastScore: null,
          lastTotal: null,
          lastAt: null,
        }
      }
      const row = map[uid]
      row.count += 1
      const total = Math.max(1, att.total || 1)
      row.ratios.push((att.score || 0) / total)
      const at = new Date(att.createdAt)
      if (!row.lastAt || at > row.lastAt) {
        row.lastAt = at
        row.lastScore = att.score
        row.lastTotal = att.total
      }
    }
    return Object.values(map).sort((a, b) => (b.lastAt || 0) - (a.lastAt || 0))
  }, [data])

  if (!API) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground">
        <p>{t('tracking.needApi')}</p>
      </div>
    )
  }

  if (!user || !token) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">{t('tracking.needSignIn')}</p>
        <Button asChild className="mt-4">
          <Link to="/sign-in">{t('nav.signIn')}</Link>
        </Button>
      </div>
    )
  }

  if (!canSee) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground">
        <p>{t('tracking.teacherOnly')}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-muted-foreground">
        {t('live.loading')}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-destructive">{error || t('teacherReports.loadError')}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to={`/tracking/class/${classId}`}>{t('teacherReports.backClass')}</Link>
        </Button>
      </div>
    )
  }

  const byQ = [...(data.byQuestion || [])].sort((a, b) => a.questionIndex - b.questionIndex)

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to={`/tracking/class/${classId}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-4" />
        {t('teacherReports.backClass')}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 flex-wrap">
          <BookOpen className="size-7 text-primary shrink-0" />
          <span>{title}</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          {t('teacherReports.attemptCount')}: {data.attempts?.length ?? 0}
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="size-5" />
            {t('teacherReports.perQuestion')}
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {byQ.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('teacherReports.noQuestionStats')}</p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 pe-4 font-medium">{t('teacherReports.question')}</th>
                  <th className="py-2 pe-4 font-medium">{t('teacherReports.correctRate')}</th>
                  <th className="py-2 pe-4 font-medium">{t('teacherReports.wrong')}</th>
                  <th className="py-2 font-medium">{t('teacherReports.avgTime')}</th>
                </tr>
              </thead>
              <tbody>
                {byQ.map((row) => {
                  const n = row.n || 1
                  const pct = Math.round((row.correct / n) * 100)
                  const avgMs = row.totalMs != null && n ? row.totalMs / n : 0
                  return (
                    <tr key={row.questionIndex} className="border-b border-border/60">
                      <td className="py-2 pe-4 max-w-md">{questionLabel(row.questionIndex)}</td>
                      <td className="py-2 pe-4 tabular-nums">
                        {pct}% ({row.correct}/{n})
                      </td>
                      <td className="py-2 pe-4 tabular-nums">{row.wrong}</td>
                      <td className="py-2 text-muted-foreground tabular-nums">
                        {(avgMs / 1000).toFixed(1)}s
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="size-5" />
            {t('teacherReports.perStudent')}
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {studentRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('teacherReports.noStudents')}</p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 pe-4 font-medium">{t('tracking.student')}</th>
                  <th className="py-2 pe-4 font-medium">{t('tracking.externalId')}</th>
                  <th className="py-2 pe-4 font-medium">{t('teacherReports.attempts')}</th>
                  <th className="py-2 pe-4 font-medium">{t('teacherReports.avgScore')}</th>
                  <th className="py-2 font-medium">{t('teacherReports.lastAttempt')}</th>
                </tr>
              </thead>
              <tbody>
                {studentRows.map((row) => {
                  const avgPct =
                    row.ratios.length > 0
                      ? Math.round((row.ratios.reduce((a, b) => a + b, 0) / row.ratios.length) * 100)
                      : 0
                  return (
                    <tr key={row.uid} className="border-b border-border/60">
                      <td className="py-2 pe-4 font-medium">{row.name}</td>
                      <td className="py-2 pe-4 text-muted-foreground">{row.externalId}</td>
                      <td className="py-2 pe-4 tabular-nums">{row.count}</td>
                      <td className="py-2 pe-4 tabular-nums">{avgPct}%</td>
                      <td className="py-2 text-muted-foreground text-xs">
                        {row.lastScore != null && row.lastTotal != null
                          ? `${row.lastScore}/${row.lastTotal} · ${row.lastAt ? row.lastAt.toLocaleString() : ''}`
                          : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
