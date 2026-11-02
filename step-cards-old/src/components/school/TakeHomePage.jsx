import React from 'react'

export function TakeHomePage({ instructionSummary, steps, studentName, date }) {
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl border border-border">
      <h1 className="text-2xl font-bold mb-1">Today's steps: {instructionSummary}</h1>
      <p className="text-muted text-sm mb-4">
        {studentName} · {date}
      </p>

      <ol className="flex flex-col gap-4 mb-6">
        {steps.map(step => (
          <li key={step.n} className="flex items-start gap-3">
            <span className="text-xl font-bold text-step-num w-6 flex-shrink-0">{step.n}</span>
            {step.pictogramUrl && (
              <img
                src={step.pictogramUrl}
                alt={step.text}
                width={48}
                height={48}
                className="object-contain flex-shrink-0"
              />
            )}
            <span className="step-text">{step.text}</span>
          </li>
        ))}
      </ol>

      <button
        onClick={() => window.print()}
        className="min-h-[44px] px-6 py-2 bg-btn-primary text-white rounded-lg font-bold hover:bg-blue-700 transition-colors mb-4"
      >
        Print
      </button>

      <p className="text-xs text-muted mt-4">
        Pictograms provided by{' '}
        <a
          href="https://arasaac.org"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          ARASAAC
        </a>{' '}
        (Aragonese Portal of Augmentative and Alternative Communication), licensed under CC BY-NC-SA.
      </p>
    </div>
  )
}
