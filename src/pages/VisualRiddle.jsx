import { useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/LanguageContext'

/** @typedef {'lying' | 'rich' | 'pregnant' | 'thief' | 'sick' | 'fake'} RiddleKind */

const RIDDLE_KINDS = /** @type {const} */ ([
  'lying',
  'rich',
  'pregnant',
  'thief',
  'sick',
  'fake',
])

/** Mixed portraits — crop=faces for clarity at ~640×800 */
const ALL_PORTRAITS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&w=720&h=900&fit=crop&crop=faces&q=88',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&w=720&h=900&fit=crop&crop=faces&q=88',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&w=720&h=900&fit=crop&crop=faces&q=88',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&w=720&h=900&fit=crop&crop=faces&q=88',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&w=720&h=900&fit=crop&crop=faces&q=88',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&w=720&h=900&fit=crop&crop=faces&q=88',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&w=720&h=900&fit=crop&crop=faces&q=88',
  'https://images.unsplash.com/photo-1539579085365-838abedf2924?auto=format&w=720&h=900&fit=crop&crop=faces&q=88',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&w=720&h=900&fit=crop&crop=faces&q=88',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&w=720&h=900&fit=crop&crop=faces&q=88',
]

/** Women / maternity-friendly pool for «من الحامل؟» */
const WOMEN_PORTRAITS = [
  'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&w=720&h=900&fit=crop&q=88',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&w=720&h=900&fit=crop&crop=faces&q=88',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&w=720&h=900&fit=crop&crop=faces&q=88',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&w=720&h=900&fit=crop&crop=faces&q=88',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&w=720&h=900&fit=crop&crop=faces&q=88',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&w=720&h=900&fit=crop&crop=faces&q=88',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&w=720&h=900&fit=crop&crop=faces&q=88',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&w=720&h=900&fit=crop&crop=faces&q=88',
]

function pickThreeUnique(pool) {
  const arr = [...pool]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  if (arr.length < 3) return [arr[0], arr[1], arr[2]]
  return [arr[0], arr[1], arr[2]]
}

function pickRound() {
  const kind = RIDDLE_KINDS[Math.floor(Math.random() * RIDDLE_KINDS.length)]
  const answerIndex = Math.floor(Math.random() * 3)
  const pool = kind === 'pregnant' ? WOMEN_PORTRAITS : ALL_PORTRAITS
  const portraits = pickThreeUnique(pool)
  return { kind, answerIndex, portraits }
}

/**
 * @param {object} p
 * @param {RiddleKind | 'none'} p.clue
 */
