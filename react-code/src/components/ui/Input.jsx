export default function Input({ placeholder, value, onChange, className = '', type = 'text', error = '' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`bg-white/4 border rounded-md px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:ring-1 transition ${error ? 'border-red-500/60 focus:border-red-500/60 focus:ring-red-500/30' : 'border-white/8 focus:border-indigo-500/60 focus:ring-indigo-500/30'} ${className}`}
    />
  )
}
