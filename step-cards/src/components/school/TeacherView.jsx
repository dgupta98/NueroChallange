import React, { useState } from 'react'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { useStudentCards } from '../../hooks/useStudentCards'
import { breakInstruction } from '../../api/breakInstruction'
import { rewriteForStudent } from '../../api/rewriteForStudent'
import { enrichStepsWithPictograms } from '../../api/arasaac'
import { LoadingDots } from '../shared/LoadingDots'
import { HelpNotice } from './HelpNotice'
import { StudentView } from './StudentView'
import { StepCard } from './StepCard'

// States: idle → listening → loading → ready → approved → completed
const PHASE = {
  IDLE: 'idle',
  LISTENING: 'listening',
  LOADING: 'loading',
  READY: 'ready',
  APPROVED: 'approved',
}

export function TeacherView() {
  const [phase, setPhase] = useState(PHASE.IDLE)
  const [textInput, setTextInput] = useState('')
  const [error, setError] = useState(null)
  const [baseResult, setBaseResult] = useState(null) // { instruction_summary, steps }
  const [studentStepsMap, setStudentStepsMap] = useState({}) // { studentId: enriched steps }
  const [activeStudentId, setActiveStudentId] = useState(null)

  const {
    transcript, listening, error: speechError,
    isSupported, startListening, stopListening, setTranscript,
  } = useSpeechRecognition()

  const { students, helpRequests, getStudentSteps, markStepHelp, clearHelpRequest, recordCompletion } = useStudentCards()

  async function handleBreak() {
    const instruction = transcript || textInput
    if (!instruction.trim()) return
    setError(null)
    setPhase(PHASE.LOADING)
    try {
      const base = await breakInstruction(instruction)
      // Rewrite for each student in parallel
      const rewrites = await Promise.all(
        students.map(s => rewriteForStudent(base, s))
      )
      // Enrich with pictograms per student
      const enriched = await Promise.all(
        rewrites.map(r => enrichStepsWithPictograms(r.steps).then(steps => ({ studentId: r.student_id, steps })))
      )
      const map = {}
      enriched.forEach(({ studentId, steps }) => { map[studentId] = steps })
      setBaseResult(base)
      setStudentStepsMap(map)
      setActiveStudentId(students[0]?.id || null)
      setPhase(PHASE.READY)
    } catch (e) {
      setError(e.message)
      setPhase(PHASE.IDLE)
    }
  }

  function handleMic() {
    if (listening) {
      stopListening()
    } else {
      startListening()
    }
  }

  function handleApprove() {
    setPhase(PHASE.APPROVED)
  }

  function handleStudentComplete(studentId, instructionSummary) {
    recordCompletion(studentId, instructionSummary)
  }

  function getStudentFadedSteps(student) {
    const enrichedSteps = studentStepsMap[student.id] || []
    return getStudentSteps(student, enrichedSteps, baseResult?.instruction_summary || '')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Mic / input area */}
      {phase === PHASE.IDLE || phase === PHASE.LOADING ? (
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold">Speak an instruction</h2>

          {!isSupported && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-help rounded-lg px-4 py-2">
              Voice input is not supported in this browser. Type the instruction below.
            </p>
          )}

          <div className="flex gap-2">
            {isSupported && (
              <button
                onClick={handleMic}
                className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded-lg font-bold transition-colors ${
                  listening
                    ? 'bg-red-500 text-white'
                    : 'bg-btn-secondary text-primary hover:bg-gray-200'
                }`}
                aria-label={listening ? 'Stop listening' : 'Start listening'}
              >
                {listening ? '⏹ Stop' : '🎤 Speak'}
              </button>
            )}
            <input
              type="text"
              value={transcript || textInput}
              onChange={e => {
                setTranscript('')
                setTextInput(e.target.value)
              }}
              placeholder="Or type the instruction here..."
              className="flex-1 min-h-[44px] border border-border rounded-lg px-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-active"
            />
          </div>

          {(transcript || textInput) && (
            <p className="text-sm text-muted italic">
              "{transcript || textInput}"
            </p>
          )}

          <button
            onClick={handleBreak}
            disabled={phase === PHASE.LOADING || !(transcript || textInput).trim()}
            className="min-h-[44px] px-6 py-2 bg-btn-primary text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-start"
          >
            Break it into steps
          </button>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          {phase === PHASE.LOADING && <LoadingDots />}
        </div>
      ) : null}

      {/* Teacher review */}
      {phase === PHASE.READY && baseResult && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{baseResult.instruction_summary}</h2>
            <button
              onClick={() => { setPhase(PHASE.IDLE); setTranscript(''); setTextInput('') }}
              className="min-h-[44px] px-4 py-2 bg-btn-secondary text-primary rounded-lg text-sm hover:bg-gray-200"
            >
              Start over
            </button>
          </div>

          {/* Student column tabs */}
          <div className="flex gap-2 border-b border-border pb-2">
            {students.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveStudentId(s.id)}
                className={`min-h-[44px] px-4 py-2 rounded-t-lg font-bold text-sm transition-colors ${
                  activeStudentId === s.id
                    ? 'bg-primary text-white'
                    : 'bg-btn-secondary text-primary hover:bg-gray-200'
                }`}
              >
                {s.displayName}
              </button>
            ))}
          </div>

          {/* Preview steps for active student */}
          {students.filter(s => s.id === activeStudentId).map(student => (
            <div key={student.id} className="grid gap-3">
              {(studentStepsMap[student.id] || []).map(step => (
                <StepCard
                  key={step.n}
                  step={step}
                  isDone={false}
                  isActive={false}
                  studentName={student.displayName}
                  onDone={() => {}}
                  onHelp={() => {}}
                />
              ))}
            </div>
          ))}

          <button
            onClick={handleApprove}
            className="min-h-[44px] px-8 py-2 bg-btn-primary text-white rounded-lg font-bold hover:bg-blue-700 transition-colors self-start"
          >
            Approve &amp; send to students
          </button>
        </div>
      )}

      {/* Approved — student view */}
      {phase === PHASE.APPROVED && baseResult && (
        <div className="flex flex-col gap-4">
          <HelpNotice
            helpRequests={helpRequests}
            students={students}
            onClear={clearHelpRequest}
          />

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{baseResult.instruction_summary}</h2>
            <button
              onClick={() => { setPhase(PHASE.IDLE); setTranscript(''); setTextInput('') }}
              className="min-h-[44px] px-4 py-2 bg-btn-secondary text-primary rounded-lg text-sm hover:bg-gray-200"
            >
              New instruction
            </button>
          </div>

          {/* Student tabs */}
          <div className="flex gap-2 border-b border-border pb-2">
            {students.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveStudentId(s.id)}
                className={`min-h-[44px] px-4 py-2 rounded-t-lg font-bold text-sm transition-colors ${
                  activeStudentId === s.id
                    ? 'bg-primary text-white'
                    : 'bg-btn-secondary text-primary hover:bg-gray-200'
                }`}
              >
                {s.displayName}
                {helpRequests[s.id] && (
                  <span className="ml-2 text-help">!</span>
                )}
              </button>
            ))}
          </div>

          {/* Active student view */}
          {students.filter(s => s.id === activeStudentId).map(student => (
            <StudentView
              key={student.id}
              student={student}
              steps={getStudentFadedSteps(student)}
              instructionSummary={baseResult.instruction_summary}
              onComplete={handleStudentComplete}
              onHelp={markStepHelp}
            />
          ))}
        </div>
      )}
    </div>
  )
}
