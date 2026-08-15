import { QUICK_ACTIONS } from '../data/mockData'
import { useAuth } from '../state/AuthContext'
import type { QuickAction } from '../types'

interface HomeProps {
  onSelectQuickAction: (action: QuickAction) => void
}

export function Home({ onSelectQuickAction }: HomeProps) {
  const { displayName } = useAuth()

  return (
    <div className="home-main">
      <div className="home-orb" />
      <div>
        <p className="home-greeting">Hey {displayName ?? 'there'},</p>
        <h1 className="home-title">What do you want to save on today?</h1>
      </div>
      <div className="quick-actions">
        {QUICK_ACTIONS.map((action) => (
          <button key={action.id} className="quick-action" onClick={() => onSelectQuickAction(action)}>
            <span aria-hidden="true">{action.emoji}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
