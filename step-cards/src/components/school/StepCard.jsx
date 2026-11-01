import { useState } from 'react'
import { loadPictogramPref, savePictogramPref } from '../../utils/storage'

export function StepCard({ step, isDone, onDone, onHelp, isActive }) {
  const variations = step.pictogramUrls && step.pictogramUrls.length > 0
    ? step.pictogramUrls
    : (step.pictogramUrl ? [step.pictogramUrl] : [])

  const hasVariations = variations.length > 1

  // Initialize from persisted preference so the student's choice sticks across sessions
  const [varIdx, setVarIdx] = useState(() => {
    if (!hasVariations) return 0
    const saved = loadPictogramPref(step.icon_keyword)
    return Math.min(saved, variations.length - 1)
  })

  function handleDone() {
    if (hasVariations) savePictogramPref(step.icon_keyword, varIdx)
    onDone(varIdx)
  }

  const currentUrl = variations[varIdx] ?? null

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

      {/* Pictogram or placeholder — with variation swipe when multiple URLs exist */}
      {!step.isSummaryCard && (
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center gap-2">
            {/* Left arrow — only rendered when there are multiple variations */}
            {hasVariations && (
              <button
                onClick={() => setVarIdx(i => i - 1)}
                disabled={varIdx === 0}
                className="flex items-center justify-center rounded-lg bg-btn-secondary text-primary hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                style={{ minWidth: 44, minHeight: 44 }}
                aria-label="Previous pictogram variation"
              >
                &#8592;
              </button>
            )}

            {currentUrl ? (
              <img
                src={currentUrl}
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

            {/* Right arrow */}
            {hasVariations && (
              <button
                onClick={() => setVarIdx(i => i + 1)}
                disabled={varIdx === variations.length - 1}
                className="flex items-center justify-center rounded-lg bg-btn-secondary text-primary hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                style={{ minWidth: 44, minHeight: 44 }}
                aria-label="Next pictogram variation"
              >
                &#8594;
              </button>
            )}
          </div>

          {/* Dot indicators */}
          {hasVariations && (
            <div className="flex gap-1 mt-2" role="group" aria-label="Pictogram variations">
              {variations.map((_, i) => (
                <span
                  key={i}
                  className={`inline-block rounded-full transition-colors ${
                    i === varIdx
                      ? 'bg-btn-primary'
                      : 'bg-gray-300'
                  }`}
                  style={{ width: 8, height: 8 }}
                  aria-hidden="true"
                />
              ))}
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
            onClick={handleDone}
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
