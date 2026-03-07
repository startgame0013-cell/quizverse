import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, PenSquare, Play, Copy, Radio, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getQuizById, duplicateQuiz, deleteQuiz } from '@/lib/quizStore'
import { useLanguage } from '@/context/LanguageContext'
import { useToast } from '@/context/ToastContext'

export default function QuizDetails() {
  const { t } = useLanguage()
  const { success } = useToast()
  const { id } = useParams()
  const navigate = useNavigate()
  const quiz = getQuizById(id)

  if (!quiz) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">{t('playQuiz.notFound')}</p>
        <Button asChild className="mt-4">
          <Link to="/my-quizzes">{t('playQuiz.backToQuizzes')}</Link>
        </Button>
      </div>
    )
  }

  const handleDuplicate = () => {
    const copy = duplicateQuiz(id)
    if (copy) {
      success(t('createQuiz.saved'))
      navigate(`/quiz/${copy.id}/details`)
    }
  }

  const handleHost = () => {
    navigate(`/waiting?pin=123456`)
  }

  const questions = quiz.questions || []

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/my-quizzes"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-4" />
        {t('playQuiz.backToQuizzes')}
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{quiz.title || t('myQuizzes.untitled')}</h1>
        {quiz.description && (
          <p className="mt-2 text-muted-foreground">{quiz.description}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary">{t(`difficulty.${quiz.difficulty || 'medium'}`)}</Badge>
          {quiz.category && <Badge variant="outline">{t(`category.${quiz.category}`) || quiz.category}</Badge>}
          {quiz.audience && <Badge variant="outline">{t(`audience.${quiz.audience}`) || quiz.audience}</Badge>}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <Button asChild className="gap-2">
          <Link to={`/create-quiz?edit=${id}`}>
            <PenSquare className="size-4" />
            {t('quizDetails.editQuiz')}
          </Link>
        </Button>
        <Button variant="outline" className="gap-2" asChild>
          <Link to={`/quiz/${id}`}>
            <Play className="size-4" />
            {t('quizDetails.play')}
          </Link>
        </Button>
        <Button variant="outline" className="gap-2" onClick={handleHost}>
          <Radio className="size-4" />
          {t('quizDetails.hostLive')}
        </Button>
        <Button variant="outline" className="gap-2" onClick={handleDuplicate}>
          <Copy className="size-4" />
          {t('quizDetails.duplicate')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {questions.length} {t('quizDetails.questionCount')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((q, i) => (
            <div key={q.id || i} className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="font-medium text-foreground">{i + 1}. {q.text || t('createQuiz.noQuestion')}</p>
              <ul className="mt-3 space-y-2">
                {q.options?.map((opt, j) => (
                  <li
                    key={j}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                      j === q.correctIndex ? 'bg-primary/15 text-primary border border-primary/30' : 'text-muted-foreground'
                    }`}
                  >
                    {opt || t('createQuiz.empty')}
                    {j === q.correctIndex && <CheckCircle2 className="size-4 shrink-0" />}
                  </li>
                ))}
              </ul>
              {q.explanation && (
                <p className="mt-2 text-xs text-muted-foreground italic">{q.explanation}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
