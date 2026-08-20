export default function Btn({loading, variant = 'primary', size = 'sm', onClick, children, className = '', disabled = false }) {
  const v = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    secondary: 'bg-white/6 hover:bg-white/10 text-zinc-200 border border-white/8',
    danger: 'bg-red-600/90 hover:bg-red-500 text-white',
    ghost: 'hover:bg-white/6 text-zinc-400 hover:text-zinc-200',
  }[variant]
  const s = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`${v} ${s} rounded-md font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed ${className}`}
    >
    {loading? "Loading ...": children }
      
    </button>
  )
}
