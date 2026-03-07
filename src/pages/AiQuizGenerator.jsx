import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Loader2, PenSquare, CheckCircle2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getMockQuestions } from '@/data/mockAiQuestions'
import { saveQuiz } from '@/lib/quizStore'
import { useLanguage } from '@/context/LanguageContext'
import { useToast } from '@/context/ToastContext'

const DIFFICULTIES = [
  { value: 'easy', labelKey: 'difficulty.easy' },
  { value: 'medium', labelKey: 'difficulty.medium' },
  { value: 'hard', labelKey: 'difficulty.hard' },
]

export default function AiQuizGenerator() {
  const { t } = useLanguage()
  const { success } = useToast()
  const navigate = useNavigate()
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [questions, setQuestions] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = (e) => {
    e.preventDefault()
    if (!topic.trim()) return
    setLoading(true)
    setQuestions(null)
    setTimeout(() => {
      const generated = getMockQuestions(topic, difficulty, 5)
      setQuestions(generated)
      setLoading(false)
    }, 800)
  }

  const handleSave = () => {
    if (!questions?.length) return
    const quiz = {
      title: topic.trim() || 'AI Generated Quiz',
      description: `Generated from topic: ${topic}. Difficulty: ${difficulty}.`,
      difficulty,
      questions,
    }
    const saved = saveQuiz(quiz)
    success(t('createQuiz.saved'))
    navigate(`/quiz/${saved.id}/details`)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Sparkles className="size-7" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('aiGenerator.title')}</h1>
          <p className="mt-0.5 text-muted-foreground">
            {t('aiGenerator.subtitle')}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('aiGenerator.generateTitle')}</CardTitle>
          <CardDescription>{t('aiGenerator.generateDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="topic">{t('aiGenerator.topic')}</Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={t('aiGenerator.topicPlaceholder')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">{t('aiGenerator.difficulty')}</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder={t('common.selectDifficulty')} />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {t(d.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                {loading ? t('aiGenerator.generating') : t('aiGenerator.generate')}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/create-quiz" className="gap-2">
                  <PenSquare className="size-4" />
                  {t('aiGenerator.buildManually')}
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {questions && questions.length > 0 && (
        <section className="mt-10 animate-fade-in">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{t('aiGenerator.generatedTitle')}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t('aiGenerator.topicLabel')}: {topic} · {t('aiGenerator.difficultyLabel')}: {t(`difficulty.${difficulty}`)}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="gap-2">
                <Save className="size-4" />
                {t('aiGenerator.saveToMyQuizzes')}
              </Button>
              <Button variant="outline" onClick={() => navigate('/create-quiz', { state: { fromAi: true, topic, difficulty, questions } })} className="gap-2">
                <PenSquare className="size-4" />
                {t('aiGenerator.editAndSave')}
              </Button>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {questions.map((q, i) => (
              <Card key={i}>
                <CardContent className="pt-5">
                  <p className="font-medium text-foreground">{i + 1}. {q.text}</p>
                  <ul className="mt-3 space-y-2">
                    {q.options.map((opt, j) => (
                      <li
                        key={j}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                          j === q.correctIndex
                            ? 'bg-primary/15 text-primary border border-primary/30'
                            : 'bg-muted/50 text-muted-foreground'
                        }`}
                      >
                        {String.fromCharCode(65 + j)}. {opt}
                        {j === q.correctIndex && <CheckCircle2 className="size-4 shrink-0" />}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
