import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:4000' : '')

export default function VisitTracker() {
  const { pathname } = useLocation()

  useEffect(() => {
    fetch(`${API}/api/stats/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        referrer: typeof document !== 'undefined' ? document.referrer || '' : '',
      }),
    }).catch(() => {})
  }, [pathname])

  return null
}
