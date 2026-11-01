import React from 'react'

export function LoadingDots() {
  return (
    <div aria-live="polite" role="status" className="flex flex-col items-center gap-3 py-8">
      <div className="flex gap-2 items-center justify-center">
        <div
          className="w-3 h-3 rounded-full bg-muted animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <div
          className="w-3 h-3 rounded-full bg-muted animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <div
          className="w-3 h-3 rounded-full bg-muted animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </div>
      <p className="text-muted text-sm">Working on it...</p>
    </div>
  )
}
