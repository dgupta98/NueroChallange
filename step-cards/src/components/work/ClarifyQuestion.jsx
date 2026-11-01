import React from 'react'
import * as Collapsible from '@radix-ui/react-collapsible'

export function ClarifyQuestion({ question }) {
  const [open, setOpen] = React.useState(false)

  if (!question) return null

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger asChild>
        <button
          className="flex items-center justify-between w-full min-h-[44px] px-4 py-3 bg-btn-secondary rounded-lg hover:bg-gray-200 transition-colors"
          aria-expanded={open}
        >
          <span
            className="text-muted text-sm font-bold tracking-widest"
            style={{ fontVariant: 'small-caps' }}
          >
            IF SOMETHING IS STILL UNCLEAR
          </span>
          <span
            className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            ▾
          </span>
        </button>
      </Collapsible.Trigger>

      <Collapsible.Content>
        <div className="mt-1 border border-border rounded-lg px-4 py-3">
          <p className="text-primary">
            You could ask: <span className="italic">"{question}"</span>
          </p>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
