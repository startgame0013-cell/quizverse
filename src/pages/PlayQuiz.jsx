import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, Clock, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getQuestionDisplay, getQuizDisplay, quizContentLang } from '@/lib/quizStore'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useQuiz } from '@/hooks/useQuiz'
import API from '@/lib/api.js'

const SKIPPED = -1

function formatMmSs(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, '0')}`
}

function formatCertificateDate(lang) {
  const locale = lang === 'ar' ? 'ar-KW' : 'en-US'
  return new Date().toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function PlayQuiz() {
  const { t, lang } = useLanguage()
  const { user } = useAuth()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const classIdFromQuery = searchParams.get('classId')?.trim() || ''
  const { quiz, loading: quizLoading, error: quizError } = useQuiz(id)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)
  const [elapsedSec, setElapsedSec] = useState(0)
  const [gReward, setGReward] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const questionTimerRef = useRef(null)
  const qStartedRef = useRef(Date.now())
  const timesMsRef = useRef({})
  const currentIndexRef = useRef(0)
  const sessionKeyRef = useRef(
    typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `solo_${Date.now()}_${Math.random()}`
  )

  currentIndexRef.current = currentIndex

  useEffect(() => {
    setCurrentIndex(0)
    setAnswers({})
    setFinished(false)
    setElapsedSec(0)
    setGReward(null)
    timesMsRef.current = {}
    sessionKeyRef.current =
      typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `solo_${Date.now()}_${Math.random()}`
  }, [id, quiz?.id])

  const bumpQuestionMs = (idx) => {
    if (timesMsRef.current[idx] != null) return
    timesMsRef.current[idx] = Math.min(900000, Date.now() - qStartedRef.current)
  }

  useEffect(() => {
    if (finished) return
    const idTick = setInterval(() => setElapsedSec((x) => x + 1), 1000)
    return () => clearInterval(idTick)
  }, [finished])

  const questions = quiz?.questions || []
  const current = questions[currentIndex]

  useEffect(() => {
    qStartedRef.current = Date.now()
  }, [currentIndex])

  useEffect(() => {
    if (finished || !current) return
    const limit = Math.max(5, Number(current.timeLimit) || 30)
    setTimeLeft(limit)
    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current)
      questionTimerRef.current = null
    }
    questionTimerRef.current = setInterval(() => {
      setTimeLeft((left) => {
        if (left <= 1) {
          if (questionTimerRef.current) {
            clearInterval(questionTimerRef.current)
            questionTimerRef.current = null
          }
          setAnswers((prev) => {
            const idx = currentIndexRef.current
            if (prev[idx] !== undefined) return prev
            bumpQuestionMs(idx)
            return { ...prev, [idx]: SKIPPED }
          })
          return 0
        }
        return left - 1
      })
    }, 1000)
    return () => {
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current)
        questionTimerRef.current = null
      }
    }
  }, [currentIndex, finished, current])

  const score = useMemo(
    () =>
      Object.entries(answers).reduce(
        (acc, [idx, choice]) =>
          questions[Number(idx)]?.correctIndex === choice ? acc + 1 : acc,
        0
      ),
    [answers, questions]
  )

  const pct =
    questions.length > 0 ? Math.round((score / questions.length) * 100) : 0

  const gradeKey =
    pct >= 90
      ? 'gradeExcellent'
      : pct >= 70
        ? 'gradeGood'
        : pct >= 50
          ? 'gradeFair'
          : 'gradeNeedsWork'

  useEffect(() => {
    if (!finished || !quiz || !id) return
    if (!API || user?.demo) return
    let token
    try {
      token = localStorage.getItem('quizverse_token')
    } catch {
      return
    }
    if (!token || !user?.id) return

    const title = getQuizDisplay(quiz, quizContentLang(quiz)).title || ''
    const responses = questions.map((q, i) => ({
      questionIndex: i,
      questionId: q.id || `q${i}`,
      answerIndex: answers[i] ?? -1,
      correct: q.correctIndex === answers[i],
      timeMs: timesMsRef.current[i] ?? 0,
    }))

    fetch(`${API}/api/reports/solo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        quizId: id,
        quizTitle: title,
        sessionKey: sessionKeyRef.current,
        score,
        total: questions.length,
        timeSpentSec: elapsedSec,
        responses,
        ...(classIdFromQuery ? { classId: classIdFromQuery } : {}),
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.gamification) setGReward(d.gamification)
      })
      .catch(() => {})
  }, [finished, quiz, id, user, score, answers, questions, elapsedSec, lang, classIdFromQuery])

  if (quizLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground">
        <p>{t('playQuiz.loadingQuiz')}</p>
      </div>
    )
  }

  if (quizError === 'noApi' || !quiz) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">
          {quizError === 'noApi' ? t('playQuiz.cloudNeedsApi') : t('playQuiz.notFound')}
        </p>
        <Button asChild className="mt-4">
          <Link to="/my-quizzes">{t('playQuiz.backToQuizzes')}</Link>
        </Button>
      </div>
    )
  }

  const contentLang = quizContentLang(quiz)
  const display = getQuestionDisplay(current, contentLang)
  const rawSelected = answers[currentIndex]
  const selected = rawSelected === undefined ? null : rawSelected
  const isFirst = currentIndex === 0
  const isLast = currentIndex === questions.length - 1

  const handleAnswer = (index) => {
    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current)
      questionTimerRef.current = null
    }
    bumpQuestionMs(currentIndex)
    setAnswers((prev) => ({ ...prev, [currentIndex]: index }))
  }

  const handleNext = () => {
    if (isLast) {
      setFinished(true)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirst) setCurrentIndex((i) => i - 1)
  }

  const handleDownloadCertificate = () => {
    if (!quiz || pct < 60) return

    const learnerName =
      user?.displayName?.trim() ||
      user?.name?.trim() ||
      user?.email?.trim() ||
      t('playQuiz.certificateDefaultName')
    const quizTitle = getQuizDisplay(quiz, contentLang).title || 'QuizVerse'
    const completedDate = formatCertificateDate(lang)
    const printWindow = window.open('', '_blank', 'width=1024,height=768')
    if (!printWindow) return

    const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t('playQuiz.certificateTitle')}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0a0a0a;
      --panel: #111111;
      --gold: #facc15;
      --gold-soft: rgba(250, 204, 21, 0.18);
      --text: #f8fafc;
      --muted: #cbd5e1;
      --border: rgba(250, 204, 21, 0.3);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Tajawal", system-ui, sans-serif;
      background:
        radial-gradient(circle at top, rgba(250, 204, 21, 0.12), transparent 35%),
        linear-gradient(180deg, #050505 0%, #0a0a0a 100%);
      color: var(--text);
      direction: rtl;
    }
    .page {
      width: 1123px;
      min-height: 794px;
      margin: 0 auto;
      padding: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .certificate {
      width: 100%;
      border: 2px solid var(--border);
      border-radius: 28px;
      background: linear-gradient(180deg, rgba(17,17,17,0.96), rgba(10,10,10,0.98));
      box-shadow:
        0 0 0 1px rgba(250,204,21,0.08) inset,
        0 30px 80px rgba(0,0,0,0.45);
      padding: 56px 52px;
      position: relative;
      overflow: hidden;
    }
    .certificate::before,
    .certificate::after {
      content: "";
      position: absolute;
      width: 280px;
      height: 280px;
      border-radius: 999px;
      background: radial-gradient(circle, rgba(250,204,21,0.12), transparent 70%);
      pointer-events: none;
    }
    .certificate::before { top: -120px; right: -90px; }
    .certificate::after { bottom: -140px; left: -100px; }
    .brand {
      text-align: center;
      color: var(--gold);
      font-weight: 800;
      font-size: 44px;
      margin-bottom: 10px;
    }
    .eyebrow {
      text-align: center;
      color: var(--gold);
      font-size: 15px;
      letter-spacing: 0.18em;
      margin-bottom: 28px;
    }
    .title {
      text-align: center;
      font-size: 38px;
      font-weight: 800;
      margin: 0 0 10px;
    }
    .subtitle {
      text-align: center;
      color: var(--muted);
      font-size: 18px;
      margin: 0 0 34px;
    }
    .student {
      text-align: center;
      margin: 18px 0 34px;
    }
    .student .label {
      color: var(--muted);
      font-size: 16px;
      margin-bottom: 10px;
    }
    .student .name {
      color: var(--gold);
      font-size: 42px;
      font-weight: 800;
      line-height: 1.2;
    }
    .quiz-title {
      text-align: center;
      background: var(--gold-soft);
      border: 1px solid rgba(250, 204, 21, 0.22);
      border-radius: 20px;
      padding: 18px 20px;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 30px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      margin-bottom: 28px;
    }
    .stat {
      border: 1px solid rgba(250,204,21,0.18);
      background: rgba(255,255,255,0.02);
      border-radius: 18px;
      padding: 18px;
      text-align: center;
    }
    .stat .label {
      color: var(--muted);
      font-size: 15px;
      margin-bottom: 8px;
    }
    .stat .value {
      font-size: 28px;
      font-weight: 800;
      color: var(--gold);
    }
    .footer {
      text-align: center;
      color: var(--muted);
      font-size: 16px;
      margin-top: 16px;
    }
    .print-note {
      text-align: center;
      color: var(--muted);
      font-size: 13px;
      margin-top: 24px;
    }
    @page {
      size: A4 landscape;
      margin: 0;
    }
    @media print {
      body { background: #0a0a0a; }
      .page {
        width: 100%;
        min-height: 100vh;
        padding: 20px;
      }
      .print-note { display: none; }
    }
  </style>
</head>
<body>
  <div class="page">
    <section class="certificate">
      <div class="brand">QuizVerse</div>
      <div class="eyebrow">${t('playQuiz.certificateEyebrow')}</div>
      <h1 class="title">${t('playQuiz.certificateTitle')}</h1>
      <p class="subtitle">${t('playQuiz.certificateSubtitle')}</p>

      <div class="student">
        <div class="label">${t('playQuiz.certificateAwardedTo')}</div>
        <div class="name">${learnerName}</div>
      </div>

      <div class="quiz-title">${quizTitle}</div>

      <div class="grid">
        <div class="stat">
          <div class="label">${t('playQuiz.certificateScore')}</div>
          <div class="value">${pct}%</div>
        </div>
        <div class="stat">
          <div class="label">${t('playQuiz.certificateResult')}</div>
          <div class="value">${score} / ${questions.length}</div>
        </div>
        <div class="stat">
          <div class="label">${t('playQuiz.certificateDate')}</div>
          <div class="value" style="font-size:20px">${completedDate}</div>
        </div>
      </div>

      <div class="footer">${t('playQuiz.certificateFooter')}</div>
      <div class="print-note">${t('playQuiz.certificatePrintHint')}</div>
    </section>
  </div>
  <script>
    window.onload = () => {
      setTimeout(() => window.print(), 250)
    }
    window.onafterprint = () => window.close()
  </script>
</body>
</html>`

    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
  }

  const showResult = selected !== null

  if (finished) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <CheckCircle className="size-6" />
              {t('playQuiz.quizComplete')}
            </CardTitle>
            <p className="text-lg font-semibold text-foreground">{t(`playQuiz.${gradeKey}`)}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
              <p className="text-sm text-muted-foreground">{t('playQuiz.yourResult')}</p>
              <p className="text-3xl font-bold text-foreground">
                {pct}% — {score} / {questions.length} {t('playQuiz.correct')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('playQuiz.correctAnswers')}: {score} · {t('playQuiz.timeTaken')}:{' '}
                {formatMmSs(elapsedSec)}
              </p>
              {gReward && !user?.demo && (
                <div className="mt-3 rounded-lg border border-primary/25 bg-primary/10 px-3 py-2 text-sm">
                  <p className="font-semibold text-primary">
                    +{gReward.xpEarned} {t('playQuiz.xpLabel')} · {t('playQuiz.levelShort')} {gReward.level}
                  </p>
                  <p className="text-muted-foreground mt-1">
                    {t('playQuiz.streakLabel')}: {gReward.streak} · {t('playQuiz.totalXp')}: {gReward.xp}
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button asChild>
                <Link to="/my-quizzes">{t('playQuiz.myQuizzes')}</Link>
              </Button>
              {pct >= 60 && (
                <Button variant="outline" onClick={handleDownloadCertificate}>
                  {t('playQuiz.downloadCertificate')}
                </Button>
              )}
              <Button variant="outline" onClick={() => window.location.reload()}>
                {t('playQuiz.playAgain')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const timerPct =
    current && (Number(current.timeLimit) || 30) > 0
      ? Math.min(100, (timeLeft / Math.max(5, Number(current.timeLimit) || 30)) * 100)
      : 100

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <Link
          to="/my-quizzes"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {t('playQuiz.backToQuizzes')}
        </Link>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Clock className="size-4 shrink-0" />
            {t('playQuiz.totalTime')} {formatMmSs(elapsedSec)}
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
            <Timer className="size-4 shrink-0 text-primary" />
            {t('playQuiz.scoreSoFar')}: {score} / {questions.length}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2 space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">
              {getQuizDisplay(quiz, contentLang).title || ''}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t('playQuiz.questionOf')} {currentIndex + 1} {t('playQuiz.of')} {questions.length}
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>{t('playQuiz.timeLeft')}</span>
              <span className="font-mono tabular-nums text-foreground">{formatMmSs(timeLeft)}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-linear"
                style={{ width: `${timerPct}%` }}
              />
            </div>
            {selected === SKIPPED && (
              <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">{t('playQuiz.timeUp')}</p>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg font-medium text-foreground">{display.text}</p>
          <div className="space-y-2">
            {display.options.map((opt, i) => {
              const isCorrect = i === current.correctIndex
              const isWrongPick = selected === i && !isCorrect
              const showFeedback = showResult
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAnswer(i)}
                  disabled={showFeedback}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors disabled:cursor-default ${
                    !showFeedback
                      ? 'border-input bg-background hover:border-primary/30'
                      : isCorrect
                        ? 'border-primary bg-primary/15 text-primary'
                        : isWrongPick
                          ? 'border-destructive bg-destructive/10 text-destructive'
                          : 'border-input bg-muted/30 text-muted-foreground'
                  }`}
                >
                  {opt}
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between gap-4 pt-6 border-t border-border mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirst}
              className="gap-2 min-w-[120px]"
            >
              <ChevronLeft className="size-5" />
              {t('playQuiz.previous')}
            </Button>
            <span className="text-sm text-muted-foreground shrink-0">
              {currentIndex + 1} / {questions.length}
            </span>
            <Button
              type="button"
              onClick={handleNext}
              disabled={!showResult}
              className="gap-2 min-w-[120px]"
            >
              {isLast ? t('playQuiz.seeResults') : t('playQuiz.next')}
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
