import { useState, useCallback } from 'react'
import { loadShiftLog, addShiftLogEntry } from '../utils/storage'

export function useShiftLog() {
  const [log, setLog] = useState(loadShiftLog)

  const addEntry = useCallback((instructionSummary, stepCount) => {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      instructionSummary,
      stepCount,
      note: '',
    }
    addShiftLogEntry(entry)
    setLog(loadShiftLog())
    return entry
  }, [])

  return { log, addEntry }
}
