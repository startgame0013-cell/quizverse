import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'quizverse_user'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setUser(JSON.parse(raw))
    } catch {}
  }, [])

  const signIn = (email, password) => {
    // Demo auth: any email/password works
    const u = { id: 'u1', email, name: email.split('@')[0], demo: true }
    setUser(u)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    return u
  }

  const register = (email, password, name) => {
    const u = { id: 'u_' + Date.now(), email, name: name || email.split('@')[0], demo: true }
    setUser(u)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    return u
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, register, signOut, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) return { user: null, signIn: () => {}, register: () => {}, signOut: () => {}, isAuthenticated: false }
  return ctx
}
