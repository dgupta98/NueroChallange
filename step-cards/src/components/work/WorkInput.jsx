import React from 'react'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'

export function WorkInput({ onSubmit }) {
  const {
    transcript, listening, isSupported,
    startListening, stopListening, setTranscript,
  } = useSpeechRecognition()

  const [text, setTextState] = React.useState('')

  const value = transcript || text

  function handleChange(e) {
    setTranscript('')
    setTextState(e.target.value)
  }

  function handleMic() {
    if (listening) {
      stopListening()
    } else {
      startListening()
    }
  }

  function handleSubmit() {
    if (value.trim()) onSubmit(value.trim())
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">What did your manager just say?</h2>

      <textarea
        value={value}
        onChange={handleChange}
        placeholder="Type or speak the instruction..."
        rows={4}
        className="w-full border border-border rounded-lg px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-active resize-none"
        style={{ fontSize: 'var(--font-body)' }}
      />

      <div className="flex gap-3 flex-wrap">
        {isSupported && (
          <button
            onClick={handleMic}
            className={`min-h-[44px] px-4 py-2 rounded-lg font-bold transition-colors ${
              listening
                ? 'bg-red-500 text-white'
                : 'bg-btn-secondary text-primary hover:bg-gray-200'
            }`}
            aria-label={listening ? 'Stop speaking' : 'Speak instruction'}
          >
            {listening ? '⏹ Stop' : '🎤 Or speak it'}
          </button>
        )}

        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="min-h-[44px] px-8 py-2 bg-btn-primary text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Break it down
        </button>
      </div>
    </div>
  )
}
