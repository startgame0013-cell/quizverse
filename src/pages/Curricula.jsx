import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Play, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllQuizzes, getQuizDisplay, seedDemoQuizzesIfNeeded } from '@/lib/quizStore'
import { useLanguage } from '@/context/LanguageContext'

/** مناهج دولة الكويت ٢٠٢٦ فقط — لا نعرض مناهج قديمة */
function isKuwait2026Only(quiz) {
  if (!quiz || typeof quiz !== 'object') return false
  const t = (quiz.title || '') + (quiz.titleAr || '')
  return /2026|٢٠٢٦/.test(t)
}

function safeGetQuizzes() {
  try {
    if (typeof getAllQuizzes !== 'function') return []
    const q = getAllQuizzes()
    return Array.isArray(q) ? q : []
  } catch {
    return []
  }
}

export default function Curricula() {
  const { t, lang } = useLanguage()
  const [tick, setTick] = useState(0)
  const quizzes = useMemo(() => safeGetQuizzes(), [tick])

  useEffect(() => {
    if (quizzes.length === 0 && typeof seedDemoQuizzesIfNeeded === 'function') {
      seedDemoQuizzesIfNeeded()
        .then(() => setTick((c) => c + 1))
        .catch(() => setTick((c) => c + 1))
    }
  }, [quizzes.length])

  const kuwait2026Quizzes = useMemo(() => {
    const list = Array.isArray(quizzes) ? quizzes : []
    return list.filter((q) => q && q.id && isKuwait2026Only(q))
  }, [quizzes])

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

      {/* مناهج دولة الكويت ٢٠٢٦ فقط */}
      {kuwait2026Quizzes.length > 0 && (
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
          <div className="grid gap-4 sm:grid-cols-2">
            {kuwait2026Quizzes.map((quiz) => {
              const d = getQuizDisplay(quiz, lang)
              const count = (quiz.questions || []).length
              return (
                <Card key={quiz.id} className="overflow-hidden border-border/60 transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2 text-lg">{d.title || quiz.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{d.description || quiz.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap items-center justify-between gap-2 pt-0">
                    <span className="text-xs text-muted-foreground">
                      {count} {t('curricula.questions')}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/quiz/${quiz.id}/details`} className="gap-1.5">
                          <FileText className="size-4" />
                          {t('curricula.details')}
                        </Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link to={`/quiz/${quiz.id}`} className="gap-1.5">
                          <Play className="size-4" />
                          {t('curricula.play')}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {kuwait2026Quizzes.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center text-muted-foreground">
          <p>{t('curricula.emptyKuwait2026')}</p>
          <Button asChild className="mt-4">
            <Link to="/create-quiz">{t('nav.createQuiz')}</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
