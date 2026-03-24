import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Medal, Users, Flame, Zap, UsersRound } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { DEMO_LEADERBOARD } from '@/data/demoContent'
import API from '@/lib/api.js'
import Pagination from '@/components/Pagination'

const PAGE_SIZE = 5
const TAB_KEYS = ['global', 'week', 'teams', 'family']

export default function Leaderboard() {
  const { t } = useLanguage()
  const { user, getToken } = useAuth()
  const { success, error: showError } = useToast()
  const [tab, setTab] = useState('global')
  const [page, setPage] = useState(0)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [meStats, setMeStats] = useState(null)
  const [teamInput, setTeamInput] = useState('')

  useEffect(() => {
    setTeamInput((user?.teamCode || '').toString())
  }, [user?.teamCode])

  useEffect(() => {
    if (!API || !user?.id || user.demo) {
      setMeStats(null)
      return
    }
    const token = getToken()
    if (!token) return
    fetch(`${API}/api/gamification/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setMeStats(d)
      })
      .catch(() => {})
  }, [API, user, getToken])

  useEffect(() => {
    setPage(0)
    if (!API) {
      if (tab === 'global') setRows(DEMO_LEADERBOARD.global)
      else if (tab === 'week') setRows(DEMO_LEADERBOARD.week)
      else if (tab === 'teams') setRows(DEMO_LEADERBOARD.teams)
      else setRows(DEMO_LEADERBOARD.family)
      setLoading(false)
      return
    }
    if (tab === 'family') {
      setRows(DEMO_LEADERBOARD.family)
      setLoading(false)
      return
    }
    setLoading(true)
    const path = tab === 'global' ? 'global' : tab === 'week' ? 'week' : 'teams'
    fetch(`${API}/api/gamification/leaderboard/${path}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.ok) setRows([])
        else setRows(d.leaderboard || [])
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false))
  }, [tab, API])

  const isTeamTab = tab === 'teams'

  const displayRows = useMemo(() => {
    if (tab === 'week' && rows.length && rows[0].weekXp != null) {
      return rows.map((r) => ({ ...r, score: r.weekXp ?? r.xp }))
    }
    if (tab === 'global' && rows.length && rows[0].xp != null) {
      return rows.map((r) => ({ ...r, score: r.xp }))
    }
    if (isTeamTab && rows.length && rows[0].members != null) {
      return rows
    }
    return rows
  }, [rows, tab, isTeamTab])

  const topThree = displayRows.filter((r) => r.rank <= 3)
  const rest = displayRows.filter((r) => r.rank > 3)
  const totalPages = Math.ceil(rest.length / PAGE_SIZE)
  const paginatedRest = rest.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const podium = topThree.length >= 3 ? [topThree[1], topThree[0], topThree[2]] : topThree

  const isMine = (row) => {
    if (!user?.id || user.demo || !row.id) return false
    return String(row.id) === String(user.id)
  }

  const scoreLabel = (row) => {
    if (isTeamTab) return row.xp ?? row.score ?? 0
    if (tab === 'week') return row.weekXp ?? row.xp ?? row.score ?? 0
    if (tab === 'global') return row.xp ?? row.score ?? 0
    return row.score ?? 0
  }

  const stats = meStats || {
    xp: user?.xp ?? 0,
    level: user?.level ?? 1,
    streak: user?.streak ?? 0,
    teamCode: user?.teamCode || '',
  }

  const saveTeam = async () => {
    if (!API || !user || user.demo) return
    const token = getToken()
    if (!token) return
    try {
      const res = await fetch(`${API}/api/gamification/team`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ teamCode: teamInput.trim() }),
      })
      const d = await res.json()
      if (!d.ok) {
        showError(d.error || 'Error')
        return
      }
      success(t('leaderboard.saveTeam'))
      const me = await fetch(`${API}/api/gamification/me`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json())
      if (me.ok) setMeStats(me)
    } catch {
      showError('Network error')
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Trophy className="size-7" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('leaderboard.title')}</h1>
          <p className="mt-0.5 text-muted-foreground">{t('leaderboard.subtitle')}</p>
        </div>
      </div>

      {API && user && !user.demo && (
        <Card className="mb-6 border-primary/20 bg-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex flex-wrap items-center gap-2">
              <Zap className="size-4 text-primary" />
              {t('leaderboard.yourStats')}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <Zap className="size-4 text-primary" />
              {t('leaderboard.xp')}: <strong className="text-foreground">{stats.xp}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Trophy className="size-4 text-primary" />
              {t('leaderboard.level')}: <strong>{stats.level}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Flame className="size-4 text-orange-500" />
              {t('leaderboard.streak')}: <strong>{stats.streak}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UsersRound className="size-4 text-muted-foreground" />
              {t('leaderboard.team')}: <strong>{stats.teamCode || '—'}</strong>
            </span>
          </CardContent>
        </Card>
      )}

      {API && user && !user.demo && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t('leaderboard.joinTeam')}</CardTitle>
            <p className="text-xs text-muted-foreground font-normal">{t('leaderboard.teamHint')}</p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 items-end">
            <Input
              value={teamInput}
              onChange={(e) => setTeamInput(e.target.value.toUpperCase())}
              placeholder={t('leaderboard.teamPlaceholder')}
              className="max-w-xs uppercase"
              maxLength={12}
            />
            <Button type="button" onClick={saveTeam}>
              {t('leaderboard.saveTeam')}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mb-6 flex justify-end">
        <Select
          value={tab}
          onValueChange={(v) => {
            setTab(v)
            setPage(0)
          }}
        >
          <SelectTrigger className="w-[200px] rounded-xl border-border/60 bg-muted/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TAB_KEYS.map((k) => (
              <SelectItem key={k} value={k}>
                {t(`leaderboardTabs.${k}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading && API && tab !== 'family' && (
        <p className="text-muted-foreground mb-6">{t('leaderboard.loadingBoard')}</p>
      )}

      {!loading && API && displayRows.length === 0 && tab !== 'family' && (
        <Card className="mb-6 border-dashed">
          <CardContent className="py-10 text-center text-muted-foreground space-y-3">
            <p>{t('leaderboard.emptyBoard')}</p>
            <Button asChild variant="outline">
              <Link to="/my-quizzes">{t('leaderboard.linkPlay')}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {topThree.length >= 3 && !isTeamTab && (
          <div className="grid grid-cols-3 gap-4">
            {podium.filter(Boolean).map((row) => (
              <Card
                key={row.rank}
                className={cn(
                  'text-center transition-shadow hover:shadow-soft',
                  row.rank === 1 && 'order-2 border-primary/30 shadow-glow',
                  row.rank === 2 && 'order-1',
                  row.rank === 3 && 'order-3',
                  isMine(row) && 'ring-2 ring-primary'
                )}
              >
                <CardHeader className="pb-2">
                  <div
                    className={cn(
                      'mx-auto flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold',
                      row.rank === 1 && 'bg-primary/20 text-primary',
                      row.rank === 2 && 'bg-muted text-muted-foreground',
                      row.rank === 3 && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {row.rank === 1 ? <Trophy className="size-5" /> : <Medal className="size-5" />}
                  </div>
                  <CardTitle className="text-lg">#{row.rank}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="font-semibold text-foreground">{row.name}</p>
                  <p className="mt-1 text-sm text-primary font-medium tabular-nums">
                    {tab === 'global' && (
                      <>
                        {scoreLabel(row)} {t('leaderboard.xp')}
                        {row.level != null && (
                          <span className="text-muted-foreground"> · Lv.{row.level}</span>
                        )}
                        {row.streak != null && row.streak > 0 && (
                          <span className="text-muted-foreground">
                            {' '}
                            · <Flame className="inline size-3 text-orange-500" /> {row.streak}
                          </span>
                        )}
                      </>
                    )}
                    {tab === 'week' && (
                      <>
                        {scoreLabel(row)} {t('leaderboard.weekXp')}
                      </>
                    )}
                    {tab === 'family' && row.score}
                  </p>
                  {row.quiz && <p className="mt-1 text-xs text-muted-foreground">{row.quiz}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {topThree.length >= 1 && isTeamTab && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[topThree[1], topThree[0], topThree[2]].filter(Boolean).map((row) => (
              <Card
                key={row.teamCode || row.rank}
                className={cn(
                  'text-center transition-shadow border-border/60',
                  row.rank === 1 && 'border-primary/30 shadow-glow'
                )}
              >
                <CardHeader className="pb-2">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <UsersRound className="size-5" />
                  </div>
                  <CardTitle className="text-lg">#{row.rank}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="font-bold text-foreground text-lg">{row.teamCode || row.name}</p>
                  <p className="mt-1 text-sm text-primary font-medium">
                    {row.xp} {t('leaderboard.xp')}{' '}
                    <span className="text-muted-foreground">
                      · {row.members} {t('leaderboard.members')}
                    </span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {(topThree.length > 0 && topThree.length < 3 && isTeamTab) && (
          <div className="grid gap-4 sm:grid-cols-2">
            {topThree.map((row) => (
              <Card key={row.teamCode || row.rank}>
                <CardContent className="py-4 flex justify-between items-center">
                  <span className="font-semibold">#{row.rank} {row.teamCode || row.name}</span>
                  <Badge variant="secondary">
                    {row.xp} {t('leaderboard.xp')}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('leaderboard.allRankings')}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {paginatedRest.map((row) => (
                <div
                  key={isTeamTab ? row.teamCode + row.rank : row.name + row.rank}
                  className={cn(
                    'flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/30',
                    isMine(row) && 'bg-primary/10'
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                    {row.rank}
                  </span>
                  <span className="flex flex-1 items-center gap-2 font-medium text-foreground min-w-0">
                    {isTeamTab ? (
                      <UsersRound className="size-4 text-primary shrink-0" />
                    ) : (
                      <Users className="size-4 text-muted-foreground shrink-0" />
                    )}
                    <span className="truncate">{isTeamTab ? row.teamCode || row.name : row.name}</span>
                    {isMine(row) && (
                      <Badge variant="secondary" className="text-xs shrink-0">
                        You
                      </Badge>
                    )}
                  </span>
                  <div className="text-end shrink-0">
                    <Badge variant="secondary" className="font-semibold tabular-nums">
                      {isTeamTab ? (
                        <>
                          {row.xp} XP · {row.members} {t('leaderboard.members')}
                        </>
                      ) : tab === 'global' ? (
                        <>
                          {scoreLabel(row)} XP
                          {row.level != null && <span className="text-muted-foreground"> · Lv.{row.level}</span>}
                        </>
                      ) : tab === 'week' ? (
                        <>
                          {scoreLabel(row)} {t('leaderboard.weekXp')}
                        </>
                      ) : (
                        row.score
                      )}
                    </Badge>
                    {row.quiz && (
                      <p className="text-xs text-muted-foreground mt-1 hidden sm:block max-w-[140px] truncate">
                        {row.quiz}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
