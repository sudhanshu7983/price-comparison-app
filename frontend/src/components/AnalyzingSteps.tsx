import { IconCheck } from './Icons'
import type { SearchStage } from '../types'

const STEPS: { stage: SearchStage; label: string }[] = [
  { stage: 'analyzing', label: 'Analyzing deals' },
  { stage: 'finding', label: 'Finding the best ones' },
  { stage: 'comparing', label: 'Comparing and saving you the most money' },
]

const ORDER: SearchStage[] = ['analyzing', 'finding', 'comparing', 'done']

interface AnalyzingStepsProps {
  stage: SearchStage
}

export function AnalyzingSteps({ stage }: AnalyzingStepsProps) {
  const currentIndex = ORDER.indexOf(stage)

  return (
    <div className="assistant-row">
      <div className="assistant-avatar" aria-hidden="true" />
      <div className="steps-card" role="status" aria-live="polite">
        {STEPS.map((step, index) => {
          const isDone = currentIndex > index
          const isActive = currentIndex === index
          return (
            <div key={step.stage} className={`step-row ${isDone ? 'is-done' : ''} ${isActive ? 'is-active' : ''}`}>
              <span className="step-icon">{isDone && <IconCheck size={11} />}</span>
              <span>{step.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