function ClueOverlay({ clue }) {
  if (clue === 'none') return null

  if (clue === 'lying') {
    return (
      <>
        <div className="pointer-events-none absolute right-2 top-3 drop-shadow-md sm:right-4 sm:top-5">
          <svg width={44} height={56} viewBox="0 0 44 56" className="opacity-95 sm:h-16 sm:w-12" aria-hidden>
            <path
              d="M22 4 C30 18 38 28 22 52 C6 28 14 18 22 4Z"
              fill="#4FC3F7"
              stroke="#0277BD"
              strokeWidth={1.5}
            />
          </svg>
        </div>
        <div className="pointer-events-none absolute bottom-[18%] left-1/2 h-8 w-14 -translate-x-1/2 rounded-full border-2 border-dashed border-amber-600/70 bg-amber-100/30" />
      </>
    )
  }

  if (clue === 'rich') {
    return (
      <>
        <div className="pointer-events-none absolute inset-x-0 top-[22%] flex justify-center">
          <svg width={120} height={28} viewBox="0 0 120 28" className="drop-shadow-md" aria-hidden>
            <path d="M10 18 Q60 2 110 18" fill="none" stroke="#FFD54F" strokeWidth={6} strokeLinecap="round" />
            <circle cx={24} cy={16} r={5} fill="#FFD54F" stroke="#F9A825" />
            <circle cx={60} cy={10} r={5} fill="#FFD54F" stroke="#F9A825" />
            <circle cx={96} cy={16} r={5} fill="#FFD54F" stroke="#F9A825" />
          </svg>
        </div>
        <div className="pointer-events-none absolute bottom-[8%] right-[6%] flex items-end gap-1 drop-shadow-lg sm:bottom-[10%]">
          <div className="h-14 w-11 rounded-sm bg-pink-500 shadow-md ring-2 ring-pink-700/40 sm:h-16 sm:w-12" />
          <div className="mb-1 h-3 w-3 rounded-full bg-amber-300 ring-2 ring-amber-500" />
        </div>
      </>
    )
  }

  if (clue === 'pregnant') {
    return (
      <div className="pointer-events-none absolute inset-x-[12%] bottom-[12%] top-[38%]">
        <div className="absolute inset-x-0 bottom-0 top-[20%] rounded-full bg-orange-200/35 ring-2 ring-orange-400/50 shadow-inner" />
        <div className="absolute bottom-[28%] left-1/2 h-12 w-16 -translate-x-[120%] rounded-full border-2 border-orange-500/60 bg-orange-100/40 shadow-md sm:h-14 sm:w-[4.5rem]" />
      </div>
    )
  }

  if (clue === 'thief') {
    return (
      <>
        <div className="pointer-events-none absolute left-0 right-0 top-[26%] h-[14%] bg-neutral-900/82 sm:top-[27%]" />
        <div className="pointer-events-none absolute bottom-[14%] left-[10%] flex items-center gap-1 drop-shadow-md">
          <svg width={22} height={18} viewBox="0 0 22 18" className="text-amber-300" aria-hidden>
            <path
              fill="currentColor"
              d="M11 0 L14 6 L22 7 L16 12 L17 18 L11 15 L5 18 L6 12 L0 7 L8 6 Z"
            />
          </svg>
          <span className="rounded bg-neutral-900/80 px-1 text-[9px] font-bold uppercase tracking-wide text-amber-200">VIP</span>
        </div>
      </>
    )
  }

  if (clue === 'sick') {
    return (
      <>
        <div className="pointer-events-none absolute inset-0 bg-emerald-500/[0.14]" />
        <div className="pointer-events-none absolute bottom-[10%] right-[8%] drop-shadow-lg">
          <svg width={36} height={88} viewBox="0 0 36 88" className="sm:h-[5.5rem] sm:w-10" aria-hidden>
            <rect x={10} y={4} width={16} height={72} rx={4} fill="#ECEFF1" stroke="#90A4AE" strokeWidth={2} />
            <rect x={12} y={36} width={12} height={32} rx={2} fill="#E53935" />
            <circle cx={18} cy={82} r={10} fill="#E53935" stroke="#B71C1C" strokeWidth={2} />
          </svg>
        </div>
      </>
    )
  }

  if (clue === 'fake') {
    return (
      <>
        <div className="pointer-events-none absolute left-[8%] top-[20%] h-[38%] w-[84%] rounded-2xl border-2 border-dashed border-violet-600/80 bg-violet-500/10" />
        <div className="pointer-events-none absolute right-[6%] top-[48%] rotate-6 rounded-md bg-violet-700 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md sm:text-xs">
          DEMO
        </div>
        <div className="pointer-events-none absolute left-[10%] top-[30%] rounded-lg border border-violet-600/60 bg-white/90 px-1 py-0.5 text-[9px] font-bold text-violet-800 shadow sm:text-[10px]">
          CPU
        </div>
      </>
    )
  }

  return null
}

/**
 * @param {object} p
 * @param {string} p.src
 * @param {RiddleKind | 'none'} p.clue
 * @param {() => void} p.onPick
 * @param {string} p.ariaLabel
 */
function PhotoPanel({ src, clue, onPick, ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onPick}
      aria-label={ariaLabel}
      className="group relative aspect-[3/4] w-full max-w-none overflow-hidden rounded-2xl border-2 border-white bg-neutral-200 shadow-lg outline-none ring-black/5 transition hover:z-10 hover:shadow-xl focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <img
        src={src}
        alt=""
        width={720}
        height={900}
        className="h-full w-full object-cover object-center transition duration-500 ease-out group-hover:scale-[1.03] group-active:scale-[0.99]"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
      <ClueOverlay clue={clue} />
    </button>
  )
}

