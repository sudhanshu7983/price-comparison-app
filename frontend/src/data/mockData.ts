import type { CardReward, Deal, QuickAction, SourceKind } from '../types'

// ---- Seeded "sources" a search can be normalized across (3-4 mocked sources) ----
const SOURCE_TEMPLATES: { name: string; kind: SourceKind; emoji: string }[] = [
  { name: 'BigBasket', kind: 'offer', emoji: '🧺' },
  { name: 'Swiggy Instamart', kind: 'coupon', emoji: '🛵' },
  { name: 'CRED Store', kind: 'cashback', emoji: '💳' },
  { name: 'Amazon Pay', kind: 'cashback', emoji: '📦' },
  { name: 'Flipkart Minutes', kind: 'offer', emoji: '⚡' },
  { name: 'MakeMyTrip', kind: 'offer', emoji: '✈️' },
  { name: 'Cleartrip', kind: 'coupon', emoji: '🧳' },
  { name: 'PhonePe', kind: 'cashback', emoji: '📱' },
]

// ---- Seeded credit cards the signed-in user holds, with reward rates ----
export const USER_CARDS: CardReward[] = [
  { id: 'card-hdfc-millennia', name: 'HDFC Millennia', network: 'Visa', rewardRate: 0.05, logoEmoji: '🟣' },
  { id: 'card-axis-ace', name: 'Axis Ace', network: 'RuPay', rewardRate: 0.02, logoEmoji: '🔵' },
  { id: 'card-sbi-cashback', name: 'SBI Cashback', network: 'Mastercard', rewardRate: 0.03, logoEmoji: '🟢' },
]

export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'groceries', label: 'Buy Groceries', emoji: '🛒', sampleQuery: 'Weekly groceries' },
  { id: 'bills', label: 'Cut My Bills', emoji: '🧾', sampleQuery: 'Airtel postpaid bill' },
  { id: 'flights', label: 'Flight deals', emoji: '✈️', sampleQuery: 'Flight to Goa' },
  { id: 'nearby', label: 'Offers Near Me', emoji: '📍', sampleQuery: 'Offers near me' },
]

// "Your cards" strip on the home screen — a snapshot of bills the user has tracked before
export const YOUR_BILLS = [
  { id: 'b1', name: 'Airtel bill', emoji: '📶', discountPercent: 17, originalPrice: 1200, price: 996 },
  { id: 'b2', name: 'Sony Liv bill', emoji: '📺', discountPercent: 35, originalPrice: 1500, price: 975 },
  { id: 'b3', name: 'Electricity bill', emoji: '💡', discountPercent: 12, originalPrice: 2400, price: 2112 },
]

// deterministic pseudo-random helpers so the same query always returns the same demo numbers
function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function mulberry32(seed: number) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function basePriceForQuery(query: string, rand: () => number): number {
  const lower = query.toLowerCase()
  if (lower.includes('flight')) return Math.round(3200 + rand() * 4800)
  if (lower.includes('bill') || lower.includes('recharge')) return Math.round(400 + rand() * 1800)
  if (lower.includes('subscription') || lower.includes('netflix') || lower.includes('liv')) {
    return Math.round(150 + rand() * 650)
  }
  return Math.round(600 + rand() * 2200) // groceries / general default
}

/** Builds a normalized set of 3-4 mocked deals for a free-text query. Same query -> same result. */
export function generateDealsForQuery(query: string): Deal[] {
  const seed = hashString(query.trim().toLowerCase() || 'default')
  const rand = mulberry32(seed)
  const base = basePriceForQuery(query, rand)

  const sourceCount = 3 + Math.round(rand()) // 3 or 4
  const shuffled = [...SOURCE_TEMPLATES].sort(() => rand() - 0.5).slice(0, sourceCount)

  return shuffled.map((source, index) => {
    // spread discounts 4%-38% so the sources are meaningfully different, not just noise
    const discount = 0.04 + rand() * 0.34
    const original = Math.round(base * (1 + index * 0.04))
    const price = Math.max(1, Math.round(original * (1 - discount)))
    return {
      id: `${source.name}-${seed}-${index}`,
      sourceName: source.name,
      kind: source.kind,
      originalPrice: original,
      price,
      logoEmoji: source.emoji,
    }
  })
}
