export type SourceKind = 'offer' | 'coupon' | 'cashback'

export interface Deal {
  id: string
  sourceName: string
  kind: SourceKind
  originalPrice: number
  price: number
  logoEmoji: string
}

export interface CardReward {
  id: string
  name: string
  network: string
  rewardRate: number // 0.05 = 5% back
  logoEmoji: string
}

export interface BestWayToPay {
  type: 'source' | 'card'
  label: string
  effectivePrice: number
  detail: string
}

export interface ComparisonResult {
  id: string
  query: string
  deals: Deal[]
  cheapestDealId: string
  bestWayToPay: BestWayToPay
  createdAt: string
}

export interface SavedComparison extends ComparisonResult {
  savedAt: string
  ownerEmail: string
}

export interface QuickAction {
  id: string
  label: string
  emoji: string
  sampleQuery: string
}

export type SearchStage = 'idle' | 'analyzing' | 'finding' | 'comparing' | 'done' | 'error'
