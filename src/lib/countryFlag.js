/** ISO 3166-1 alpha-2 → regional indicator flag emoji */
export function countryCodeToFlag(code) {
  if (!code || typeof code !== 'string' || code.length !== 2) return '🌍'
  const upper = code.toUpperCase()
  if (!/^[A-Z]{2}$/.test(upper)) return '🌍'
  const A = 0x1f1e6
  return String.fromCodePoint(
    A + upper.charCodeAt(0) - 65,
    A + upper.charCodeAt(1) - 65
  )
}
