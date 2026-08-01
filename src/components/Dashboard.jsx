import { Card, SectionTitle } from './ui'
import { CLASSES, currentMonth, monthLabel, rupee, feeKey } from '../lib/utils'

function StatCard({ label, value, tone = 'teal', hint }) {
  const bar = {
    teal: 'bg-teal',
    paid: 'bg-paid',
    unpaid: 'bg-unpaid',
    amber: 'bg-amber',
  }[tone]
  return (
    <Card className="relative overflow-hidden">
      <div className={'absolute left-0 top-0 h-full w-1.5 ' + bar} />
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 font-heading text-3xl font-bold text-teal-dark">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </Card>
  )
}

export default function Dashboard({ students, fees, settings, onNavigate }) {
  const month = currentMonth()

  let paidCount = 0
  let collected = 0
  const unpaidStudents = []
  students.forEach((s) => {
    const rec = fees[feeKey(s.id, month)]
    if (rec && rec.paid) {
      paidCount += 1
      collected += Number(rec.amount) || 0
    } else {
      unpaidStudents.push(s)
    }
  })

  const perClass = CLASSES.map((c) => ({
    className: c,
    count: students.filter((s) => s.className === c).length,
  }))
  const maxCount = Math.max(1, ...perClass.map((p) => p.count))

  return (
    <div>
      <SectionTitle title="Dashboard" subtitle={`Overview for ${monthLabel(month)}`} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total students" value={students.length} tone="teal" />
        <StatCard label="Fee paid (this month)" value={paidCount} tone="paid" />
        <StatCard label="Fee pending (this month)" value={unpaidStudents.length} tone="unpaid" />
        <StatCard label="Collected (this month)" value={rupee(collected)} tone="amber" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="font-heading text-lg font-semibold text-teal-dark">Students per class</h3>
          <div className="mt-4 flex h-52 items-end gap-3">
            {perClass.map((p) => (
              <div key={p.className} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-sm font-semibold text-teal">{p.count}</span>
                <div className="flex w-full items-end justify-center" style={{ height: '150px' }}>
                  <div
                    className="w-full max-w-12 rounded-t-md bg-teal transition-all"
                    style={{ height: `${(p.count / maxCount) * 100}%`, minHeight: p.count ? '4px' : '0' }}
                  />
                </div>
                <span className="text-xs text-slate-500">Class {p.className}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className={unpaidStudents.length ? 'border-unpaid/40 bg-unpaid/5' : 'border-paid/40 bg-paid/5'}>
          <h3 className="font-heading text-lg font-semibold text-teal-dark">Fee alerts</h3>
          {unpaidStudents.length === 0 ? (
            <p className="mt-3 text-sm text-paid">
              All {students.length} student(s) have paid {monthLabel(month)}'s fee. 🎉
            </p>
          ) : (
            <>
              <p className="mt-3 text-sm text-slate-600">
                <span className="font-heading text-3xl font-bold text-unpaid">{unpaidStudents.length}</span>
                <br />
                student(s) haven't paid {monthLabel(month)}'s fee.
              </p>
              <ul className="mt-3 max-h-32 space-y-1 overflow-y-auto text-sm text-slate-600">
                {unpaidStudents.slice(0, 8).map((s) => (
                  <li key={s.id}>• {s.name} <span className="text-slate-400">(Class {s.className})</span></li>
                ))}
                {unpaidStudents.length > 8 && (
                  <li className="text-slate-400">…and {unpaidStudents.length - 8} more</li>
                )}
              </ul>
              <button
                onClick={() => onNavigate('fees')}
                className="mt-3 rounded-md bg-unpaid px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
              >
                Go to Fees →
              </button>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
