import { useState } from 'react'
import { Card, SectionTitle, ClassPills, Badge, Field, inputCls } from './ui'
import {
  currentMonth, monthLabel, rupee, feeKey, sortStudents,
  fullPhone, reminderMessage, whatsappUrl, smsUrl,
} from '../lib/utils'

export default function Fees({ students, fees, setFees, settings }) {
  const [month, setMonth] = useState(currentMonth())
  const [filter, setFilter] = useState('all')

  const visible = sortStudents(
    students.filter((s) => filter === 'all' || s.className === filter)
  )

  function recordFor(s) {
    return fees[feeKey(s.id, month)] || { paid: false, amount: settings.monthlyFee }
  }

  function updateRecord(s, patch) {
    const key = feeKey(s.id, month)
    setFees((prev) => {
      const existing = prev[key] || { paid: false, amount: settings.monthlyFee }
      return { ...prev, [key]: { ...existing, ...patch } }
    })
  }

  function togglePaid(s) {
    const rec = recordFor(s)
    updateRecord(s, { paid: !rec.paid, amount: Number(rec.amount) || settings.monthlyFee })
  }

  function setAmount(s, value) {
    updateRecord(s, { amount: value === '' ? '' : Number(value) })
  }

  function reminderLinks(s) {
    const rec = recordFor(s)
    const number = fullPhone(s.phone, settings.countryCode)
    const msg = reminderMessage({
      guardian: s.guardianName || 'Guardian',
      student: s.name,
      className: s.className,
      roll: s.roll,
      month,
      amount: Number(rec.amount) || 0,
      schoolName: settings.schoolName,
    })
    return { number, wa: whatsappUrl(number, msg), sms: smsUrl(number, msg) }
  }

  const paidCount = visible.filter((s) => recordFor(s).paid).length

  return (
    <div>
      <SectionTitle title="Fees" subtitle="Record payments and send reminders to unpaid guardians." />

      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Month">
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className={inputCls} />
          </Field>
          <div>
            <span className="mb-1 block text-sm font-medium text-slate-600">Class</span>
            <ClassPills value={filter} onChange={setFilter} />
          </div>
        </div>
        <Badge tone="paid">{paidCount}/{visible.length} paid — {monthLabel(month)}</Badge>
      </div>

      <div className="mb-3 rounded-md border border-amber/40 bg-amber/10 px-3 py-2 text-xs text-slate-600">
        ℹ️ The browser can't auto-send SMS. The reminder buttons just open WhatsApp / your phone's
        messaging app with the message pre-filled — you still tap <b>Send</b> yourself.
      </div>

      <Card className="p-0">
        <div className="scroll-x">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-cardborder bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Roll</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Amount (₹)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Reminder</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((s) => {
                const rec = recordFor(s)
                const links = reminderLinks(s)
                return (
                  <tr key={s.id} className="border-b border-cardborder/60 last:border-0 hover:bg-slate-50/60">
                    <td className="px-4 py-3">{s.className}</td>
                    <td className="px-4 py-3">{s.roll}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{s.name}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={rec.amount}
                        onChange={(e) => setAmount(s, e.target.value)}
                        className="w-24 rounded-md border border-cardborder px-2 py-1 text-sm outline-none focus:border-teal"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => togglePaid(s)}
                        className={
                          'rounded-full px-3 py-1 text-xs font-semibold transition-colors ' +
                          (rec.paid ? 'bg-paid text-white' : 'bg-unpaid text-white')
                        }
                        title="Toggle paid / unpaid"
                      >
                        {rec.paid ? '✓ Paid' : '✕ Unpaid'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {rec.paid ? (
                        <span className="text-xs text-slate-400">—</span>
                      ) : links.number ? (
                        <div className="inline-flex gap-1.5">
                          <a href={links.wa} target="_blank" rel="noreferrer"
                            className="rounded-md bg-[#25D366] px-2.5 py-1 text-xs font-medium text-white hover:opacity-90">
                            WhatsApp
                          </a>
                          <a href={links.sms}
                            className="rounded-md bg-teal px-2.5 py-1 text-xs font-medium text-white hover:bg-teal-dark">
                            SMS
                          </a>
                        </div>
                      ) : (
                        <span className="text-xs text-amber" title="Add a phone number for this student">no phone</span>
                      )}
                    </td>
                  </tr>
                )
              })}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">No students for this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
