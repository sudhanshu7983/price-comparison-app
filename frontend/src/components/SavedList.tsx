import { useSaved } from '../state/SavedContext'
import { StateCard } from './StateCard'

interface SavedListProps {
  onStartSearch: () => void
}

export function SavedList({ onStartSearch }: SavedListProps) {
  const { saved, removeComparison } = useSaved()

  if (saved.length === 0) {
    return (
      <div className="saved-page">
        <StateCard
          emoji="🗂️"
          title="No saved comparisons yet"
          body="Compare a price and tap 'Save this comparison' to keep it here for next time."
          actionLabel="Start a search"
          onAction={onStartSearch}
        />
      </div>
    )
  }

  return (
    <div className="saved-page">
      {saved.map((item) => (
        <div className="saved-item" key={item.id}>
          <div className="saved-item__top">
            <span className="saved-item__query">{item.query}</span>
            <span className="saved-item__date">{new Date(item.savedAt).toLocaleDateString('en-IN')}</span>
          </div>
          <p className="saved-item__best">
            {item.bestWayToPay.label} · <span className="saved-item__price">₹{item.bestWayToPay.effectivePrice.toLocaleString('en-IN')}</span>
          </p>
          <button className="saved-item__remove" onClick={() => removeComparison(item.id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}
