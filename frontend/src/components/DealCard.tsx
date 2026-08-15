import type { Deal } from '../types'

interface DealCardProps {
  deal: Deal
  isCheapest: boolean
}

export function DealCard({ deal, isCheapest }: DealCardProps) {
  const discountPercent = Math.round((1 - deal.price / deal.originalPrice) * 100)

  return (
    <div className={`deal-card ${isCheapest ? 'is-cheapest' : ''}`}>
      <div className="deal-card__icon" aria-hidden="true">
        {deal.logoEmoji}
      </div>
      <div className="deal-card__body">
        <div className="deal-card__top">
          <span className="deal-card__source">{deal.sourceName}</span>
          <span className="deal-card__kind">{deal.kind}</span>
          {isCheapest && <span className="cheapest-badge">Cheapest</span>}
        </div>
        <div className="deal-card__prices">
          <span className="deal-card__price">₹{deal.price.toLocaleString('en-IN')}</span>
          {discountPercent > 0 && <span className="deal-card__original">₹{deal.originalPrice.toLocaleString('en-IN')}</span>}
          {discountPercent > 0 && <span className="bill-chip__discount">{discountPercent}% off</span>}
        </div>
      </div>
    </div>
  )
}
