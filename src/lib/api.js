/**
 * Centralized API and Socket URLs.
 * Set VITE_API_URL and VITE_SOCKET_URL in Vercel for production.
 * Production fallback uses Render backend URL when env is missing.
 */
const DEV = import.meta.env.DEV
const PROD_BACKEND = 'https://quizverse-6nxn.onrender.com'
const API_URL = import.meta.env.VITE_API_URL ?? (DEV ? 'http://localhost:4000' : PROD_BACKEND)
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? import.meta.env.VITE_API_URL ?? (DEV ? 'http://localhost:4000' : PROD_BACKEND)

export { API_URL, SOCKET_URL }
export default API_URL
