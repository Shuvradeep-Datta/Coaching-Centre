import { useState } from 'react'
import { Card, SectionTitle, ClassPills, Field, TextInput, ClassSelect } from './ui'
import { CLASSES, uid, sortStudents, nextSerial } from '../lib/utils'

const EMPTY = { name: '', roll: '', className: '5', guardianName: '', phone: '' }

export default function Students({ students, setStudents }) {
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  // Auto Sl No. for a new student; while editing we keep the student's own roll.
  const autoRoll = nextSerial(students)
  const slNo = editingId ? form.roll : autoRoll

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function submit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    if (editingId) {
      setStudents((list) => list.map((s) => (s.id === editingId ? { ...s, ...form } : s)))
    } else {
      setStudents((list) => [...list, { id: uid(), ...form, roll: autoRoll }])
    }
    setForm(EMPTY)
    setEditingId(null)
  }

  function edit(s) {
    setEditingId(s.id)
    setForm({ name: s.name, roll: s.roll, className: s.className, guardianName: s.guardianName, phone: s.phone })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function remove(s) {
    if (!confirm(`Delete ${s.name}? This does not remove their past fee/attendance records.`)) return
    setStudents((list) => list.filter((x) => x.id !== s.id))
    if (editingId === s.id) { setForm(EMPTY); setEditingId(null) }
  }

  const q = search.trim().toLowerCase()
  const visible = sortStudents(
    students.filter((s) => {
      if (filter !== 'all' && s.className !== filter) return false
      if (!q) return true
      return (
        s.name.toLowerCase().includes(q) ||
        String(s.roll).toLowerCase().includes(q) ||
        (s.guardianName || '').toLowerCase().includes(q)
      )
    })
  )

  return (
    <div>
      <SectionTitle title="Students" subtitle="Add, edit and manage the student master list." />

      <Card className="mb-4">
        <h3 className="mb-3 font-heading text-lg font-semibold text-teal-dark">
          {editingId ? 'Edit student' : 'Add a student'}
        </h3>
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Name">
            <TextInput value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name" required />
          </Field>
          <Field label="Sl no.">
            <TextInput
              value={slNo}
              readOnly
              tabIndex={-1}
              title="Auto-generated serial number"
              className="cursor-not-allowed bg-slate-50 text-slate-500"
            />
          </Field>
          <Field label="Class">
            <ClassSelect value={form.className} onChange={(e) => set('className', e.target.value)} />
          </Field>
          <Field label="Guardian name">
            <TextInput value={form.guardianName} onChange={(e) => set('guardianName', e.target.value)} placeholder="Parent / guardian" />
          </Field>
          <Field label="Guardian phone">
            <TextInput value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="10-digit number" inputMode="tel" />
          </Field>
          <div className="flex items-end gap-2">
            <button type="submit" className="rounded-md bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-dark">
              {editingId ? 'Save changes' : 'Add student'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setForm(EMPTY); setEditingId(null) }} className="rounded-md border border-cardborder px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
            )}
          </div>
        </form>
      </Card>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <ClassPills value={filter} onChange={setFilter} />
        <TextInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name / roll / guardian"
          className="max-w-xs"
        />
      </div>

      <Card className="p-0">
        <div className="scroll-x">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-cardborder bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Roll</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Guardian</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((s) => (
                <tr key={s.id} className="border-b border-cardborder/60 last:border-0 hover:bg-slate-50/60">
                  <td className="px-4 py-3">{s.className}</td>
                  <td className="px-4 py-3">{s.roll}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{s.name}</td>
                  <td className="px-4 py-3 text-slate-600">{s.guardianName}</td>
                  <td className="px-4 py-3 text-slate-600">{s.phone}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => edit(s)} className="rounded-md px-2 py-1 text-teal hover:bg-teal/10">Edit</button>
                    <button onClick={() => remove(s)} className="rounded-md px-2 py-1 text-unpaid hover:bg-unpaid/10">Delete</button>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    No students {students.length ? 'match this filter.' : 'yet — add your first one above.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <p className="mt-2 text-xs text-slate-400">{visible.length} student(s) shown.</p>
    </div>
  )
}
