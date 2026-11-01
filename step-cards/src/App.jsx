import React, { useState, useEffect } from 'react'
import { ModeToggle } from './components/shared/ModeToggle'
import { LoadingDots } from './components/shared/LoadingDots'
import { CompletionScreen } from './components/shared/CompletionScreen'
import { TeacherView } from './components/school/TeacherView'
import { WorkInput } from './components/work/WorkInput'
import { StepList } from './components/work/StepList'
import { AmbiguousTerms } from './components/work/AmbiguousTerms'
import { ClarifyQuestion } from './components/work/ClarifyQuestion'
import { ShiftLog } from './components/work/ShiftLog'
import { loadPrefs, savePrefs } from './utils/storage'
import { workModeBreak } from './api/workModeBreak'
import { useShiftLog } from './hooks/useShiftLog'

const WORK_PHASE = {
  INPUT: 'input',
  LOADING: 'loading',
  RESULT: 'result',
  DONE: 'done',
}

export default function App() {
  const [mode, setMode] = useState('school')
  const [prefs, setPrefs] = useState(loadPrefs)

  // Work mode state
  const [workPhase, setWorkPhase] = useState(WORK_PHASE.INPUT)
  const [workResult, setWorkResult] = useState(null)
  const [workError, setWorkError] = useState(null)
  const [showLog, setShowLog] = useState(false)

  const { log, addEntry } = useShiftLog()

  // Apply prefs to body
  useEffect(() => {
    document.body.setAttribute('data-fontsize', prefs.fontSize)
    document.body.setAttribute('data-calm', prefs.calmMode ? 'true' : 'false')
  }, [prefs.fontSize, prefs.calmMode])

  function updatePref(key, value) {
    const updated = { ...prefs, [key]: value }
    setPrefs(updated)
    savePrefs(updated)
  }

  async function handleWorkSubmit(instruction) {
    setWorkError(null)
    setWorkPhase(WORK_PHASE.LOADING)
    try {
      const result = await workModeBreak(instruction)
      setWorkResult(result)
      addEntry(result.instruction_summary, result.steps.length)
      setWorkPhase(WORK_PHASE.RESULT)
    } catch (e) {
      setWorkError(e.message)
      setWorkPhase(WORK_PHASE.INPUT)
    }
  }

  function handleWorkDone() {
    setWorkPhase(WORK_PHASE.DONE)
  }

  function handleWorkReset() {
    setWorkPhase(WORK_PHASE.INPUT)
    setWorkResult(null)
    setWorkError(null)
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-primary">Step Cards</h1>
          <ModeToggle mode={mode} onChange={m => { setMode(m); handleWorkReset() }} />
        </header>

        {/* Settings bar */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className="text-muted text-sm">Text size:</span>
          {['small', 'medium', 'large'].map(size => (
            <button
              key={size}
              onClick={() => updatePref('fontSize', size)}
              className={`min-h-[44px] px-3 py-1 rounded text-sm capitalize transition-colors ${
                prefs.fontSize === size
                  ? 'bg-primary text-white'
                  : 'bg-btn-secondary text-primary hover:bg-gray-200'
              }`}
            >
              {size === 'small' ? 'Small' : size === 'medium' ? 'Med' : 'Large'}
            </button>
          ))}
          <button
            onClick={() => updatePref('calmMode', !prefs.calmMode)}
            className={`min-h-[44px] px-3 py-1 rounded text-sm transition-colors ${
              prefs.calmMode
                ? 'bg-primary text-white'
                : 'bg-btn-secondary text-primary hover:bg-gray-200'
            }`}
            aria-pressed={prefs.calmMode}
          >
            Calm mode
          </button>
        </div>

        {/* Main content */}
        <main>
          {mode === 'school' && <TeacherView />}

          {mode === 'work' && (
            <div className="flex flex-col gap-5">
              {workPhase === WORK_PHASE.INPUT && (
                <>
                  <WorkInput onSubmit={handleWorkSubmit} />
                  {workError && (
                    <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                      {workError}
                    </p>
                  )}
                </>
              )}

              {workPhase === WORK_PHASE.LOADING && <LoadingDots />}

              {workPhase === WORK_PHASE.RESULT && workResult && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">{workResult.instruction_summary}</h2>
                    <button
                      onClick={handleWorkReset}
                      className="min-h-[44px] px-4 py-2 bg-btn-secondary text-primary rounded-lg text-sm hover:bg-gray-200"
                    >
                      New instruction
                    </button>
                  </div>

                  <StepList
                    steps={workResult.steps}
                    onAllDone={handleWorkDone}
                  />

                  <AmbiguousTerms
                    terms={workResult.ambiguous_terms}
                    defaultOpen={false}
                  />

                  <ClarifyQuestion question={workResult.clarifying_question} />

                  <button
                    onClick={() => setShowLog(l => !l)}
                    className="min-h-[44px] px-4 py-2 bg-btn-secondary text-primary rounded-lg text-sm hover:bg-gray-200 self-start"
                  >
                    {showLog ? 'Hide' : 'Show'} shift log
                  </button>

                  {showLog && <ShiftLog log={log} onClose={() => setShowLog(false)} />}
                </>
              )}

              {workPhase === WORK_PHASE.DONE && (
                <>
                  <CompletionScreen
                    message="Done."
                    subtext="All steps completed."
                  />
                  <button
                    onClick={handleWorkReset}
                    className="min-h-[44px] px-6 py-2 bg-btn-primary text-white rounded-lg font-bold hover:bg-blue-700 transition-colors self-start"
                  >
                    New instruction
                  </button>
                  <button
                    onClick={() => setShowLog(l => !l)}
                    className="min-h-[44px] px-4 py-2 bg-btn-secondary text-primary rounded-lg text-sm hover:bg-gray-200 self-start"
                  >
                    {showLog ? 'Hide' : 'Show'} shift log
                  </button>
                  {showLog && <ShiftLog log={log} onClose={() => setShowLog(false)} />}
                </>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-4 border-t border-border">
          <p className="text-xs text-muted">
            Pictograms by{' '}
            <a
              href="https://arasaac.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              ARASAAC
            </a>{' '}
            (CC BY-NC-SA). Step Cards — North America AI Challenge 2026.
          </p>
        </footer>
      </div>
    </div>
  )
}
