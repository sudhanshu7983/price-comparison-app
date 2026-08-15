import type { BestWayToPay, ComparisonResult, Deal } from '../types'
import { USER_CARDS } from './mockData'
import { generateDealsForQuery } from './mockData'

/**
 * "Best way to pay" = the cheapest source, unless paying with one of the user's
 * cards on top of that cheapest source earns back enough to beat it outright.
 */
export function computeBestWayToPay(deals: Deal[]): { cheapest: Deal; bestWayToPay: BestWayToPay } {
  const cheapest = deals.reduce((min, d) => (d.price < min.price ? d : min), deals[0])

  const bestCard = USER_CARDS.reduce((best, card) => (card.rewardRate > best.rewardRate ? card : best), USER_CARDS[0])
  const cardEffectivePrice = Math.round(cheapest.price * (1 - bestCard.rewardRate))

  if (cardEffectivePrice < cheapest.price) {
    return {
      cheapest,
      bestWayToPay: {
        type: 'card',
        label: `Pay via ${cheapest.sourceName} with your ${bestCard.name} card`,
        effectivePrice: cardEffectivePrice,
        detail: `${Math.round(bestCard.rewardRate * 100)}% back on ${bestCard.name} beats every other source`,
      },
    }
  }

  return {
    cheapest,
    bestWayToPay: {
      type: 'source',
      label: `Pay directly on ${cheapest.sourceName}`,
      effectivePrice: cheapest.price,
      detail: 'Cheapest option — no card beats this price today',
    },
  }
}

export function buildComparisonResult(query: string): ComparisonResult {
  const deals = generateDealsForQuery(query)
  const { cheapest, bestWayToPay } = computeBestWayToPay(deals)
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    query,
    deals,
    cheapestDealId: cheapest.id,
    bestWayToPay,
    createdAt: new Date().toISOString(),
  }
}
