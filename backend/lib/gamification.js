import User from '../models/User.js'

/** UTC calendar day YYYY-MM-DD */
export function utcDayString(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

export function addUtcDays(isoDay, delta) {
  const x = new Date(`${isoDay}T12:00:00.000Z`)
  x.setUTCDate(x.getUTCDate() + delta)
  return x.toISOString().slice(0, 10)
}

/** Level from total XP — every ~300 XP raises level (cap 99). */
export function levelFromXp(xp) {
  const x = Math.max(0, Number(xp) || 0)
  return Math.min(99, 1 + Math.floor(x / 300))
}

/** XP threshold to reach the next level (exclusive upper bound for current level band). */
export function nextLevelXpThreshold(level) {
  const L = Math.min(99, Math.max(1, Number(level) || 1))
  return L * 300
}

/**
 * Award XP for a solo quiz completion. Updates streak on first play of each UTC day.
 * @returns {{ xpEarned: number, xp: number, level: number, streak: number, nextLevelAt: number }}
 */
export async function awardSoloXp(userId, score, total) {
  const today = utcDayString()
  const yesterday = addUtcDays(today, -1)

  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')

  const prevXp = Math.max(0, Number(user.xp) || 0)
  const prevStreak = Math.max(0, Number(user.streak) || 0)
  const last = (user.lastPlayDay || '').trim()

  let newStreak = prevStreak
  if (last !== today) {
    if (last === yesterday) newStreak = prevStreak + 1
    else newStreak = 1
  }

  const ratio = Math.max(0, Math.min(1, Number(total) > 0 ? Number(score) / Number(total) : 0))
  const base = Math.round(10 + ratio * 90)
  const streakBonus = Math.min(40, newStreak * 2)
  const xpEarned = base + streakBonus

  const xp = prevXp + xpEarned
  const level = levelFromXp(xp)
  const lastPlayDay = today

  await User.findByIdAndUpdate(userId, {
    xp,
    level,
    streak: newStreak,
    lastPlayDay,
  })

  const nextLevelAt = nextLevelXpThreshold(level)

  return {
    xpEarned,
    xp,
    level,
    streak: newStreak,
    nextLevelAt,
  }
}
