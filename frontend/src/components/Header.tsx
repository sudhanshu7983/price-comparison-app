import { IconBack, IconMenu } from './Icons'

interface HeaderProps {
  showBack?: boolean
  onBack?: () => void
  onOpenCards: () => void
  onOpenMenu: () => void
  onSignOut: () => void
}

export function Header({ showBack, onBack, onOpenCards, onOpenMenu, onSignOut }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__left">
        {showBack ? (
          <button className="back-button" onClick={onBack} aria-label="Go back">
            <IconBack />
          </button>
        ) : (
          <span>
            <span className="brand">Bill</span>
            <span className="brand-badge">GPT</span>
          </span>
        )}
      </div>
      <div className="app-header__right">
        <button className="pill-button" onClick={onOpenCards}>
          Your cards
        </button>
        <button className="pill-button logout-button" onClick={onSignOut}>
          Log out
        </button>
        <button className="icon-button" onClick={onOpenMenu} aria-label="Menu">
          <IconMenu />
        </button>
      </div>
    </header>
  )
}
