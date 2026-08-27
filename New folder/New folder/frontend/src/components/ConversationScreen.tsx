import { AnalyzingSteps } from './AnalyzingSteps'
import { BestWayToPay } from './BestWayToPay'
import { ChatInput } from './ChatInput'
import { DealCard } from './DealCard'
import { DealListSkeleton } from './Skeleton'
import { StateCard } from './StateCard'
import { IconBookmark } from './Icons'
import type { ComparisonResult, SearchStage } from '../types'

interface ConversationScreenProps {
  query: string
  stage: SearchStage
  result: ComparisonResult | null
  priceDrop: { delta: number; percent: number } | null
  isSaved: boolean
  onSave: () => void
  onRetry: () => void
  onFollowup: (query: string) => void
}

export function ConversationScreen({
  query,
  stage,
  result,
  priceDrop,
  isSaved,
  onSave,
  onRetry,
  onFollowup,
}: ConversationScreenProps) {
  const isLoading = stage === 'analyzing' || stage === 'finding' || stage === 'comparing'
  const isError = stage === 'error'
  const doneResult = stage === 'done' ? result : null

  return (
    <>
      <div className="conversation">
        <div className="user-bubble">{query}</div>

        {isLoading && <AnalyzingSteps stage={stage} />}

        {isError && (
          <StateCard
            emoji="⚠️"
            title="Couldn't compare that just now"
            body="Something went wrong while fetching deals. Check your connection and try again."
            isError
            actionLabel="Try again"
            onAction={onRetry}
          />
        )}

        {isLoading && (
          <div className="assistant-row">
            <div className="assistant-avatar" aria-hidden="true" style={{ visibility: 'hidden' }} />
            <div style={{ flex: 1 }}>
              <DealListSkeleton />
            </div>
          </div>
        )}

        {doneResult && doneResult.deals.length === 0 && (
          <StateCard emoji="🔍" title="No deals found" body="We couldn't find any sources for that. Try a different search." />
        )}

        {doneResult && doneResult.deals.length > 0 && (
          <div className="assistant-row">
            <div className="assistant-avatar" aria-hidden="true" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p className="results-summary">
                Found {doneResult.deals.length} sources for "{doneResult.query}"
                {priceDrop && (
                  <>
                    {' · '}
                    <span style={{ color: priceDrop.delta < 0 ? 'var(--green)' : 'var(--red)' }}>
                      {priceDrop.delta < 0 ? '↓' : '↑'} {Math.abs(priceDrop.percent)}% vs your last check
                    </span>
                  </>
                )}
              </p>

              <div className="deal-list">
                {doneResult.deals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} isCheapest={deal.id === doneResult.cheapestDealId} />
                ))}
              </div>

              <BestWayToPay bestWayToPay={doneResult.bestWayToPay} />

              <div className="results-actions">
                <button className="primary-button" onClick={onSave} disabled={isSaved}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <IconBookmark size={14} filled={isSaved} />
                    {isSaved ? 'Saved to your list' : 'Save this comparison'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ChatInput onSubmit={onFollowup} disabled={isLoading} />
    </>
  )
}
