import { useState } from 'react'
import { Card, SectionTitle, Badge, Field, ClassSelect, inputCls } from './ui'
import { isoDate, sortStudents } from '../lib/utils'

export default function Attendance({ students, attendance, setAttendance }) {
  const [className, setClassName] = useState('5')
  const [date, setDate] = useState(isoDate())

  const dayRecord = attendance[date] || {}
  const classStudents = sortStudents(students.filter((s) => s.className === className))

  function statusOf(s) {
    return dayRecord[s.id] || null // "P" | "A" | null
  }

  function mark(s, status) {
    setAttendance((prev) => {
      const day = { ...(prev[date] || {}) }
      if (day[s.id] === status) delete day[s.id] // tapping the active one clears it
      else day[s.id] = status
      return { ...prev, [date]: day }
    })
  }

  function markAll(status) {
    setAttendance((prev) => {
      const day = { ...(prev[date] || {}) }
      classStudents.forEach((s) => { day[s.id] = status })
      return { ...prev, [date]: day }
    })
  }

  const present = classStudents.filter((s) => statusOf(s) === 'P').length

  return (
    <div>
      <SectionTitle title="Attendance" subtitle="Mark daily attendance per class." />

      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Class">
            <ClassSelect value={className} onChange={(e) => setClassName(e.target.value)} />
          </Field>
          <Field label="Date">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
          </Field>
        </div>
        <Badge tone="paid">Present {present}/{classStudents.length}</Badge>
      </div>

      <div className="mb-3 flex gap-2">
        <button onClick={() => markAll('P')} className="rounded-md bg-paid px-3 py-1.5 text-sm font-medium text-white hover:opacity-90">All present</button>
        <button onClick={() => markAll('A')} className="rounded-md bg-unpaid px-3 py-1.5 text-sm font-medium text-white hover:opacity-90">All absent</button>
      </div>

      <Card className="p-0">
        <div className="scroll-x">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-cardborder bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Roll</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 text-right">Mark</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map((s) => {
                const st = statusOf(s)
                return (
                  <tr key={s.id} className="border-b border-cardborder/60 last:border-0 hover:bg-slate-50/60">
                    <td className="px-4 py-3">{s.roll}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{s.name}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex gap-1.5">
                        <button
                          onClick={() => mark(s, 'P')}
                          className={'rounded-md px-3 py-1 text-xs font-semibold ' + (st === 'P' ? 'bg-paid text-white' : 'border border-cardborder text-slate-500 hover:border-paid hover:text-paid')}
                        >Present</button>
                        <button
                          onClick={() => mark(s, 'A')}
                          className={'rounded-md px-3 py-1 text-xs font-semibold ' + (st === 'A' ? 'bg-unpaid text-white' : 'border border-cardborder text-slate-500 hover:border-unpaid hover:text-unpaid')}
                        >Absent</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {classStudents.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-400">No students in Class {className}.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
