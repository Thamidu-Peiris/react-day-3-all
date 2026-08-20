import { Link, useLocation } from "react-router-dom"
import Avatar from "./ui/Avatar"
import Icons from "./ui/Icons"

const NAV = [
  { id: 'students', url:'/students' ,   label: 'Students', icon: Icons.students },
  { id: 'branches', url:'/branches'  ,  label: 'Branches', icon: Icons.branches }
]

export default function Sidebar({ collapsed, setCollapsed }) {

  


  const path = useLocation();
  const url = path.pathname.replace('/', '');


  return (
    <aside className={`${collapsed ? 'w-16' : 'w-56'} shrink-0 bg-[#0e0f14] border-r h-dvh border-white/5 flex flex-col transition-all duration-200`}>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        {!collapsed && <span className="font-semibold text-zinc-100 text-sm tracking-tight">EduTrack</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-zinc-600 hover:text-zinc-400 transition"
        >
          {Icons.menu}
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {NAV.map(item => (
          <Link key={item.id} to={item.url} >
            <button
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                url === item.id
                  ? 'bg-indigo-600/15 text-indigo-400'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/4'
              }`}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </button>
          </Link>
        ))}
      </nav>

      {!collapsed && (
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <Avatar initials="AD" size="sm" color="bg-indigo-700" />
            <div className="min-w-0">
              <div className="text-xs font-medium text-zinc-300 truncate">Admin User</div>
              <div className="text-[10px] text-zinc-600">admin@edutrack.io</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
