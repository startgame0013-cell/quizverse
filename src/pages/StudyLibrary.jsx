import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  BookOpen,
  FileText,
  Link2,
  Search,
  Video,
  Layers,
  GraduationCap,
  BookMarked,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLanguage } from '@/context/LanguageContext'
import {
  filterEntries,
  getSubjects,
  getGrades,
  subjectLabel,
  gradeLabel,
  unitLabel,
  entryTitle,
  entryDescription,
} from '@/lib/studyLibrary'

const TYPE_ICONS = {
  summary: BookOpen,
  pdf: FileText,
  video: Video,
  link: Link2,
}

export default function StudyLibrary() {
  const { t, lang } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()

  const q = searchParams.get('q') || ''
  const subjectId = searchParams.get('subject') || ''
  const gradeId = searchParams.get('grade') || ''
  const type = searchParams.get('type') || ''

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  const entries = useMemo(
    () => filterEntries({ q, subjectId, gradeId, type }),
    [q, subjectId, gradeId, type]
  )

  const subjects = getSubjects()
  const grades = getGrades()

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-wrap items-start gap-3 mb-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <BookMarked className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t('studyLibrary.title')}
            </h1>
            <p className="mt-1 text-muted-foreground max-w-2xl">{t('studyLibrary.subtitle')}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground border-l-2 border-primary/40 pl-3 py-1">
          {t('studyLibrary.techNote')}
        </p>
      </div>

      <div className="mb-8 space-y-4 rounded-xl border border-border bg-card/50 p-4 sm:p-5">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            value={q}
            onChange={(e) => setFilter('q', e.target.value)}
            placeholder={t('studyLibrary.searchPlaceholder')}
            className="ps-10"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Layers className="size-3.5" />
              {t('studyLibrary.filterSubject')}
            </label>
            <Select value={subjectId || 'all'} onValueChange={(v) => setFilter('subject', v === 'all' ? '' : v)}>
              <SelectTrigger>
                <SelectValue placeholder={t('studyLibrary.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('studyLibrary.all')}</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {lang === 'ar' ? s.labelAr : s.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <GraduationCap className="size-3.5" />
              {t('studyLibrary.filterGrade')}
            </label>
            <Select value={gradeId || 'all'} onValueChange={(v) => setFilter('grade', v === 'all' ? '' : v)}>
              <SelectTrigger>
                <SelectValue placeholder={t('studyLibrary.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('studyLibrary.all')}</SelectItem>
                {grades.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {lang === 'ar' ? g.labelAr : g.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <BookOpen className="size-3.5" />
              {t('studyLibrary.filterType')}
            </label>
            <Select value={type || 'all'} onValueChange={(v) => setFilter('type', v === 'all' ? '' : v)}>
              <SelectTrigger>
                <SelectValue placeholder={t('studyLibrary.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('studyLibrary.all')}</SelectItem>
                <SelectItem value="summary">{t('studyLibrary.typeSummary')}</SelectItem>
                <SelectItem value="pdf">{t('studyLibrary.typePdf')}</SelectItem>
                <SelectItem value="video">{t('studyLibrary.typeVideo')}</SelectItem>
                <SelectItem value="link">{t('studyLibrary.typeLink')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setSearchParams({}, { replace: true })}
            >
              {t('studyLibrary.clearFilters')}
            </Button>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {t('studyLibrary.resultsCountLabel')} <strong className="text-foreground">{entries.length}</strong>
      </p>

      {entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
          <p className="text-muted-foreground">{t('studyLibrary.empty')}</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {entries.map((entry) => {
            const Icon = TYPE_ICONS[entry.type] || BookOpen
            return (
              <li key={entry.id}>
                <Link to={`/study/${entry.id}`} className="block h-full group">
                  <Card className="h-full overflow-hidden border-border/60 transition-shadow hover:shadow-md group-hover:border-primary/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          <Icon className="size-3.5" />
                          {t(`studyLibrary.type_${entry.type}`)}
                        </span>
                        {entry.updatedAt && (
                          <span className="text-xs text-muted-foreground tabular-nums">{entry.updatedAt}</span>
                        )}
                      </div>
                      <CardTitle className="line-clamp-2 text-lg leading-snug">
                        {entryTitle(entry, lang)}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {entryDescription(entry, lang) || unitLabel(entry, lang)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 text-xs text-muted-foreground space-y-1">
                      <p>
                        <span className="font-medium text-foreground/80">{subjectLabel(entry.subjectId, lang)}</span>
                        {' · '}
                        {gradeLabel(entry.gradeId, lang)}
                      </p>
                      <p className="line-clamp-1">{unitLabel(entry, lang)}</p>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
