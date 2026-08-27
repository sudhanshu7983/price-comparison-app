import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

interface AuthState {
  email: string | null
  displayName: string | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)
const API_URL = 'http://localhost:8000'
const TOKEN_KEY = 'bill.auth.token'

function nameFromEmail(email: string): string {
  const handle = email.split('@')[0] ?? email
  const cleaned = handle.replace(/[._-]+/g, ' ').trim()
  if (!cleaned) return 'there'
  return cleaned
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = window.localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setIsLoading(false)
      return
    }

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Your session has expired. Please sign in again.')
        return response.json() as Promise<{ email: string }>
      })
      .then((user) => setEmail(user.email))
      .catch(() => {
        window.localStorage.removeItem(TOKEN_KEY)
        setEmail(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  async function authenticate(path: 'login' | 'register', emailValue: string, password: string) {
    const response = await fetch(`${API_URL}/auth/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailValue.trim().toLowerCase(), password }),
    })

    const payload = await response.json().catch(() => null)
    if (!response.ok) {
      const detail = payload?.detail
      throw new Error(Array.isArray(detail) ? detail[0]?.msg : detail || 'Authentication failed')
    }

    window.localStorage.setItem(TOKEN_KEY, payload.access_token)
    setEmail(payload.user.email)
  }

  const value = useMemo<AuthState>(
    () => ({
      email,
      isLoading,
      displayName: email ? nameFromEmail(email) : null,
      signIn: (nextEmail, password) => authenticate('login', nextEmail, password),
      signUp: (nextEmail, password) => authenticate('register', nextEmail, password),
      signOut: () => {
        window.localStorage.removeItem(TOKEN_KEY)
        setEmail(null)
      },
    }),
    [email, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
