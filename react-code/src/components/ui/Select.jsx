
export default function Select({ value, onChange, options, className = '' }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`bg-white/4 border border-white/8 rounded-md px-3 py-1.5 text-sm text-zinc-300 outline-none focus:border-indigo-500/60 cursor-pointer transition ${className}`}
    >
      {options.map(o => <option key={o.value} value={o.value} className="bg-zinc-900">{o.label}</option>)}
    </select>
  )
}