import { lazy } from 'react'

const RELOAD_KEY = 'quizverse_chunk_reload_once'

/**
 * React.lazy wrapper: after a new Vercel deploy, old tabs may request missing chunk files.
 * One automatic reload usually fixes it.
 */
export function lazyWithRetry(importer) {
  return lazy(async () => {
    try {
      const mod = await importer()
      sessionStorage.removeItem(RELOAD_KEY)
      return mod
    } catch (err) {
      const msg = String(err?.message || err || '')
      const isChunk =
        msg.includes('Failed to fetch dynamically imported module') ||
        msg.includes('Importing a module script failed') ||
        msg.includes('error loading dynamically imported module') ||
        err?.name === 'ChunkLoadError'
      if (isChunk && !sessionStorage.getItem(RELOAD_KEY)) {
        sessionStorage.setItem(RELOAD_KEY, '1')
        window.location.reload()
        return new Promise(() => {})
      }
      sessionStorage.removeItem(RELOAD_KEY)
      throw err
    }
  })
}
