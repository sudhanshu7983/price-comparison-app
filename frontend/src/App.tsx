import { useEffect, useRef, useState } from 'react'
import { CardsStrip } from './components/CardsStrip'
import { ChatInput } from './components/ChatInput'
import { ConversationScreen } from './components/ConversationScreen'
import { Header } from './components/Header'
import { Home } from './components/Home'
import { SavedList } from './components/SavedList'
import { SignIn } from './components/SignIn'
import { buildComparisonResult } from './data/compare'
import { checkPriceDrop } from './data/priceHistory'
import { useAuth } from './state/AuthContext'
import { useSaved } from './state/SavedContext'
import type { ComparisonResult, QuickAction, SearchStage } from './types'

type Screen = 'home' | 'conversation' | 'saved'

const DEBOUNCE_MS = 260
const STEP_MS = 550

export default function App() {
  const { email } = useAuth()

  if (!email) {
    return (
      <div className="app-shell">
        <div className="app-frame">
          <SignIn />
        </div>
      </div>
    )
  }

  return <SignedInApp />
}

function SignedInApp() {
  const { saveComparison, isSaved } = useSaved()
  const [screen, setScreen] = useState<Screen>('home')
  const [query, setQuery] = useState('')
  const [stage, setStage] = useState<SearchStage>('idle')
  const [result, setResult] = useState<ComparisonResult | null>(null)
  const [priceDrop, setPriceDrop] = useState<{ delta: number; percent: number } | null>(null)

  // Guards against out-of-order responses: only the most recent request's
  // timers are allowed to update state. Older, superseded requests are
  // effectively cancelled the moment a newer query comes in.
  const requestIdRef = useRef(0)
  const timeoutsRef = useRef<number[]>([])

  useEffect(() => {
    return () => clearAllTimeouts()
  }, [])

  function clearAllTimeouts() {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id))
    timeoutsRef.current = []
  }

  function schedule(fn: () => void, delay: number) {
    const id = window.setTimeout(fn, delay)
    timeoutsRef.current.push(id)
  }

  function runSearch(nextQuery: string) {
    clearAllTimeouts()
    const requestId = ++requestIdRef.current

    setQuery(nextQuery)
    setScreen('conversation')
    setResult(null)
    setPriceDrop(null)
    setStage('idle')

    const isStale = () => requestId !== requestIdRef.current

    // debounce the start of the "request" so rapid-fire submissions collapse into one
    schedule(() => {
      if (isStale()) return
      setStage('analyzing')

      schedule(() => {
        if (isStale()) return
        setStage('finding')

        schedule(() => {
          if (isStale()) return
          setStage('comparing')

          schedule(() => {
            if (isStale()) return

            const simulateError = /\b(fail|error)\b/i.test(nextQuery)
            if (simulateError) {
              setStage('error')
              return
            }

            const comparison = buildComparisonResult(nextQuery)
            const drop = checkPriceDrop(nextQuery, comparison.bestWayToPay.effectivePrice)
            setPriceDrop(drop)
            setResult(comparison)
            setStage('done')
          }, STEP_MS)
        }, STEP_MS)
      }, STEP_MS)
    }, DEBOUNCE_MS)
  }

  function handleQuickAction(action: QuickAction) {
    runSearch(action.sampleQuery)
  }

  function handleFollowup(nextQuery: string) {
    runSearch(nextQuery)
  }

  function handleSave() {
    if (result) saveComparison(result)
  }

  function handleRetry() {
    runSearch(query)
  }

  function goHome() {
    clearAllTimeouts()
    requestIdRef.current += 1
    setScreen('home')
    setStage('idle')
    setResult(null)
  }

  return (
    <div className="app-shell">
      <div className="app-frame">
        <Header
          showBack={screen !== 'home'}
          onBack={goHome}
          onOpenCards={() => setScreen('saved')}
          onOpenMenu={() => setScreen(screen === 'home' ? 'saved' : 'home')}
        />

        {screen === 'home' && (
          <>
            <CardsStrip />
            <Home onSelectQuickAction={handleQuickAction} />
            <ChatInput onSubmit={runSearch} placeholder="Ask a followup question" />
          </>
        )}

        {screen === 'conversation' && (
          <ConversationScreen
            query={query}
            stage={stage}
            result={result}
            priceDrop={priceDrop}
            isSaved={result ? isSaved(result.id) : false}
            onSave={handleSave}
            onRetry={handleRetry}
            onFollowup={handleFollowup}
          />
        )}

        {screen === 'saved' && <SavedList onStartSearch={goHome} />}
      </div>
    </div>
  )
}

