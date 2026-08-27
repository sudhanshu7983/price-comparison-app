import { YOUR_BILLS } from '../data/mockData'

export function CardsStrip() {
  return (
    <div className="cards-strip" role="list" aria-label="Your tracked bills">
      {YOUR_BILLS.map((bill) => (
        <div className="bill-chip" role="listitem" key={bill.id}>
          <div className="bill-chip__icon">{bill.emoji}</div>
          <div className="bill-chip__meta">
            <span className="bill-chip__name">{bill.name}</span>
            <span className="bill-chip__discount">{bill.discountPercent}% off</span>
            <span className="bill-chip__prices">
              <span className="bill-chip__price">₹{bill.price}</span>
              <span className="bill-chip__original">₹{bill.originalPrice}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
