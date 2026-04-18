import { useState, useEffect } from 'react'
import { Users, Globe, Clock, Inbox } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { countryCodeToFlag } from '@/lib/countryFlag'
import API from '@/lib/api.js'

export default function VisitorStats() {
  const { t, lang } = useLanguage()
  const { user, getToken } = useAuth()
  const [data, setData] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!API) {
      setLoading(false)
      return
    }
    fetch(`${API}/api/stats/visits`)
      .then((res) => res.json())
      .then((d) => {
        if (d.ok) setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!API || user?.role !== 'admin') return
    const token = getToken?.()
    if (!token) return
    fetch(`${API}/api/community/feedback`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((d) => {
        if (d.ok) setFeedback(d.items || [])
      })
      .catch(() => {})
  }, [user?.role, getToken])

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-muted-foreground">{t('pageComments.loading')}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-muted-foreground">{t('visitorStats.loadFail')}</p>
      </div>
    )
  }

  const kindLabel = (k) => {
    if (k === 'bug') return t('visitorStats.kindBug')
    if (k === 'other') return t('visitorStats.kindOther')
    return t('visitorStats.kindSuggestion')
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Users className="size-7" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('visitorStats.title')}</h1>
          <p className="mt-0.5 text-muted-foreground">{t('visitorStats.subtitle')}</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" />
            {t('visitorStats.totalVisits')}: {data.total.toLocaleString(lang === 'ar' ? 'ar' : 'en')}
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Globe className="size-5" />
          {t('visitorStats.byCountry')}
        </h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {data.byCountry.length === 0 ? (
                <p className="px-6 py-8 text-center text-muted-foreground">{t('visitorStats.noCountryData')}</p>
              ) : (
                data.byCountry.map(({ country, code, count }) => (
                  <div
                    key={code}
                    className="flex items-center justify-between px-6 py-4 hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl leading-none" title={country}>
                        {countryCodeToFlag(code)}
                      </span>
                      <span className="font-medium">{country}</span>
                      <span className="text-sm text-muted-foreground">({code})</span>
                    </div>
                    <span className="font-semibold text-primary">
                      {count.toLocaleString(lang === 'ar' ? 'ar' : 'en')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Clock className="size-5" />
          {t('visitorStats.recentVisits')}
        </h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {data.recent.length === 0 ? (
                <p className="px-6 py-8 text-center text-muted-foreground">{t('visitorStats.noRecent')}</p>
              ) : (
                data.recent.map((v, i) => (
                  <div key={i} className="flex flex-wrap items-center justify-between gap-2 px-6 py-3 text-sm">
                    <div className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-foreground">{v.path}</span>
                      {v.city ? (
                        <span className="text-xs text-muted-foreground">
                          {v.city} · {v.country}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">{v.country}</span>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {v.createdAt ? new Date(v.createdAt).toLocaleString(lang === 'ar' ? 'ar' : 'en') : '—'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Inbox className="size-5" />
          {t('visitorStats.suggestionsTitle')}
        </h2>
        {user?.role !== 'admin' ? (
          <p className="text-sm text-muted-foreground">{t('visitorStats.suggestionsHint')}</p>
        ) : (
          <Card>
            <CardContent className="p-0">
              {!feedback ? (
                <p className="px-6 py-6 text-sm text-muted-foreground">{t('pageComments.loading')}</p>
              ) : feedback.length === 0 ? (
                <p className="px-6 py-8 text-center text-muted-foreground">{t('visitorStats.suggestionsEmpty')}</p>
              ) : (
                <div className="divide-y divide-border max-h-[28rem] overflow-y-auto">
                  {feedback.map((item) => (
                    <div key={item._id} className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded bg-primary/15 px-2 py-0.5 font-medium text-primary">
                          {kindLabel(item.kind)}
                        </span>
                        <span>{item.createdAt ? new Date(item.createdAt).toLocaleString(lang === 'ar' ? 'ar' : 'en') : ''}</span>
                        {item.country ? (
                          <span>
                            {countryCodeToFlag(item.country)} {item.country}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-foreground">{item.message}</p>
                      <div className="mt-2 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                        {item.email ? <span>{item.email}</span> : null}
                        {item.path ? <span className="font-mono">{item.path}</span> : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
