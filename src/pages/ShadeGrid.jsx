import { useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/LanguageContext'

/** @typedef {'easy' | 'medium' | 'hard'} Difficulty */

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

function randomPastelBase() {
  const h = Math.floor(Math.random() * 360)
  const s = 38 + Math.random() * 18
  const l = 76 + Math.random() * 10
  return { h, s, l }
}

function deltaForDifficulty(d) {
  if (d === 'easy') return 11 + Math.random() * 9
  if (d === 'medium') return 5 + Math.random() * 4
  return 1.8 + Math.random() * 1.4
}

function gridSizeForDifficulty(d) {
  if (d === 'easy') return 3
  if (d === 'medium') return 4
  return 5
}

export default function ShadeGrid() {
  const { t } = useLanguage()
  const [difficulty, setDifficulty] = useState(/** @type {Difficulty} */ ('easy'))
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [wrongFlash, setWrongFlash] = useState(null)

  const [base, setBase] = useState(() => randomPastelBase())
  const [oddIndex, setOddIndex] = useState(() => Math.floor(Math.random() * 9))
  const [delta, setDelta] = useState(() => deltaForDifficulty('easy'))
  const [darker, setDarker] = useState(() => Math.random() > 0.5)

  const n = useMemo(() => gridSizeForDifficulty(difficulty), [difficulty])

  const newRound = useCallback(
    (d = difficulty) => {
      const size = gridSizeForDifficulty(d)
      const cells = size * size
      setBase(randomPastelBase())
      setOddIndex(Math.floor(Math.random() * cells))
      setDelta(deltaForDifficulty(d))
      setDarker(Math.random() > 0.5)
      setRound((r) => r + 1)
    },
    [difficulty]
  )

  const resetGame = useCallback(() => {
    setScore(0)
    setRound(1)
    setBase(randomPastelBase())
    const size = gridSizeForDifficulty(difficulty)
    setOddIndex(Math.floor(Math.random() * (size * size)))
    setDelta(deltaForDifficulty(difficulty))
    setDarker(Math.random() > 0.5)
  }, [difficulty])

  const handleDifficulty = (d) => {
    setDifficulty(d)
    setScore(0)
    setRound(1)
    const size = gridSizeForDifficulty(d)
    setBase(randomPastelBase())
    setOddIndex(Math.floor(Math.random() * (size * size)))
    setDelta(deltaForDifficulty(d))
    setDarker(Math.random() > 0.5)
  }

  const baseColor = `hsl(${base.h}, ${base.s}%, ${base.l}%)`
  const oddLight = clamp(darker ? base.l - delta : base.l + delta, 12, 94)
  const oddColor = `hsl(${base.h}, ${base.s}%, ${oddLight}%)`

  const onCellClick = (index) => {
    if (index === oddIndex) {
      setScore((s) => s + 1)
      newRound()
    } else {
      setWrongFlash(index)
      setTimeout(() => setWrongFlash(null), 220)
    }
  }

  const cells = n * n

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-8">
      <div
        className="w-full max-w-[min(100%,22rem)] rounded-[2rem] border border-white/60 bg-white/40 p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] backdrop-blur-md sm:p-8"
        style={{
          background:
            'linear-gradient(165deg, rgba(253, 244, 255, 0.95) 0%, rgba(240, 253, 250, 0.92) 42%, rgba(254, 252, 232, 0.9) 100%)',
        }}
      >
        <div className="mb-5 flex items-center justify-between gap-2">
          <Link
            to="/mini-games"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 transition-colors hover:text-stone-800"
          >
            <ArrowLeft className="size-3.5" />
            {t('miniGames.title')}
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-1 text-stone-600 hover:bg-white/60"
            onClick={resetGame}
          >
            <RotateCcw className="size-3.5" />
            {t('games.restart')}
          </Button>
        </div>

        <h1 className="text-center text-lg font-semibold tracking-tight text-stone-800 sm:text-xl">
          {t('miniGames.shadeGridTitle')}
        </h1>
        <p className="mt-1.5 text-center text-xs leading-relaxed text-stone-500 sm:text-sm">
          {t('miniGames.shadeGridHint')}
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {(['easy', 'medium', 'hard']).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => handleDifficulty(d)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all ${
                difficulty === d
                  ? 'bg-stone-800 text-white shadow-md'
                  : 'bg-white/80 text-stone-600 ring-1 ring-stone-200/80 hover:bg-white'
              }`}
            >
              {t(`miniGames.shadeGrid${d.charAt(0).toUpperCase() + d.slice(1)}`)}
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-6 text-xs text-stone-600">
          <span>
            {t('games.score')}: <strong className="text-stone-900">{score}</strong>
          </span>
          <span>
            {t('games.round')}: <strong className="text-stone-900">{round}</strong>
          </span>
        </div>

        <div
          className="mx-auto mt-6 grid w-full max-w-[16.5rem] gap-2 sm:max-w-[18rem]"
          style={{
            gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: cells }, (_, i) => {
            const isOdd = i === oddIndex
            const bg = isOdd ? oddColor : baseColor
            const isWrong = wrongFlash === i
            return (
              <button
                key={`${round}-${i}`}
                type="button"
                aria-label={isOdd ? t('miniGames.shadeGridOddAria') : t('miniGames.shadeGridCellAria')}
                onClick={() => onCellClick(i)}
                className={`aspect-square rounded-2xl border-0 shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-transform duration-150 active:scale-[0.97] ${
                  isWrong ? 'ring-2 ring-rose-300/90 ring-offset-2 ring-offset-transparent' : ''
                }`}
                style={{ backgroundColor: bg }}
              />
            )
          })}
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-stone-400">
          {t('miniGames.shadeGridFooter')}
        </p>
      </div>
    </div>
  )
}
