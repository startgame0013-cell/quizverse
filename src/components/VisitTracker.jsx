import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import API from '@/lib/api.js'

export default function VisitTracker() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (!API) return
    fetch(`${API}/api/stats/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        referrer: typeof document !== 'undefined' ? document.referrer || '' : '',
      }),
    }).catch(() => {})
  }, [pathname, API])

  return null
}
