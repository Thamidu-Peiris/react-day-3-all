export default function Input({ placeholder, value, onChange, className = '', type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`bg-white/4 border border-white/8 rounded-md px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition ${className}`}
    />
  )
}
