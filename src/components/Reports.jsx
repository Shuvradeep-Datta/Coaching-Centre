import { useState } from 'react'
import { Card, SectionTitle, ClassPills } from './ui'
import { monthLabel, rupee, feeKey, feeMonths, sortStudents } from '../lib/utils'

function attendanceFor(studentId, attendance) {
  let present = 0
  let total = 0
  Object.values(attendance).forEach((day) => {
    const mark = day[studentId]
    if (mark === 'P') { present += 1; total += 1 }
    else if (mark === 'A') { total += 1 }
  })
  return { present, total }
}

function AttendanceBar({ present, total }) {
  if (total === 0) {
    return <span className="text-xs text-slate-400">no data</span>
  }
  const pct = Math.round((present / total) * 100)
  const color = pct >= 75 ? 'bg-paid' : pct >= 50 ? 'bg-amber' : 'bg-unpaid'
  return (
    <div className="flex items-center gap-2">
      <div className="h-2.5 w-28 overflow-hidden rounded-full bg-slate-100">
        <div className={'h-full ' + color} style={{ width: pct + '%' }} />
      </div>
      <span className="text-xs font-semibold text-slate-600">{pct}%</span>
      <span className="text-xs text-slate-400">({present}/{total})</span>
    </div>
  )
}

export default function Reports({ students, fees, attendance }) {
  const [filter, setFilter] = useState('all')

  const inClass = students.filter((s) => filter === 'all' || s.className === filter)
  const classIds = new Set(inClass.map((s) => s.id))

  // month-wise fee collection, restricted to the selected class
  const months = feeMonths(fees)
  const monthRows = months.map((month) => {
    let amount = 0, paid = 0, pending = 0
    inClass.forEach((s) => {
      const rec = fees[feeKey(s.id, month)]
      if (rec && rec.paid) { paid += 1; amount += Number(rec.amount) || 0 }
      else if (rec) { pending += 1 }
    })
    return { month, amount, paid, pending }
  }).filter((r) => r.paid || r.pending)

  const grandTotal = monthRows.reduce((sum, r) => sum + r.amount, 0)

  const attRows = sortStudents(inClass).map((s) => ({ s, ...attendanceFor(s.id, attendance) }))

  return (
    <div>
      <SectionTitle title="Reports" subtitle="Fee collection and attendance summaries." />

      <div className="mb-4">
        <span className="mb-1 block text-sm font-medium text-slate-600">Class</span>
        <ClassPills value={filter} onChange={setFilter} />
      </div>

      <Card className="mb-4 p-0">
        <h3 className="px-4 pt-4 font-heading text-lg font-semibold text-teal-dark">Fee collection (month-wise)</h3>
        <div className="scroll-x mt-3">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-y border-cardborder bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3 text-right">Collected</th>
                <th className="px-4 py-3 text-right">Paid</th>
                <th className="px-4 py-3 text-right">Pending</th>
              </tr>
            </thead>
            <tbody>
              {monthRows.map((r) => (
                <tr key={r.month} className="border-b border-cardborder/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-700">{monthLabel(r.month)}</td>
                  <td className="px-4 py-3 text-right">{rupee(r.amount)}</td>
                  <td className="px-4 py-3 text-right text-paid">{r.paid}</td>
                  <td className="px-4 py-3 text-right text-unpaid">{r.pending}</td>
                </tr>
              ))}
              {monthRows.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">No fee records yet.</td></tr>
              )}
            </tbody>
            {monthRows.length > 0 && (
              <tfoot>
                <tr className="border-t border-cardborder bg-slate-50 font-semibold text-teal-dark">
                  <td className="px-4 py-3">Total collected</td>
                  <td className="px-4 py-3 text-right">{rupee(grandTotal)}</td>
                  <td className="px-4 py-3" colSpan={2}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>

      <Card className="p-0">
        <h3 className="px-4 pt-4 font-heading text-lg font-semibold text-teal-dark">Attendance percentage</h3>
        <div className="scroll-x mt-3">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-y border-cardborder bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Roll</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {attRows.map(({ s, present, total }) => (
                <tr key={s.id} className="border-b border-cardborder/60 last:border-0">
                  <td className="px-4 py-3">{s.className}</td>
                  <td className="px-4 py-3">{s.roll}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{s.name}</td>
                  <td className="px-4 py-3"><AttendanceBar present={present} total={total} /></td>
                </tr>
              ))}
              {attRows.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">No students for this filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
