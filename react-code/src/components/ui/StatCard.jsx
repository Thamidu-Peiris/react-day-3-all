import Card from "./Card";
import Icons from "./Icons";

export default function StatCard({ label, value, sub, trend, icon, accent }) {
  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500 font-medium tracking-wide uppercase">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent}`}>{icon}</div>
      </div>
      <div>
        <div className="mono text-3xl font-semibold text-zinc-100">{value}</div>
        {sub && <div className="text-xs text-zinc-500 mt-0.5">{sub}</div>}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trend.dir === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend.dir === 'up' ? Icons.trendUp : Icons.trendDown}
          {trend.val}% vs last month
        </div>
      )}
    </Card>
  )
}