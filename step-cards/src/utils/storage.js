import { STUDENTS as DEFAULT_STUDENTS } from '../data/students'

export const KEYS = {
  STUDENTS: 'stepCards_students_v1',
  SHIFT_LOG: 'stepCards_shiftLog_v1',
  PREFS: 'stepCards_prefs_v1',
}

export const DEFAULT_PREFS = {
  fontSize: 'medium',
  calmMode: false,
  pictogramOnly: false,
  ambiguousSectionSeen: false,
}

export function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    // storage unavailable or quota exceeded — fail silently
  }
}

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveStudents(students) {
  save(KEYS.STUDENTS, students)
}

export function loadStudents() {
  return load(KEYS.STUDENTS, DEFAULT_STUDENTS)
}

export function savePrefs(prefs) {
  save(KEYS.PREFS, prefs)
}

export function loadPrefs() {
  return load(KEYS.PREFS, DEFAULT_PREFS)
}

export function addShiftLogEntry(entry) {
  const existing = loadShiftLog()
  const updated = [entry, ...existing].slice(0, 100)
  save(KEYS.SHIFT_LOG, updated)
}

export function loadShiftLog() {
  return load(KEYS.SHIFT_LOG, [])
}
