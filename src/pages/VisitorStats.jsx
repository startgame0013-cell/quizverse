import { useState, useEffect } from 'react'
import { Users, Globe, MapPin, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/context/LanguageContext'

import API from '@/lib/api.js'

export default function VisitorStats() {
  const { t } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/stats/visits`)
      .then((res) => res.json())
      .then((d) => {
        if (d.ok) setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-muted-foreground">Could not load visitor stats. Make sure the backend is running.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Users className="size-7" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('visitorStats.title', 'Visitor Statistics')}
          </h1>
          <p className="mt-0.5 text-muted-foreground">
            {t('visitorStats.subtitle', 'Real-time visitors, countries, and recent activity')}
          </p>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" />
            {t('visitorStats.totalVisits', 'Total Visits')}: {data.total.toLocaleString()}
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Globe className="size-5" />
          {t('visitorStats.byCountry', 'By Country')}
        </h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {data.byCountry.length === 0 ? (
                <p className="px-6 py-8 text-center text-muted-foreground">
                  {t('visitorStats.noCountryData', 'No country data yet')}
                </p>
              ) : (
                data.byCountry.map(({ country, code, count }) => (
                  <div
                    key={code}
                    className="flex items-center justify-between px-6 py-4 hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="size-4 text-muted-foreground" />
                      <span className="font-medium">{country}</span>
                      <span className="text-sm text-muted-foreground">({code})</span>
                    </div>
                    <span className="font-semibold text-primary">{count}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Clock className="size-5" />
          {t('visitorStats.recentVisits', 'Recent Visits')}
        </h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {data.recent.length === 0 ? (
                <p className="px-6 py-8 text-center text-muted-foreground">
                  {t('visitorStats.noRecent', 'No visits yet')}
                </p>
              ) : (
                data.recent.map((v, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 px-6 py-3 text-sm">
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-muted-foreground truncate block">{v.ip || '-'}</span>
                      <span className="text-muted-foreground">{v.path}</span>
                    </div>
                    <span className="shrink-0">{v.country}</span>
                    <span className="shrink-0 text-muted-foreground">
                      {v.createdAt ? new Date(v.createdAt).toLocaleString() : '-'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
