import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

interface AuthState {
  email: string | null
  displayName: string | null
  signIn: (email: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)
const STORAGE_KEY = 'bill.auth.email'

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

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) setEmail(stored)
  }, [])

  const value = useMemo<AuthState>(
    () => ({
      email,
      displayName: email ? nameFromEmail(email) : null,
      signIn: (nextEmail: string) => {
        const normalized = nextEmail.trim().toLowerCase()
        window.localStorage.setItem(STORAGE_KEY, normalized)
        setEmail(normalized)
      },
      signOut: () => {
        window.localStorage.removeItem(STORAGE_KEY)
        setEmail(null)
      },
    }),
    [email],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
