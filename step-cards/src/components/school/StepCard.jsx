import React from 'react'

export function StepCard({ step, isDone, onDone, onHelp, isActive, studentName }) {
  return (
    <div
      className={`relative rounded-xl border shadow-sm p-6 bg-card transition-colors ${
        isDone ? 'bg-card-done border-border opacity-70' : 'border-border'
      } ${isActive ? 'border-l-4' : ''}`}
      style={isActive ? { borderLeftColor: '#60A5FA', borderLeftWidth: '4px' } : {}}
    >
      {/* Step number */}
      <div className="text-4xl font-bold text-step-num mb-3">
        {step.n}
      </div>

      {/* Done overlay */}
      {isDone && (
        <div className="absolute top-3 right-3 text-2xl" aria-label="Step complete">
          ✓
        </div>
      )}

      {/* Pictogram or placeholder */}
      {!step.isSummaryCard && (
        <div className="flex justify-center mb-4">
          {step.pictogramUrl ? (
            <img
              src={step.pictogramUrl}
              alt={step.text}
              width={120}
              height={120}
              className="object-contain"
            />
          ) : (
            <div
              className="flex items-center justify-center text-5xl"
              style={{ width: 120, height: 120 }}
              role="img"
              aria-label={step.text}
            >
              📋
            </div>
          )}
        </div>
      )}

      {/* Step text */}
      <p className="step-text text-primary text-center mb-4">{step.text}</p>

      {/* Buttons */}
      {!isDone && (
        <div className="flex flex-col gap-2">
          <button
            onClick={onDone}
            className="min-h-[44px] w-full bg-btn-primary text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
            aria-label={`Mark step ${step.n} complete`}
          >
            Done ✓
          </button>
          <button
            onClick={() => onHelp(step.n)}
            className="min-h-[44px] w-full bg-btn-secondary text-primary rounded-lg text-sm hover:bg-gray-200 transition-colors"
            aria-label={`Request help for step ${step.n}`}
          >
            Help me
          </button>
        </div>
      )}
    </div>
  )
}
