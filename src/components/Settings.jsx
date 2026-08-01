import { useRef, useState } from 'react'
import { Card, SectionTitle, Field, TextInput } from './ui'
import { buildCsv, downloadFile, isoDate } from '../lib/utils'

export default function Settings({ students, fees, attendance, settings, setSettings, restoreAll }) {
  const [draft, setDraft] = useState(settings)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef(null)

  function set(field, value) {
    setDraft((d) => ({ ...d, [field]: value }))
    setSaved(false)
  }

  function save(e) {
    e.preventDefault()
    setSettings({
      schoolName: draft.schoolName.trim() || 'My School',
      monthlyFee: Number(draft.monthlyFee) || 0,
      countryCode: String(draft.countryCode).replace(/\D/g, '') || '91',
    })
    setSaved(true)
  }

  function exportCsv() {
    const csv = buildCsv({ students, fees })
    downloadFile(`students-fees-${isoDate()}.csv`, csv, 'text/csv;charset=utf-8')
  }

  function exportBackup() {
    const data = { students, fees, attendance, settings, exportedAt: new Date().toISOString() }
    downloadFile(`portal-backup-${isoDate()}.json`, JSON.stringify(data, null, 2), 'application/json')
  }

  function onRestoreFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (!confirm('This will REPLACE all current students, fees and attendance with the backup. Continue?')) {
          if (fileRef.current) fileRef.current.value = ''
          return
        }
        restoreAll(data)
        if (data.settings) setDraft((d) => ({ ...d, ...data.settings }))
        alert('Backup restored successfully.')
      } catch {
        alert('Could not read that file — is it a valid backup .json?')
      } finally {
        if (fileRef.current) fileRef.current.value = ''
      }
    }
    reader.readAsText(file)
  }

  const btn = 'rounded-md px-4 py-2 text-sm font-medium text-white'

  return (
    <div>
      <SectionTitle title="Settings" subtitle="School details, defaults, and data backup." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-heading text-lg font-semibold text-teal-dark">School details</h3>
          <form onSubmit={save} className="grid gap-3">
            <Field label="School name">
              <TextInput value={draft.schoolName} onChange={(e) => set('schoolName', e.target.value)} />
            </Field>
            <Field label="Default monthly fee (₹)">
              <TextInput type="number" value={draft.monthlyFee} onChange={(e) => set('monthlyFee', e.target.value)} />
            </Field>
            <Field label="Country code (for phone)">
              <TextInput value={draft.countryCode} onChange={(e) => set('countryCode', e.target.value)} placeholder="91" />
            </Field>
            <div className="flex items-center gap-3">
              <button type="submit" className={btn + ' bg-teal hover:bg-teal-dark'}>Save settings</button>
              {saved && <span className="text-sm text-paid">✓ Saved</span>}
            </div>
          </form>
        </Card>

        <Card>
          <h3 className="mb-1 font-heading text-lg font-semibold text-teal-dark">Data & backup</h3>
          <p className="mb-4 text-sm text-slate-500">
            All data lives in this browser only. Export regularly to avoid losing it.
          </p>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700">Export CSV</p>
              <p className="mb-2 text-xs text-slate-400">Student list + fee records, opens in Excel (UTF-8, Bengali/₹ safe).</p>
              <button onClick={exportCsv} className={btn + ' bg-amber text-teal-dark hover:opacity-90'}>Download CSV</button>
            </div>

            <div className="border-t border-cardborder pt-4">
              <p className="text-sm font-medium text-slate-700">Full backup</p>
              <p className="mb-2 text-xs text-slate-400">Download everything as a .json file.</p>
              <button onClick={exportBackup} className={btn + ' bg-teal hover:bg-teal-dark'}>Download backup (.json)</button>
            </div>

            <div className="border-t border-cardborder pt-4">
              <p className="text-sm font-medium text-slate-700">Restore backup</p>
              <p className="mb-2 text-xs text-slate-400">Upload a .json backup to replace all current data.</p>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                onChange={onRestoreFile}
                className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-unpaid file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90"
              />
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <h3 className="mb-2 font-heading text-lg font-semibold text-teal-dark">Current data</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div><p className="font-heading text-2xl font-bold text-teal">{students.length}</p><p className="text-xs text-slate-500">students</p></div>
          <div><p className="font-heading text-2xl font-bold text-teal">{Object.keys(fees).length}</p><p className="text-xs text-slate-500">fee records</p></div>
          <div><p className="font-heading text-2xl font-bold text-teal">{Object.keys(attendance).length}</p><p className="text-xs text-slate-500">attendance days</p></div>
        </div>
      </Card>
    </div>
  )
}
