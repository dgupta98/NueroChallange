import React from 'react'

export function ShiftLog({ log, onClose }) {
  function formatTime(iso) {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return iso
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Shift log</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-muted hover:text-primary text-xl rounded"
            aria-label="Close shift log"
          >
            ×
          </button>
        )}
      </div>

      {log.length === 0 ? (
        <p className="text-muted text-sm">No entries yet.</p>
      ) : (
        <ol className="flex flex-col gap-2">
          {log.map(entry => (
            <li key={entry.id} className="flex items-start gap-3 px-4 py-3 bg-card rounded-lg border border-border">
              <span className="text-muted text-sm flex-shrink-0 pt-0.5">{formatTime(entry.timestamp)}</span>
              <div className="flex flex-col">
                <span className="font-semibold text-primary">{entry.instructionSummary}</span>
                <span className="text-muted text-sm">{entry.stepCount} steps</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
