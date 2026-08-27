import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ComparisonResult, SavedComparison } from '../types'
import { useAuth } from './AuthContext'

interface SavedState {
  saved: SavedComparison[]
  saveComparison: (result: ComparisonResult) => void
  removeComparison: (id: string) => void
  isSaved: (id: string) => boolean
}

const SavedContext = createContext<SavedState | undefined>(undefined)

function storageKeyFor(email: string): string {
  // Namespacing by email keeps each signed-in user's data isolated from every
  // other user's, mirroring the strict-ownership rule the real backend enforces.
  return `bill.saved.${email}`
}

export function SavedProvider({ children }: { children: ReactNode }) {
  const { email } = useAuth()
  const [saved, setSaved] = useState<SavedComparison[]>([])

  useEffect(() => {
    if (!email) {
      setSaved([])
      return
    }
    try {
      const raw = window.localStorage.getItem(storageKeyFor(email))
      setSaved(raw ? (JSON.parse(raw) as SavedComparison[]) : [])
    } catch {
      setSaved([])
    }
  }, [email])

  const persist = (next: SavedComparison[]) => {
    setSaved(next)
    if (email) window.localStorage.setItem(storageKeyFor(email), JSON.stringify(next))
  }

  const value = useMemo<SavedState>(
    () => ({
      saved,
      saveComparison: (result: ComparisonResult) => {
        if (!email) return
        const entry: SavedComparison = { ...result, savedAt: new Date().toISOString(), ownerEmail: email }
        persist([entry, ...saved.filter((s) => s.id !== result.id)])
      },
      removeComparison: (id: string) => {
        persist(saved.filter((s) => s.id !== id))
      },
      isSaved: (id: string) => saved.some((s) => s.id === id),
    }),
    [saved, email],
  )

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>
}

export function useSaved(): SavedState {
  const ctx = useContext(SavedContext)
  if (!ctx) throw new Error('useSaved must be used within SavedProvider')
  return ctx
}
