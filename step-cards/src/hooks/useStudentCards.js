import { useState, useCallback } from 'react'
import { loadStudents, saveStudents } from '../utils/storage'
import { getRoutineKey, getFadedSteps } from '../utils/fadingRule'

export function useStudentCards() {
  const [students, setStudents] = useState(loadStudents)
  const [helpRequests, setHelpRequests] = useState({}) // { studentId: stepN }

  const getStudentSteps = useCallback((student, enrichedSteps, instructionSummary) => {
    const key = getRoutineKey(instructionSummary)
    const count = student.completionHistory?.[key] || 0
    return getFadedSteps(enrichedSteps, count)
  }, [])

  const markStepHelp = useCallback((studentId, stepN) => {
    setHelpRequests(prev => ({ ...prev, [studentId]: stepN }))
  }, [])

  const clearHelpRequest = useCallback((studentId) => {
    setHelpRequests(prev => { const n = { ...prev }; delete n[studentId]; return n })
  }, [])

  const recordCompletion = useCallback((studentId, instructionSummary) => {
    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id !== studentId) return s
        const key = getRoutineKey(instructionSummary)
        return {
          ...s,
          completionHistory: {
            ...s.completionHistory,
            [key]: (s.completionHistory?.[key] || 0) + 1
          }
        }
      })
      saveStudents(updated)
      return updated
    })
  }, [])

  return { students, helpRequests, getStudentSteps, markStepHelp, clearHelpRequest, recordCompletion }
}
