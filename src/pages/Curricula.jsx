import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Play, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllQuizzes, getQuizDisplay, saveQuiz } from '@/lib/quizStore'
import { useLanguage } from '@/context/LanguageContext'
import { KUWAIT_ELEMENTARY_2026_QUIZZES } from '@/data/kuwaitElementary2026'

/** نعرض المناهج مباشرة من الملف — القائمة تظهر دائماً. عند اللعب نضيف الكويز للمخزن إذا لم يكن موجوداً. */
function ensureQuizId(quizFromFile) {
  if (!quizFromFile) return null
  const existing = getAllQuizzes().find(
    (q) => (q.title === quizFromFile.title && q.titleAr === quizFromFile.titleAr)
  )
  if (existing?.id) return existing.id
  const saved = saveQuiz({ ...quizFromFile })
  return saved?.id || null
}

export default function Curricula() {
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const list = Array.isArray(KUWAIT_ELEMENTARY_2026_QUIZZES) ? KUWAIT_ELEMENTARY_2026_QUIZZES : []

  const handlePlay = (quiz) => {
    const id = ensureQuizId(quiz)
    if (id) navigate(`/quiz/${id}`)
  }

  const handleDetails = (quiz) => {
    const id = ensureQuizId(quiz)
    if (id) navigate(`/quiz/${id}/details`)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t('curricula.titleKuwait2026')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t('curricula.subtitleKuwait2026')}
        </p>
      </div>

      {/* قائمة المناهج من الملف — تظهر دائماً */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <GraduationCap className="size-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {t('curricula.kuwaitSection')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('curricula.kuwaitSectionDesc2026')}
            </p>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center text-muted-foreground">
            <p>{t('curricula.emptyKuwait2026')}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {list.map((quiz, index) => {
              const d = getQuizDisplay(quiz, lang)
              const count = (quiz.questions || []).length
              const key = quiz.title || quiz.titleAr || `kw-2026-${index}`
              return (
                <Card key={key} className="overflow-hidden border-border/60 transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2 text-lg">{d.title || quiz.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{d.description || quiz.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap items-center justify-between gap-2 pt-0">
                    <span className="text-xs text-muted-foreground">
                      {count} {t('curricula.questions')}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => handleDetails(quiz)}
                      >
                        <FileText className="size-4" />
                        {t('curricula.details')}
                      </Button>
                      <Button size="sm" className="gap-1.5" onClick={() => handlePlay(quiz)}>
                        <Play className="size-4" />
                        {t('curricula.play')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
