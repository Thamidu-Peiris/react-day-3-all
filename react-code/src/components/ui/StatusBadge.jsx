export default function StatusBadge({ status }) {
  const map = {
    active: 'bg-emerald-500/12 text-emerald-400 border border-emerald-500/20',
    inactive: 'bg-zinc-500/12 text-zinc-400 border border-zinc-500/20',
    paid: 'bg-emerald-500/12 text-emerald-400 border border-emerald-500/20',
    pending: 'bg-amber-500/12 text-amber-400 border border-amber-500/20',
    overdue: 'bg-red-500/12 text-red-400 border border-red-500/20',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium mono tracking-wide ${map[status] ?? 'bg-zinc-700 text-zinc-300'}`}>
      {status}
    </span>
  )
}