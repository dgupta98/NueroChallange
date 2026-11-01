import React from 'react'

export function HelpNotice({ helpRequests, students, onClear }) {
  const entries = Object.entries(helpRequests)
  if (entries.length === 0) return null

  return (
    <div aria-live="polite" className="flex flex-col gap-2 mb-4">
      {entries.map(([studentId, stepN]) => {
        const student = students.find(s => s.id === studentId)
        const name = student?.displayName || studentId
        return (
          <div
            key={studentId}
            role="alert"
            className="flex items-center justify-between bg-amber-50 border border-help rounded-lg px-4 py-3"
          >
            <span className="font-semibold text-amber-800">
              {name} needs help — Step {stepN}
            </span>
            <button
              onClick={() => onClear(studentId)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-amber-700 hover:text-amber-900 text-xl font-bold rounded"
              aria-label={`Clear help request for ${name}`}
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
