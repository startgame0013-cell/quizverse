import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/context/LanguageContext'
import PageComments from '@/components/PageComments'

const EMOJI_PAIRS = ['🌟', '🎯', '🔥', '💡', '⚡', '🎨', '🌈', '🚀']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MemoryMatch() {
  const { t } = useLanguage()
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)

  const init = () => {
    const pairs = shuffle([...EMOJI_PAIRS, ...EMOJI_PAIRS]).map((v, i) => ({ id: i, value: v }))
    setCards(pairs)
    setFlipped([])
    setMatched([])
    setMoves(0)
  }

  useEffect(() => init(), [])

  const handleFlip = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(cards.find((c) => c.id === id)?.value)) return
    const next = [...flipped, id]
    setFlipped(next)
    setMoves((m) => m + 1)
    if (next.length === 2) {
      const [a, b] = next.map((i) => cards.find((c) => c.id === i)?.value)
      if (a === b) {
        setMatched((m) => [...m, a])
        setFlipped([])
      } else {
        setTimeout(() => setFlipped([]), 600)
      }
    }
  }

  const isComplete = matched.length === EMOJI_PAIRS.length

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <Link to="/mini-games" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          {t('miniGames.title')}
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Moves: {moves}</span>
          <Button variant="ghost" size="sm" onClick={init} className="gap-1">
            <RotateCcw className="size-4" />
            Reset
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isComplete ? (
            <div className="text-center py-12">
              <p className="text-2xl font-bold text-primary">You won!</p>
              <p className="mt-2 text-muted-foreground">Completed in {moves} moves</p>
              <Button onClick={init} className="mt-4 gap-2">
                <RotateCcw className="size-4" />
                Play again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {cards.map((card) => {
                const isFlipped = flipped.includes(card.id) || matched.includes(card.value)
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleFlip(card.id)}
                    className="aspect-square rounded-xl border-2 border-border bg-muted/50 flex items-center justify-center text-3xl transition-all hover:border-primary/50 hover:bg-muted disabled:pointer-events-none"
                  >
                    {isFlipped ? card.value : '?'}
                  </button>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
      <PageComments pageKey="/mini-games/memory" />
    </div>
  )
}
