import React from 'react'
import * as Collapsible from '@radix-ui/react-collapsible'

export function AmbiguousTerms({ terms, defaultOpen = false }) {
  const [open, setOpen] = React.useState(defaultOpen)

  if (!terms || terms.length === 0) return null

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
            UNCLEAR TERMS
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
        <div className="mt-1 border border-border rounded-lg overflow-hidden">
          {terms.map((t, i) => (
            <div
              key={i}
              className={`flex gap-2 px-4 py-3 ${i < terms.length - 1 ? 'border-b border-border' : ''}`}
            >
              <span className="font-bold text-primary flex-shrink-0">{t.term}</span>
              <span className="text-muted">→</span>
              <span className="text-primary">{t.plain}</span>
            </div>
          ))}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
