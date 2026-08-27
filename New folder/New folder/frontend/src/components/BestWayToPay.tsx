import { IconWallet } from './Icons'
import type { BestWayToPay as BestWayToPayType } from '../types'

interface BestWayToPayProps {
  bestWayToPay: BestWayToPayType
}

export function BestWayToPay({ bestWayToPay }: BestWayToPayProps) {
  return (
    <div className="best-way-card">
      <div className="best-way-card__icon" aria-hidden="true">
        <IconWallet size={18} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p className="best-way-card__label">Best way to pay</p>
        <p className="best-way-card__title">{bestWayToPay.label}</p>
        <p className="best-way-card__detail">{bestWayToPay.detail}</p>
      </div>
      <span className="best-way-card__price">₹{bestWayToPay.effectivePrice.toLocaleString('en-IN')}</span>
    </div>
  )
}
