import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, ExternalLink, FileText, Link2, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/context/LanguageContext'
import {
  getEntryById,
  subjectLabel,
  gradeLabel,
  unitLabel,
  entryTitle,
  entryDescription,
  entryBody,
  isYoutubeUrl,
  youtubeEmbedUrl,
} from '@/lib/studyLibrary'

export default function StudyLibraryEntry() {
  const { id } = useParams()
  const { t, lang } = useLanguage()
  const entry = getEntryById(id)

  if (!entry) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">{t('studyLibrary.notFound')}</p>
        <Button asChild className="mt-4">
          <Link to="/study">{t('studyLibrary.backToLibrary')}</Link>
        </Button>
      </div>
    )
  }

  const title = entryTitle(entry, lang)
  const desc = entryDescription(entry, lang)
  const body = entryBody(entry, lang)
  const embed = entry.url && isYoutubeUrl(entry.url) ? youtubeEmbedUrl(entry.url) : ''

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/study"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-4" />
        {t('studyLibrary.backToLibrary')}
      </Link>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-1">
          {subjectLabel(entry.subjectId, lang)} · {gradeLabel(entry.gradeId, lang)}
        </p>
        <p className="text-sm text-muted-foreground mb-3">{unitLabel(entry, lang)}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>
        {desc && <p className="mt-3 text-muted-foreground">{desc}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
            {t(`studyLibrary.type_${entry.type}`)}
          </span>
          {entry.updatedAt && (
            <span className="text-xs text-muted-foreground tabular-nums py-1">{entry.updatedAt}</span>
          )}
          {(entry.tags || []).map((tag) => (
            <span key={tag} className="text-xs text-muted-foreground border border-border rounded px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {entry.type === 'summary' && body && (
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              {t('studyLibrary.readSummary')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-none whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {body}
            </div>
          </CardContent>
        </Card>
      )}

      {entry.type === 'pdf' && entry.url && (
        <Card className="mb-8">
          <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <FileText className="size-10 text-primary shrink-0" />
            <div className="flex-1">
              <p className="font-medium">{t('studyLibrary.openPdf')}</p>
              <p className="text-sm text-muted-foreground break-all">{entry.url}</p>
            </div>
            <Button asChild>
              <a href={entry.url} target="_blank" rel="noopener noreferrer" className="gap-2">
                {t('studyLibrary.openInNewTab')}
                <ExternalLink className="size-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {entry.type === 'video' && entry.url && (
        <div className="mb-8 space-y-4">
          {embed ? (
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-black">
              <iframe
                title={title}
                src={embed}
                className="size-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <Video className="size-10 text-primary shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">{t('studyLibrary.openVideo')}</p>
                  <p className="text-sm text-muted-foreground break-all">{entry.url}</p>
                </div>
                <Button asChild>
                  <a href={entry.url} target="_blank" rel="noopener noreferrer" className="gap-2">
                    {t('studyLibrary.openInNewTab')}
                    <ExternalLink className="size-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {entry.type === 'link' && entry.url && (
        <Card className="mb-8">
          <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <Link2 className="size-10 text-primary shrink-0" />
            <div className="flex-1">
              <p className="font-medium">{t('studyLibrary.externalResource')}</p>
              <p className="text-sm text-muted-foreground break-all">{entry.url}</p>
            </div>
            <Button asChild>
              <a href={entry.url} target="_blank" rel="noopener noreferrer" className="gap-2">
                {t('studyLibrary.openInNewTab')}
                <ExternalLink className="size-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link to="/study">{t('studyLibrary.backToLibrary')}</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/curricula">{t('studyLibrary.gotoCurricula')}</Link>
        </Button>
      </div>
    </div>
  )
}
