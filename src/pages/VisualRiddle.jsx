import { useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/LanguageContext'
import PageComments from '@/components/PageComments'

/** @typedef {'easy' | 'medium' | 'hard'} Difficulty */

/** Same pool as before — real portraits, sharp crops */
const PHOTO_POOL = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&w=800&h=1000&fit=crop&crop=faces&q=90',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&w=800&h=1000&fit=crop&crop=faces&q=90',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&w=800&h=1000&fit=crop&crop=faces&q=90',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&w=800&h=1000&fit=crop&crop=faces&q=90',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&w=800&h=1000&fit=crop&crop=faces&q=90',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&w=800&h=1000&fit=crop&crop=faces&q=90',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&w=800&h=1000&fit=crop&crop=faces&q=90',
  'https://images.unsplash.com/photo-1539579085365-838abedf2924?auto=format&w=800&h=1000&fit=crop&crop=faces&q=90',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&w=800&h=1000&fit=crop&crop=faces&q=90',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&w=800&h=1000&fit=crop&crop=faces&q=90',
]

function deltaForDifficulty(d) {
  if (d === 'easy') return 0.11 + Math.random() * 0.06
  if (d === 'medium') return 0.045 + Math.random() * 0.03
  return 0.015 + Math.random() * 0.012
}

function pickRound(difficulty) {
  const shuffled = [...PHOTO_POOL].sort(() => Math.random() - 0.5)
  const imageUrl = shuffled[0]
  const oddIndex = Math.floor(Math.random() * 3)
  const delta = deltaForDifficulty(difficulty)
  return { imageUrl, oddIndex, delta }
}

export default function VisualRiddle() {
  const { t } = useLanguage()
  const [difficulty, setDifficulty] = useState(/** @type {Difficulty} */ ('easy'))
  const [round, setRound] = useState(() => pickRound('easy'))
  const [puzzleNum, setPuzzleNum] = useState(1)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(/** @type {'idle' | 'wrong' | 'right'} */ ('idle'))

  const roll = useCallback(
    (d = difficulty) => {
      setRound(pickRound(d))
      setFeedback('idle')
    },
    [difficulty]
  )

  const resetAll = useCallback(() => {
    setRound(pickRound(difficulty))
    setScore(0)
    setPuzzleNum(1)
    setFeedback('idle')
  }, [difficulty])

  const setDifficultyAndReset = (d) => {
    setDifficulty(d)
    setRound(pickRound(d))
    setScore(0)
    setPuzzleNum(1)
    setFeedback('idle')
  }

  const onPick = useCallback(
    (i) => {
      if (i === round.oddIndex) {
        setScore((s) => s + 1)
        setPuzzleNum((n) => n + 1)
        setFeedback('right')
        setRound(pickRound(difficulty))
        window.setTimeout(() => setFeedback('idle'), 650)
      } else {
        setFeedback('wrong')
        window.setTimeout(() => setFeedback('idle'), 600)
      }
    },
    [round.oddIndex, difficulty]
  )

  const oddFilter = useMemo(() => {
    const b = 1 - round.delta
    return `brightness(${b}) saturate(${0.92 + round.delta * 0.5})`
  }, [round.delta])

  const sceneKey = `${round.imageUrl}-${round.oddIndex}-${round.delta}`

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link to="/mini-games" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          {t('miniGames.title')}
        </Link>
        <Button variant="ghost" size="sm" onClick={resetAll} className="gap-1">
          <RotateCcw className="size-4" />
          {t('games.restart')}
        </Button>
      </div>

      <div className="rounded-3xl border border-border/60 bg-gradient-to-b from-violet-50/80 via-background to-sky-50/50 p-5 shadow-lg sm:p-8">
        <h1 className="text-center text-xl font-bold tracking-tight text-foreground sm:text-2xl">{t('miniGames.visualRiddleTitle')}</h1>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">{t('miniGames.visualRiddleSubtitle')}</p>

        <p className="mt-8 text-center text-lg font-semibold text-foreground sm:text-xl">{t('miniGames.visualRiddlePhotoQ')}</p>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {(['easy', 'medium', 'hard']).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficultyAndReset(d)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all ${
                difficulty === d ? 'bg-foreground text-background' : 'bg-muted/80 text-foreground ring-1 ring-border hover:bg-muted'
              }`}
            >
              {t(`miniGames.shadeGrid${d.charAt(0).toUpperCase() + d.slice(1)}`)}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4" key={sceneKey} role="group" aria-label={t('miniGames.visualRiddleSceneAria')}>
          {[0, 1, 2].map((i) => {
            const isOdd = i === round.oddIndex
            return (
              <button
                key={i}
                type="button"
                onClick={() => onPick(i)}
                aria-label={t('miniGames.visualRiddlePickAria').replace('{n}', String(i + 1))}
                className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl border-2 border-white bg-neutral-300 shadow-lg outline-none ring-black/5 transition hover:z-10 hover:shadow-xl focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-300 group-hover:scale-[1.02] group-active:scale-[0.99]"
                  style={{
                    backgroundImage: `url(${round.imageUrl})`,
                    filter: isOdd ? oddFilter : 'none',
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span>
            {t('games.score')}: <strong className="text-foreground">{score}</strong>
          </span>
          <span>
            {t('games.round')}: <strong className="text-foreground">{puzzleNum}</strong>
          </span>
        </div>

        {feedback === 'wrong' && <p className="mt-3 text-center text-sm font-medium text-rose-600">{t('live.incorrect')}</p>}
        {feedback === 'right' && <p className="mt-3 text-center text-sm font-medium text-emerald-600">{t('live.correct')}</p>}

        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          {t('miniGames.visualRiddleFooter')}{' '}
          <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="font-medium text-primary underline-offset-2 hover:underline">
            Unsplash
          </a>
        </p>
      </div>
      <PageComments pageKey="/mini-games/visual-riddle" />
    </div>
  )
}
