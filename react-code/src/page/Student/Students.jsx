import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import DeleteConfirm from "../../components/ui/DeleteConfirm"
import CreateStudentModal from "./CreateStudentModal"
import EditStudentModal from "./EditStudentModal"
import Btn from "../../components/ui/Btn"
import Icons from "../../components/ui/Icons"
import Card from "../../components/ui/Card"
import Select from "../../components/ui/Select"
import Avatar from "../../components/ui/Avatar"
import StatusBadge from "../../components/ui/StatusBadge"
import { ClipLoader } from "react-spinners"

import { getStudents_API, deleteStudents_API } from "../../services/student.api"
import toast from "react-hot-toast"

const BRANCHES = [
  { id: 'b1', name: 'Downtown Campus', city: 'New York', studentCount: 142, activeCount: 128, manager: 'Sarah Chen', status: 'active' },
  { id: 'b2', name: 'Westside Center', city: 'Los Angeles', studentCount: 98, activeCount: 84, manager: 'Marcus Rivera', status: 'active' },
  { id: 'b3', name: 'Northgate Branch', city: 'Chicago', studentCount: 67, activeCount: 61, manager: 'Priya Patel', status: 'active' },
  { id: 'b4', name: 'Eastpark Hub', city: 'Houston', studentCount: 54, activeCount: 39, manager: 'James O\'Brien', status: 'active' },
  { id: 'b5', name: 'Southside Studio', city: 'Phoenix', studentCount: 33, activeCount: 20, manager: 'Aisha Williams', status: 'inactive' },
  { id: 'b6', name: 'Harbor View', city: 'Seattle', studentCount: 78, activeCount: 71, manager: 'Tom Nakamura', status: 'active' },
]


export default  function Students() {
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [branchFilter, setBranchFilter] = useState('all')

  const [showCreate, setShowCreate] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editStudent, setEditStudent] = useState(null)
  const [apiLoading, setApiLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)

  const handleGetStudents = async () => {
    try {
      setFetchLoading(true)
      const res = await getStudents_API()

      if (res?.data?.success) {
        setStudents(res?.data?.data || [])
      } else {
        toast.error(res?.data?.message || "fetch failed")
      }
    } catch (error) {
      console.error(error)
      toast.error('An unexpected error')
    } finally {
      setFetchLoading(false)
    }
  }

  useEffect(() => {
    handleGetStudents()
  }, [])

  const handleDelete = async (id) => {
    try {
      setApiLoading(true)
      const res = await deleteStudents_API(id)

      if (res?.data?.success) {
        toast.success(res?.data?.message)
        setStudents(students.filter(s => s.id !== id))
        setDeleteId(null)
      } else {
        toast.error(res?.data?.message || "delete failed")
      }
    } catch (error) {
      console.error(error)
      toast.error('An unexpected error')
    } finally {
      setApiLoading(false)
    }
  }



  return (
    <div className="p-6 space-y-5">
      {showCreate && (
        <CreateStudentModal onClose={() => setShowCreate(false)} handleGetStudents={handleGetStudents} />
      )}
      {deleteId && (
        <DeleteConfirm
          apiLoading={apiLoading}
          name={students.find(s => s.id === deleteId)?.name ?? ''}
          onClose={() => setDeleteId(null)}
          onDelete={() => handleDelete(deleteId)}
        />
      )}
      {editStudent && (
        <EditStudentModal
          setStudents={setStudents}
          students={students}
          student={editStudent}
          onClose={() => setEditStudent(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Student Management</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {fetchLoading ? 'Loading students...' : `${students.length} students found`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Btn variant="secondary" size="sm">{Icons.export} Export</Btn>
          <Btn variant="primary" size="sm" onClick={() => setShowCreate(true)}>{Icons.plus} Add Student</Btn>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">{Icons.search}</span>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value);  }}
              placeholder="Search by name or email..."
              className="w-full bg-white/4 border border-white/8 rounded-md pl-9 pr-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-indigo-500/60 transition"
            />
          </div>
          <div className="flex items-center gap-2 text-zinc-600">{Icons.filter}</div>
          <Select value={statusFilter} onChange={v => { setStatusFilter(v);  }}
            options={[{ label: 'All Status', value: 'all' }, { label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]} />
          <Select value={branchFilter} onChange={v => { setBranchFilter(v);  }}
            options={[{ label: 'All Branches', value: 'all' }, ...BRANCHES.map(b => ({ label: b.name, value: b.id }))]} />
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {fetchLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <ClipLoader color="#6366f1" size={36} />
            <p className="text-sm text-zinc-500">Loading students...</p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Student', 'Course', 'Branch', 'Enrolled', 'Status', 'Payment', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-medium text-zinc-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {students.map(s => (
                <tr key={s.id} className="hover:bg-white/2 transition group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={s.avatar} size="sm" />
                      <div>
                        <div className="text-sm font-medium text-zinc-200">{s.name}</div>
                        <div className="text-xs text-zinc-600">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{s.course}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{s.branch}</td>
                  <td className="px-4 py-3">
                    <span className="mono text-xs text-zinc-500">{s.enrollDate}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3"><StatusBadge status={s.paymentStatus} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <Link
                        to={`/student/${s.id}`}
                        className="p-1.5 text-zinc-600 hover:text-indigo-400 hover:bg-indigo-500/10 rounded transition"
                        title="View"
                      >
                        {Icons.eye}
                      </Link>
                      <button onClick={() => setDeleteId(s.id)}
                        className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded transition" title="Delete">
                        {Icons.trash}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </Card>
    </div>
  )
}