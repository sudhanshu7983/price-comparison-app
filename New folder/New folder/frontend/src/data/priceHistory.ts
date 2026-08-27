const STORAGE_KEY = 'bill.priceHistory'

type HistoryMap = Record<string, number>

function readHistory(): HistoryMap {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as HistoryMap) : {}
  } catch {
    return {}
  }
}

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase()
}

/**
 * Compares the new cheapest price against the last time this exact query was
 * checked (on this device), then records the new price for next time.
 * Returns null the first time a query is ever checked.
 */
export function checkPriceDrop(query: string, newPrice: number): { delta: number; percent: number } | null {
  const key = normalizeQuery(query)
  const history = readHistory()
  const previous = history[key]

  history[key] = newPrice
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history))

  if (previous === undefined || previous === newPrice) return null
  const delta = newPrice - previous
  const percent = Math.round((delta / previous) * 100)
  return { delta, percent }
}
