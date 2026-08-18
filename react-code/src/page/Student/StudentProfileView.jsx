import { useState } from "react"
import EditStudentModal from "./EditStudentModal"
import Card from "../../components/ui/Card"
import StatusBadge from "../../components/ui/StatusBadge"
import Icons from "../../components/ui/Icons"
import Avatar from "../../components/ui/Avatar"
import Btn from "../../components/ui/Btn"

export default function StudentProfileView({ studentId, students, setStudents, setView, showToast }) {
  const s = students.find(x => x.id === studentId)
  const [editStudent, setEditStudent] = useState(null)
  if (!s) return <div className="p-6 text-zinc-500">Student not found</div>

  const activity = [
    { label: 'Assignment submitted', time: '2 hours ago', color: 'bg-indigo-500' },
    { label: 'Attendance marked', time: 'Yesterday, 9:00 AM', color: 'bg-emerald-500' },
    { label: 'Payment received', time: 'Aug 10, 2026', color: 'bg-amber-500' },
    { label: 'Profile updated', time: 'Aug 8, 2026', color: 'bg-zinc-500' },
    { label: 'Enrolled in course', time: s.enrollDate, color: 'bg-violet-500' },
  ]

  return (
    <div className="p-6 space-y-5">
      {editStudent && (
        <EditStudentModal student={editStudent} onClose={() => setEditStudent(null)} onSave={updated => {
          setStudents(students.map(x => x.id === updated.id ? updated : x))
          setEditStudent(null)
          showToast('Student updated successfully')
        }} />
      )}
      <div className="flex items-center gap-3">
        <button onClick={() => setView('students')} className="text-zinc-600 hover:text-zinc-300 bg-white/4 rounded-lg p-2 transition">
          {Icons.arrowLeft}
        </button>
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Student Profile</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Last active {s.lastActivity}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Personal Info */}
        <Card className="lg:col-span-2 p-5 space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar initials={s.avatar} size="lg" />
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">{s.name}</h2>
                <div className="text-sm text-zinc-500">{s.course}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <StatusBadge status={s.status} />
                  <StatusBadge status={s.paymentStatus} />
                </div>
              </div>
            </div>
            <Btn variant="secondary" size="sm" onClick={() => setEditStudent(s)}>{Icons.edit} Edit</Btn>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
            {[
              { label: 'Email', value: s.email },
              { label: 'Phone', value: s.phone },
              { label: 'Age', value: `${s.age} years` },
              { label: 'Address', value: s.address },
              { label: 'Branch', value: s.branch },
              { label: 'Enrolled', value: s.enrollDate },
            ].map(f => (
              <div key={f.label}>
                <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">{f.label}</div>
                <div className="text-sm text-zinc-300">{f.value}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Sidebar info */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Payment Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Current Period</span>
                <StatusBadge status={s.paymentStatus} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Next Due</span>
                <span className="mono text-xs text-zinc-300">Sep 1, 2026</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Total Paid</span>
                <span className="mono text-xs text-emerald-400">$3,600</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 mt-2">
                <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '75%' }} />
              </div>
              <p className="text-[10px] text-zinc-600">75% of course fee paid</p>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Attendance</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">This Month</span>
                <span className="mono text-xs text-emerald-400">18/20 days</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '90%' }} />
              </div>
              <p className="text-[10px] text-zinc-600">90% attendance rate</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-zinc-200 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {activity.map((a, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${a.color} shrink-0`} />
              <div className="flex-1 text-sm text-zinc-400">{a.label}</div>
              <div className="text-xs text-zinc-600">{a.time}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}