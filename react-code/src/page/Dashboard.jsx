import React from 'react'

export default function DashboardView({ students, setView, setProfileId }) {
  const total = students.length
  const active = students.filter(s => s.status === 'active').length
  const inactive = students.filter(s => s.status === 'inactive').length
  const recent = [...students].sort(() => Math.random() - 0.5).slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Thu, August 14, 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-zinc-500 hover:text-zinc-300 bg-white/4 rounded-lg p-2 transition relative">
            {icons.bell}
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={total} sub="Enrolled across all branches" trend={{ val: 8, dir: 'up' }}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-4 h-4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          accent="bg-indigo-600/20 text-indigo-400" />
        <StatCard label="Active Students" value={active} sub={`${Math.round(active/total*100)}% enrollment rate`} trend={{ val: 5, dir: 'up' }}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-4 h-4"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>}
          accent="bg-emerald-600/20 text-emerald-400" />
        <StatCard label="Inactive Students" value={inactive} sub="Awaiting reactivation" trend={{ val: 2, dir: 'down' }}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>}
          accent="bg-zinc-600/30 text-zinc-400" />
        <StatCard label="Branches" value={BRANCHES.filter(b => b.status === 'active').length} sub={`${BRANCHES.length} total locations`} trend={{ val: 1, dir: 'up' }}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-4 h-4"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>}
          accent="bg-violet-600/20 text-violet-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Students */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h2 className="text-sm font-semibold text-zinc-200">Recent Students</h2>
            <Btn variant="ghost" size="sm" onClick={() => setView('students')}>View all {icons.chevronRight}</Btn>
          </div>
          <div className="divide-y divide-white/4">
            {recent.map(s => (
              <div key={s.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/2 transition">
                <Avatar initials={s.avatar} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-zinc-200 truncate">{s.name}</div>
                  <div className="text-xs text-zinc-500 truncate">{s.course} · {s.branch}</div>
                </div>
                <StatusBadge status={s.status} />
                <button onClick={() => { setProfileId(s.id); setView('student-profile') }}
                  className="text-zinc-600 hover:text-indigo-400 transition ml-1">{icons.eye}</button>
              </div>
            ))}
          </div>
        </Card>

        {/* Branch Overview */}
        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h2 className="text-sm font-semibold text-zinc-200">Branch Overview</h2>
            <Btn variant="ghost" size="sm" onClick={() => setView('branches')}>All {icons.chevronRight}</Btn>
          </div>
          <div className="divide-y divide-white/4">
            {BRANCHES.slice(0, 5).map(b => (
              <div key={b.id} className="flex items-center gap-3 px-5 py-3">
                <div className={`w-2 h-2 rounded-full ${b.status === 'active' ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-zinc-300 truncate">{b.name}</div>
                  <div className="text-[10px] text-zinc-600">{b.city}</div>
                </div>
                <div className="mono text-xs text-zinc-400">{b.activeCount}<span className="text-zinc-700">/{b.studentCount}</span></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="px-5 py-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-zinc-200">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5">
          {[
            { label: 'Add Student', icon: icons.plus, color: 'bg-indigo-600/12 text-indigo-400 hover:bg-indigo-600/20', action: () => setView('students') },
            { label: 'View Reports', icon: icons.reports, color: 'bg-violet-600/12 text-violet-400 hover:bg-violet-600/20', action: () => setView('reports') },
            { label: 'Mark Attendance', icon: icons.attendance, color: 'bg-emerald-600/12 text-emerald-400 hover:bg-emerald-600/20', action: () => setView('attendance') },
            { label: 'Manage Payments', icon: icons.payments, color: 'bg-amber-600/12 text-amber-400 hover:bg-amber-600/20', action: () => setView('payments') },
          ].map(a => (
            <button key={a.label} onClick={a.action}
              className={`${a.color} flex flex-col items-center gap-2 py-4 rounded-xl transition cursor-pointer`}>
              {a.icon}
              <span className="text-xs font-medium">{a.label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}

