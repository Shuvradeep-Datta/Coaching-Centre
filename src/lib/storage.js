// localStorage-backed persistence for the whole portal.

const KEYS = {
  students: 'smp.students',
  fees: 'smp.fees',
  attendance: 'smp.attendance',
  settings: 'smp.settings',
}

export const DEFAULT_SETTINGS = {
  schoolName: 'My School',
  monthlyFee: 500,
  countryCode: '91',
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Failed to save', key, e)
  }
}

export function loadAll() {
  return {
    students: read(KEYS.students, []),
    fees: read(KEYS.fees, {}),
    attendance: read(KEYS.attendance, {}),
    settings: { ...DEFAULT_SETTINGS, ...read(KEYS.settings, {}) },
  }
}

export function saveStudents(v) { write(KEYS.students, v) }
export function saveFees(v) { write(KEYS.fees, v) }
export function saveAttendance(v) { write(KEYS.attendance, v) }
export function saveSettings(v) { write(KEYS.settings, v) }

export function saveAll(data) {
  saveStudents(data.students || [])
  saveFees(data.fees || {})
  saveAttendance(data.attendance || {})
  saveSettings({ ...DEFAULT_SETTINGS, ...(data.settings || {}) })
}
