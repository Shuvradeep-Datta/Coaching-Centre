import { useEffect, useState } from 'react'
import { loadAll, saveStudents, saveFees, saveAttendance, saveSettings } from './lib/storage'
import Dashboard from './components/Dashboard'
import Students from './components/Students'
import Fees from './components/Fees'
import Attendance from './components/Attendance'
import Reports from './components/Reports'
import Settings from './components/Settings'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'students', label: 'Students' },
  { id: 'fees', label: 'Fees' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'reports', label: 'Reports' },
  { id: 'settings', label: 'Settings' },
]

export default function App() {
  const initial = loadAll()
  const [students, setStudents] = useState(initial.students)
  const [fees, setFees] = useState(initial.fees)
  const [attendance, setAttendance] = useState(initial.attendance)
  const [settings, setSettings] = useState(initial.settings)
  const [tab, setTab] = useState('dashboard')

  // persist each slice whenever it changes
  useEffect(() => { saveStudents(students) }, [students])
  useEffect(() => { saveFees(fees) }, [fees])
  useEffect(() => { saveAttendance(attendance) }, [attendance])
  useEffect(() => { saveSettings(settings) }, [settings])

  // replace everything at once (used by Restore backup)
  function restoreAll(data) {
    setStudents(data.students || [])
    setFees(data.fees || {})
    setAttendance(data.attendance || {})
    setSettings((prev) => ({ ...prev, ...(data.settings || {}) }))
  }

  const shared = { students, setStudents, fees, setFees, attendance, setAttendance, settings, setSettings }

  return (
    <div className="min-h-screen bg-bg text-slate-800">
      <header className="sticky top-0 z-20 bg-teal text-white shadow-md">
        <div className="mx-auto max-w-6xl px-4 pt-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-amber font-heading text-lg font-bold text-teal-dark">
              {(settings.schoolName || 'S').trim().charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-heading text-lg leading-tight font-semibold">{settings.schoolName}</h1>
              <p className="text-xs text-white/70">Student Management Portal</p>
            </div>
          </div>
          <nav className="mt-2 flex gap-1 overflow-x-auto scroll-x">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={
                  'shrink-0 rounded-t-md px-4 py-2 text-sm font-medium transition-colors ' +
                  (tab === t.id
                    ? 'bg-bg text-teal'
                    : 'text-white/80 hover:bg-white/10 hover:text-white')
                }
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === 'dashboard' && <Dashboard {...shared} onNavigate={setTab} />}
        {tab === 'students' && <Students {...shared} />}
        {tab === 'fees' && <Fees {...shared} />}
        {tab === 'attendance' && <Attendance {...shared} />}
        {tab === 'reports' && <Reports {...shared} />}
        {tab === 'settings' && <Settings {...shared} restoreAll={restoreAll} />}
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-8 pt-2 text-center text-xs text-slate-400">
        Data is stored locally in this browser. Use Settings → Backup to keep a copy safe.
      </footer>
    </div>
  )
}
