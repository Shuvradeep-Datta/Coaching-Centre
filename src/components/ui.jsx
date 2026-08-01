import { CLASSES } from '../lib/utils'

export function Card({ children, className = '' }) {
  return (
    <div className={'rounded-lg border border-cardborder bg-white p-4 shadow-sm ' + className}>
      {children}
    </div>
  )
}

export function SectionTitle({ title, subtitle, right }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-teal-dark">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}

// Class filter pills. Pass includeAll to add an "All" pill (value = "all").
export function ClassPills({ value, onChange, includeAll = true }) {
  const options = includeAll ? ['all', ...CLASSES] : CLASSES
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={
            'rounded-full border px-3 py-1 text-sm font-medium transition-colors ' +
            (value === c
              ? 'border-teal bg-teal text-white'
              : 'border-cardborder bg-white text-slate-600 hover:border-teal hover:text-teal')
          }
        >
          {c === 'all' ? 'All' : 'Class ' + c}
        </button>
      ))}
    </div>
  )
}

export function Badge({ tone = 'slate', children }) {
  const tones = {
    paid: 'bg-paid/10 text-paid',
    unpaid: 'bg-unpaid/10 text-unpaid',
    slate: 'bg-slate-100 text-slate-600',
    amber: 'bg-amber/15 text-amber',
  }
  return (
    <span className={'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ' + (tones[tone] || tones.slate)}>
      {children}
    </span>
  )
}

const labelCls = 'block text-sm font-medium text-slate-600 mb-1'
const inputCls =
  'w-full rounded-md border border-cardborder bg-white px-3 py-2 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/20'

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  )
}

export function TextInput(props) {
  return <input {...props} className={inputCls + ' ' + (props.className || '')} />
}

export function ClassSelect({ value, onChange, name, id }) {
  return (
    <select id={id} name={name} value={value} onChange={onChange} className={inputCls}>
      {CLASSES.map((c) => (
        <option key={c} value={c}>Class {c}</option>
      ))}
    </select>
  )
}

export { inputCls }
