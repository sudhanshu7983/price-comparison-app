export function DealCardSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-block" style={{ width: 42, height: 42 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton-block" style={{ width: '55%', height: 12 }} />
        <div className="skeleton-block" style={{ width: '35%', height: 16 }} />
      </div>
    </div>
  )
}

export function DealListSkeleton() {
  return (
    <div className="deal-list" role="status" aria-label="Loading deals">
      <DealCardSkeleton />
      <DealCardSkeleton />
      <DealCardSkeleton />
    </div>
  )
}
