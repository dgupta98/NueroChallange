import React from 'react'

export function ModeToggle({ mode, onChange }) {
  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => onChange('school')}
        className={`min-h-[44px] px-6 py-2 rounded-lg font-bold text-base transition-colors ${
          mode === 'school'
            ? 'bg-primary text-white'
            : 'bg-btn-secondary text-primary hover:bg-gray-200'
        }`}
        aria-pressed={mode === 'school'}
      >
        School
      </button>
      <button
        onClick={() => onChange('work')}
        className={`min-h-[44px] px-6 py-2 rounded-lg font-bold text-base transition-colors ${
          mode === 'work'
            ? 'bg-primary text-white'
            : 'bg-btn-secondary text-primary hover:bg-gray-200'
        }`}
        aria-pressed={mode === 'work'}
      >
        Work
      </button>
    </div>
  )
}
