import React, { useState, useEffect } from 'react'
import { StepCard } from './StepCard'
import { CompletionScreen } from '../shared/CompletionScreen'

export function StudentView({ student, steps, instructionSummary, onComplete, onHelp }) {
  const [tappedSteps, setTappedSteps] = useState(new Set())
  const [allDone, setAllDone] = useState(false)

  useEffect(() => {
    setTappedSteps(new Set())
    setAllDone(false)
  }, [instructionSummary, steps])

  const currentStepIndex = steps.findIndex(s => !tappedSteps.has(s.n))
  const currentStep = steps[currentStepIndex]

  function handleDone(stepN) {
    const newTapped = new Set(tappedSteps)
    newTapped.add(stepN)
    setTappedSteps(newTapped)
    if (newTapped.size === steps.length) {
      setAllDone(true)
      onComplete(student.id, instructionSummary)
    }
  }

  if (allDone) {
    return (
      <CompletionScreen
        message="Done."
        subtext={`Great work, ${student.displayName}!`}
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-muted text-sm text-center">
        Step {Math.min(currentStepIndex + 1, steps.length)} of {steps.length}
      </p>
      {currentStep && (
        <StepCard
          step={currentStep}
          isDone={false}
          isActive={true}
          studentName={student.displayName}
          onDone={() => handleDone(currentStep.n)}
          onHelp={(stepN) => onHelp(student.id, stepN)}
        />
      )}
      {steps.filter(s => tappedSteps.has(s.n)).map(s => (
        <StepCard
          key={s.n}
          step={s}
          isDone={true}
          isActive={false}
          studentName={student.displayName}
          onDone={() => {}}
          onHelp={() => {}}
        />
      ))}
    </div>
  )
}
