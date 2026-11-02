import React, { useState, useEffect } from 'react'

export function StepList({ steps, onAllDone }) {
  const [doneSteps, setDoneSteps] = useState(new Set())

  useEffect(() => {
    setDoneSteps(new Set())
  }, [steps])

  function toggleStep(n) {
    setDoneSteps(prev => {
      const next = new Set(prev)
      if (next.has(n)) {
        next.delete(n)
      } else {
        next.add(n)
        if (next.size === steps.length) {
          onAllDone?.()
        }
      }
      return next
    })
  }

  const firstUndone = steps.find(s => !doneSteps.has(s.n))

  return (
    <ol className="flex flex-col gap-2">
      {steps.map(step => {
        const isDone = doneSteps.has(step.n)
        const isActive = !isDone && firstUndone?.n === step.n
        return (
          <li
            key={step.n}
            onClick={() => toggleStep(step.n)}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleStep(step.n) }}
            className={`flex items-start gap-4 px-4 py-3 rounded-lg cursor-pointer transition-colors select-none ${
              isDone
                ? 'bg-card-done text-muted'
                : 'bg-card hover:bg-gray-50'
            }`}
            style={isActive ? { borderLeft: '2px solid rgba(96, 165, 250, 0.6)' } : {}}
            aria-label={`Step ${step.n}: ${step.text}${isDone ? ' — done' : ''}`}
          >
            <span className="text-step-num font-bold text-base w-6 flex-shrink-0 pt-0.5">
              {step.n}
            </span>
            <span className={`step-text ${isDone ? 'line-through opacity-60' : ''}`}>
              {step.text}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
