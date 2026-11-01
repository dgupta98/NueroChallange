import React from 'react'

export function CompletionScreen({ message = 'Done.', subtext }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <p className="text-4xl font-bold text-primary">{message}</p>
      {subtext && <p className="text-muted text-center">{subtext}</p>}
    </div>
  )
}