function PhotoScene({ portraits, clues, onPick, labels }) {
  return (
    <div
      className="rounded-2xl bg-gradient-to-b from-sky-100/90 to-emerald-100/50 p-2 sm:p-4"
      role="group"
      aria-label={labels.scene}
    >
      <div className="mx-auto grid max-w-4xl grid-cols-3 gap-2 sm:gap-4">
        {[0, 1, 2].map((i) => (
          <PhotoPanel
            key={`${i}-${portraits[i]}`}
            src={portraits[i]}
            clue={clues[i]}
            onPick={() => onPick(i)}
            ariaLabel={labels.pick(i)}
          />
        ))}
      </div>
    </div>
  )
}

export default function VisualRiddle() {
  const { t } = useLanguage()
  const [puzzle, setPuzzle] = useState(() => pickRound())
  const [puzzleNum, setPuzzleNum] = useState(1)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(/** @type {'idle' | 'wrong' | 'right'} */ ('idle'))

  const clues = useMemo(
    () => [0, 1, 2].map((i) => (i === puzzle.answerIndex ? puzzle.kind : 'none')),
    [puzzle.answerIndex, puzzle.kind]
  )

  const resetAll = useCallback(() => {
    setPuzzle(pickRound())
    setScore(0)
    setPuzzleNum(1)
    setFeedback('idle')
  }, [])

  const onPick = useCallback(
    (i) => {
      if (i === puzzle.answerIndex) {
        setScore((s) => s + 1)
        setPuzzleNum((n) => n + 1)
        setFeedback('right')
        setPuzzle(pickRound())
        window.setTimeout(() => setFeedback('idle'), 700)
      } else {
        setFeedback('wrong')
        window.setTimeout(() => setFeedback('idle'), 650)
      }
    },
    [puzzle.answerIndex]
  )

  const qKey = `miniGames.visualRiddleQ_${puzzle.kind}`
  const labels = useMemo(
    () => ({
      scene: t('miniGames.visualRiddleSceneAria'),
      pick: (i) => t('miniGames.visualRiddlePickAria').replace('{n}', String(i + 1)),
    }),
    [t]
  )

  const sceneKey = `${puzzle.kind}-${puzzle.answerIndex}-${puzzle.portraits.join('|')}`

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

      <div className="rounded-3xl border border-border/60 bg-gradient-to-b from-sky-50/90 via-background to-amber-50/40 p-5 shadow-lg sm:p-8">
        <h1 className="text-center text-xl font-bold tracking-tight text-foreground sm:text-2xl">{t('miniGames.visualRiddleTitle')}</h1>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">{t('miniGames.visualRiddleSubtitle')}</p>

        <p className="mt-8 text-center text-lg font-semibold text-foreground sm:text-xl">{t(qKey)}</p>
        <p className="mt-2 text-center text-xs text-muted-foreground sm:text-sm">{t('miniGames.visualRiddleTapHint')}</p>

        <div className="mx-auto mt-5 max-w-4xl overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-md" key={sceneKey}>
          <PhotoScene portraits={puzzle.portraits} clues={clues} onPick={onPick} labels={labels} />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span>
            {t('games.score')}: <strong className="text-foreground">{score}</strong>
          </span>
          <span>
            {t('games.round')}: <strong className="text-foreground">{puzzleNum}</strong>
          </span>
        </div>

        {feedback === 'wrong' && (
          <p className="mt-3 text-center text-sm font-medium text-rose-600">{t('live.incorrect')}</p>
        )}
        {feedback === 'right' && (
          <p className="mt-3 text-center text-sm font-medium text-emerald-600">{t('live.correct')}</p>
        )}

        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          {t('miniGames.visualRiddleFooter')}{' '}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Unsplash
          </a>
        </p>
      </div>
    </div>
  )
}
