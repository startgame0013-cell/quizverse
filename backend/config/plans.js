/**
 * Subscription plans (Kahoot-style)
 * Limits: maxPlayers per live game, maxQuizzes per user, AI generations per month
 */
export const PLANS = {
  free: {
    id: 'free',
    maxPlayers: 20,
    maxQuizzes: 10,
    aiGenerationsPerMonth: 5,
    priceMonthly: 0,
    priceYearly: 0,
  },
  basic: {
    id: 'basic',
    maxPlayers: 50,
    maxQuizzes: 50,
    aiGenerationsPerMonth: 50,
    priceMonthly: 2.99,
    priceYearly: 29.99,
  },
  pro: {
    id: 'pro',
    maxPlayers: 100,
    maxQuizzes: -1, // unlimited
    aiGenerationsPerMonth: 200,
    priceMonthly: 6.99,
    priceYearly: 69.99,
  },
  school: {
    id: 'school',
    maxPlayers: 200,
    maxQuizzes: -1,
    aiGenerationsPerMonth: 500,
    priceMonthly: 11.99,
    priceYearly: 119.99,
  },
}

export function getPlanLimits(plan = 'free') {
  return PLANS[plan] || PLANS.free
}

export function isPlanActive(user) {
  if (!user?.plan || user.plan === 'free') return true
  if (!user.planExpiresAt) return true
  return new Date(user.planExpiresAt) > new Date()
}
