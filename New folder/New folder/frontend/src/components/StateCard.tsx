interface StateCardProps {
  emoji: string
  title: string
  body: string
  isError?: boolean
  actionLabel?: string
  onAction?: () => void
}

export function StateCard({ emoji, title, body, isError, actionLabel, onAction }: StateCardProps) {
  return (
    <div className={`state-card ${isError ? 'is-error' : ''}`} role={isError ? 'alert' : 'status'}>
      <span className="state-card__emoji" aria-hidden="true">
        {emoji}
      </span>
      <p className="state-card__title">{title}</p>
      <p className="state-card__body">{body}</p>
      {actionLabel && onAction && (
        <button className="primary-button" style={{ marginTop: 6 }} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
