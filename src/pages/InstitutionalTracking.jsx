import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Building2, Users, BarChart3, Radio, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import API from '@/lib/api.js'

export default function InstitutionalTracking() {
  const { classId } = useParams()
  const { t } = useLanguage()
  const { user, getToken } = useAuth()
  const [classes, setClasses] = useState([])
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const token = getToken?.() ?? null
  const canSee = user && (user.role === 'teacher' || user.role === 'admin')

  const quizSummaries = useMemo(() => {
    if (!data?.solos?.length) return []
    const map = new Map()
    for (const s of data.solos) {
      const qid = s.quizId
      if (!qid) continue
      if (!map.has(qid)) {
        map.set(qid, {
          quizId: qid,
          title: (s.quizTitle || '').trim() || qid,
          count: 0,
          last: null,
        })
      }
      const e = map.get(qid)
      e.count += 1
      const ts = new Date(s.createdAt)
      if (!e.last || ts > e.last) e.last = ts
    }
    return [...map.values()].sort((a, b) => (b.last || 0) - (a.last || 0))
  }, [data])

  useEffect(() => {
    if (!API || !token || !canSee) {
      setLoading(false)
      return
    }
    if (!classId) {
      fetch(`${API}/api/classes`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((d) => {
          if (d.ok) setClasses(d.classes || [])
          else setError(d.error || '')
        })
        .catch(() => setError('fetch failed'))
        .finally(() => setLoading(false))
      return
    }
    setLoading(true)
    fetch(`${API}/api/tracking/class/${classId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (!d.ok) setError(d.error || '')
        else setData(d)
      })
      .catch(() => setError('fetch failed'))
      .finally(() => setLoading(false))
  }, [API, token, classId, canSee, user])

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

  if (!classId) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <Building2 className="size-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('tracking.title')}</h1>
            <p className="text-muted-foreground text-sm">{t('tracking.subtitle')}</p>
          </div>
        </div>
        {loading ? (
          <p className="text-muted-foreground">{t('live.loading')}</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : classes.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">{t('tracking.noClasses')}</CardContent>
          </Card>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {classes.map((c) => (
              <li key={c._id}>
                <Link to={`/tracking/class/${c._id}`}>
                  <Card className="h-full transition-shadow hover:shadow-md hover:border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-lg">{c.name}</CardTitle>
                      <CardDescription>
                        {c.institutionName ? `${c.institutionName} · ` : ''}
                        {t('tracking.code')}: {c.code}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-muted-foreground">
        {t('live.loading')}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-destructive">{error || t('tracking.loadError')}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/tracking">{t('tracking.backList')}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/tracking"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-4" />
        {t('tracking.backList')}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="size-7 text-primary" />
          {data.class.name}
        </h1>
        {data.class.institutionName && (
          <p className="text-muted-foreground mt-1">{data.class.institutionName}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          {t('tracking.code')}: {data.class.code} · {t('tracking.soloAttempts')}: {data.counts.soloAttempts} ·{' '}
          {t('tracking.liveSessions')}: {data.counts.liveSessions}
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="size-5" />
            {t('teacherReports.quizReports')}
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {quizSummaries.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('teacherReports.noQuizzesInClass')}</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 pe-4">{t('teacherReports.quizTitle')}</th>
                  <th className="py-2 pe-4">{t('teacherReports.attempts')}</th>
                  <th className="py-2 pe-4">{t('teacherReports.lastActivity')}</th>
                  <th className="py-2">{t('teacherReports.open')}</th>
                </tr>
              </thead>
              <tbody>
                {quizSummaries.map((row) => (
                  <tr key={row.quizId} className="border-b border-border/60">
                    <td className="py-2 pe-4 font-medium max-w-xs truncate" title={row.title}>
                      {row.title}
                    </td>
                    <td className="py-2 pe-4 tabular-nums">{row.count}</td>
                    <td className="py-2 pe-4 text-muted-foreground text-xs">
                      {row.last ? row.last.toLocaleString() : '—'}
                    </td>
                    <td className="py-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          to={`/tracking/class/${classId}/quiz/${encodeURIComponent(row.quizId)}`}
                        >
                          {t('teacherReports.viewDetail')}
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="size-5" />
            {t('tracking.soloByStudent')}
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2 pe-4">{t('tracking.student')}</th>
                <th className="py-2 pe-4">{t('tracking.externalId')}</th>
                <th className="py-2 pe-4">{t('tracking.attempts')}</th>
                <th className="py-2">{t('tracking.lastActivity')}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.soloByStudent || {}).map(([uid, attempts]) => {
                const first = attempts[0]
                const u = first?.user
                const name = u?.displayName || u?.name || uid
                const ext = u?.externalStudentId || '—'
                const last = attempts[0]?.createdAt
                return (
                  <tr key={uid} className="border-b border-border/60">
                    <td className="py-2 pe-4 font-medium">{name}</td>
                    <td className="py-2 pe-4 text-muted-foreground">{ext}</td>
                    <td className="py-2 pe-4">{attempts.length}</td>
                    <td className="py-2 text-muted-foreground text-xs">
                      {last ? new Date(last).toLocaleString() : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {Object.keys(data.soloByStudent || {}).length === 0 && (
            <p className="text-sm text-muted-foreground py-4">{t('tracking.noSoloYet')}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Radio className="size-5" />
            {t('tracking.liveSessionsTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data.liveSessions || []).length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('tracking.noLiveYet')}</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {data.liveSessions.map((s) => (
                <li key={s._id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
                  <span className="font-medium">{s.quizTitle}</span>
                  <span className="text-muted-foreground">PIN {s.pin}</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/live/report/${s.pin}`}>{t('tracking.openReport')}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
