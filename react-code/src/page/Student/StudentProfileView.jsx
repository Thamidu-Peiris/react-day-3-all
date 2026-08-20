import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import EditStudentModal from "./EditStudentModal"
import Card from "../../components/ui/Card"
import StatusBadge from "../../components/ui/StatusBadge"
import Icons from "../../components/ui/Icons"
import Avatar from "../../components/ui/Avatar"
import Btn from "../../components/ui/Btn"
import { ClipLoader } from "react-spinners"
import { getStudent_API } from "../../services/student.api"
import toast from "react-hot-toast"

export default function StudentProfileView() {
  const { s_id } = useParams()
  const [student, setStudent] = useState(null)
  const [editStudent, setEditStudent] = useState(null)
  const [fetchLoading, setFetchLoading] = useState(true)

  const handleGetStudent = async () => {
    try {
      setFetchLoading(true)
      const res = await getStudent_API(s_id)

      if (res?.data?.success) {
        setStudent(res?.data?.data || null)
      } else {
        setStudent(null)
        toast.error(res?.data?.message || "fetch failed")
      }
    } catch (error) {
      console.error(error)
      setStudent(null)
      toast.error('An unexpected error')
    } finally {
      setFetchLoading(false)
    }
  }

  useEffect(() => {
    handleGetStudent()
  }, [s_id])

  if (fetchLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <ClipLoader color="#6366f1" size={36} />
        <p className="text-sm text-zinc-500">Loading student...</p>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="p-6 space-y-4">
        <Link to="/students" className="text-zinc-600 hover:text-zinc-300 bg-white/4 rounded-lg p-2 transition inline-flex">
          {Icons.arrowLeft}
        </Link>
        <div className="text-zinc-500">Student not found</div>
      </div>
    )
  }

  const attendance = [
    { id: 1, date: '2026-08-20', on: '09:00 AM', off: '05:30 PM' },
    { id: 2, date: '2026-08-19', on: '09:05 AM', off: '05:15 PM' },
    { id: 3, date: '2026-08-18', on: '-', off: '-' },
    { id: 4, date: '2026-08-17', on: '08:55 AM', off: '05:45 PM' },
    { id: 5, date: '2026-08-16', on: '09:10 AM', off: '05:20 PM' },
  ]

  const presentDays = attendance.filter(a => a.on !== '-').length


  return (
    <div className="p-6 space-y-5">
      {editStudent && (
        <EditStudentModal
          student={editStudent}
          students={[student]}
          setStudents={(list) => {
            const updated = list.find(x => x.id === student.id)
            if (updated) setStudent(updated)
          }}
          onClose={() => setEditStudent(null)}
        />
      )}
      <div className="flex items-center gap-3">
        <Link to="/students" className="text-zinc-600 hover:text-zinc-300 bg-white/4 rounded-lg p-2 transition">
          {Icons.arrowLeft}
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Student Profile</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{student.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5 space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar initials={student.avatar} size="lg" />
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">{student.name}</h2>
                <div className="text-sm text-zinc-500">{student.course}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <StatusBadge status={student.status} />
                  <StatusBadge status={student.paymentStatus} />
                </div>
              </div>
            </div>
            <Btn variant="secondary" size="sm" onClick={() => setEditStudent(student)}>{Icons.edit} Edit</Btn>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
            {[
              { label: 'Email', value: student.email },
              { label: 'Phone', value: student.phone },
              { label: 'Age', value: `${student.age} years` },
              { label: 'Course', value: student.course },
              { label: 'Branch', value: student.branch },
              { label: 'Enrolled', value: student.enrollDate },
            ].map(f => (
              <div key={f.label}>
                <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">{f.label}</div>
                <div className="text-sm text-zinc-300">{f.value || '-'}</div>
              </div>
            ))}
          </div>
        </Card>

        
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="text-sm font-semibold text-zinc-200">Attendance</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Check-in (On) and check-out (Off) times</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Date', 'On', 'Off'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-medium text-zinc-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {attendance.map(row => (
                <tr key={row.id} className="hover:bg-white/2 transition">
                  <td className="px-4 py-3">
                    <span className="mono text-xs text-zinc-300">{row.date}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="mono text-xs text-emerald-400">{row.on}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="mono text-xs text-amber-400">{row.off}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      
    </div>
  )
}