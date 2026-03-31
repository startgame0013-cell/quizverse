import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, ExternalLink, FileText, Link2, Printer, Download, Sparkles, Video } from 'lucide-react'
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

function openPrintWindow({ title, body, lang }) {
  const printWindow = window.open('', '_blank', 'width=980,height=760')
  if (!printWindow) return

  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const html = `<!doctype html>
  <html lang="${lang}" dir="${dir}">
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
      <style>
        body {
          margin: 0;
          padding: 40px;
          background: #fff;
          color: #111;
          font-family: Tajawal, system-ui, sans-serif;
          line-height: 1.8;
        }
        h1 {
          margin: 0 0 12px;
          font-size: 28px;
        }
        .meta {
          margin-bottom: 24px;
          color: #555;
          font-size: 14px;
        }
        .content {
          white-space: pre-wrap;
          font-size: 16px;
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="meta">QuizVerse Study Library</div>
      <div class="content">${body}</div>
      <script>
        window.onload = () => setTimeout(() => window.print(), 200)
      </script>
    </body>
  </html>`

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
}

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
  const canPreviewPdf = entry.type === 'pdf' && entry.url

  const handlePrintSummary = () => {
    if (!body) return
    openPrintWindow({ title, body, lang })
  }

  const handleOpenPdf = () => {
    if (!entry.url) return
    window.open(entry.url, '_blank', 'noopener,noreferrer')
  }

  const handlePrintPdf = () => {
    if (!entry.url) return
    const pdfWindow = window.open(entry.url, '_blank', 'noopener,noreferrer')
    if (!pdfWindow) return
    pdfWindow.onload = () => {
      try {
        pdfWindow.print()
      } catch {}
    }
  }

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
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="outline" onClick={handlePrintSummary} className="gap-2">
                <Printer className="size-4" />
                {t('studyLibrary.printOrSave')}
              </Button>
              <Button asChild className="gap-2">
                <Link to="/ai-generator">
                  <Sparkles className="size-4" />
                  {t('studyLibrary.turnIntoQuiz')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {entry.type === 'pdf' && entry.url && (
        <div className="mb-8 space-y-4">
          <Card>
            <CardContent className="pt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <FileText className="size-10 text-primary shrink-0" />
              <div className="flex-1">
                <p className="font-medium">{t('studyLibrary.openPdf')}</p>
                <p className="text-sm text-muted-foreground break-all">{entry.url}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={handleOpenPdf} className="gap-2">
                  <ExternalLink className="size-4" />
                  {t('studyLibrary.view')}
                </Button>
                <Button type="button" variant="outline" onClick={handlePrintPdf} className="gap-2">
                  <Printer className="size-4" />
                  {t('studyLibrary.printOrSave')}
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <a href={entry.url} target="_blank" rel="noopener noreferrer" download>
                    <Download className="size-4" />
                    {t('studyLibrary.download')}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {canPreviewPdf && (
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  title={title}
                  src={`${entry.url}#toolbar=1&navpanes=0&view=FitH`}
                  className="h-[75vh] w-full bg-white"
                />
              </CardContent>
            </Card>
          )}

          <Button asChild className="gap-2">
            <Link to="/ai-generator">
              <Sparkles className="size-4" />
              {t('studyLibrary.turnIntoQuiz')}
            </Link>
          </Button>
        </div>
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
