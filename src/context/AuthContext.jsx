import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import API from '@/lib/api.js'

const STORAGE_KEY = 'quizverse_user'
const TOKEN_KEY = 'quizverse_token'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const persist = useCallback((u, token) => {
    setUser(u)
    if (token) localStorage.setItem(TOKEN_KEY, token)
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    else {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const token = localStorage.getItem(TOKEN_KEY)
      if (raw && token) setUser(JSON.parse(raw))
    } catch {}
    setLoading(false)
  }, [])

  const signIn = async (email, password) => {
    if (!API) {
      const u = { id: 'u1', email, name: email.split('@')[0], demo: true }
      persist(u, null)
      return u
    }
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    })
    const data = await res.json()
    if (!data.ok) throw new Error(data.error || 'Login failed')
    const u = { id: data.user.id, email: data.user.email, name: data.user.name, role: data.user.role }
    persist(u, data.token)
    return u
  }

  const register = async (email, password, name) => {
    if (!API) {
      const u = { id: 'u_' + Date.now(), email, name: name || email.split('@')[0], demo: true }
      persist(u, null)
      return u
    }
    const res = await fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password, name: (name || '').trim() || email.split('@')[0] }),
    })
    const data = await res.json()
    if (!data.ok) throw new Error(data.error || 'Registration failed')
    const u = { id: data.user.id, email: data.user.email, name: data.user.name, role: data.user.role }
    persist(u, data.token)
    return u
  }

  const signOut = () => persist(null, null)

  const getToken = () => localStorage.getItem(TOKEN_KEY)

  return (
    <AuthContext.Provider value={{ user, signIn, register, signOut, getToken, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) return { user: null, signIn: () => {}, register: () => {}, signOut: () => {}, getToken: () => null, isAuthenticated: false, loading: false }
  return ctx
}
