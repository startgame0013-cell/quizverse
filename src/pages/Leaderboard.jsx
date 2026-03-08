import { useState } from 'react'
import { Trophy, Medal, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'
import { DEMO_LEADERBOARD } from '@/data/demoContent'
import Pagination from '@/components/Pagination'

const PAGE_SIZE = 5

const TAB_KEYS = ['global', 'school', 'family', 'week']

export default function Leaderboard() {
  const { t } = useLanguage()
  const [tab, setTab] = useState('global')
  const [page, setPage] = useState(0)
  const data = DEMO_LEADERBOARD[tab] || DEMO_LEADERBOARD.global
  const topThree = data.filter((r) => r.rank <= 3)
  const rest = data.filter((r) => r.rank > 3)
  const totalPages = Math.ceil(rest.length / PAGE_SIZE)
  const paginatedRest = rest.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const currentUserName = 'QuizMaster99'

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

      <div className="mb-6 flex justify-end">
        <Select value={tab} onValueChange={(v) => { setTab(v); setPage(0); }}>
          <SelectTrigger className="w-[180px] rounded-xl border-border/60 bg-muted/30">
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

      <div className="space-y-6">
          {topThree.length >= 3 && (
            <div className="grid grid-cols-3 gap-4">
              {[topThree[1], topThree[0], topThree[2]].filter(Boolean).map((row) => (
                <Card
                  key={row.rank}
                  className={cn(
                    'text-center transition-shadow hover:shadow-soft',
                    row.rank === 1 && 'order-2 border-primary/30 shadow-glow',
                    row.rank === 2 && 'order-1',
                    row.rank === 3 && 'order-3',
                    row.name === currentUserName && 'ring-2 ring-primary'
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
                    <p className="mt-1 text-sm text-primary font-medium">{row.score}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{row.quiz}</p>
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
                    key={row.rank}
                    className={cn(
                      'flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/30',
                      row.name === currentUserName && 'bg-primary/10'
                    )}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                      {row.rank}
                    </span>
                    <span className="flex flex-1 items-center gap-2 font-medium text-foreground">
                      <Users className="size-4 text-muted-foreground" />
                      {row.name}
                      {row.name === currentUserName && (
                        <Badge variant="secondary" className="text-xs">You</Badge>
                      )}
                    </span>
                    <Badge variant="secondary" className="font-semibold">
                      {row.score}
                    </Badge>
                    <span className="text-sm text-muted-foreground hidden sm:inline">{row.quiz}</span>
                  </div>
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </CardContent>
          </Card>
      </div>
    </div>
  )
}
