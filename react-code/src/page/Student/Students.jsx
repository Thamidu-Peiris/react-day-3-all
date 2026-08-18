import { useEffect, useState } from "react"
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

import axios from "axios"
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
  const [loading, setLoading] = useState(true)
  const [apiLoading, setApiLoading] = useState(false)

  const fetchStudents = async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true)
      const res = await axios.get("http://localhost:9000/student");

      if (res?.data?.success) {
        setStudents(res.data.data || []);
      } else {
        toast.error(res?.data?.message || "Failed to fetch students");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch students");
    } finally {
      if (showLoader) setLoading(false)
    }
  };

  useEffect(() => {
    fetchStudents(true);
  }, []);

  const handleCreate = async (value) => {
    try {
      setApiLoading(true)
      const res = await axios.post('http://localhost:9000/student', value, 
        {validateStatus: (status)=> status >= 200 & status <=499});

      if (res?.data?.success){
        toast.success(res?.data?.message);
        setShowCreate(false);
        await fetchStudents();
      }else{
        toast.error(res?.data?.message || "create failed");
      }
      } catch (error) {
      console.error(error)
      toast.error('An unexpected error')
    } finally {
      setApiLoading(false)
    }
  }

  const handleEdit = async (value) => {
    try {
      setApiLoading(true)
      const res = await axios.put(`http://localhost:9000/student/${value.id}`, {
        name: value.name,
        age: String(value.age),
        email: value.email,
        branchId: value.branchId,
        status: value.status,
        paymentStatus: value.paymentStatus,
        enrollDate: value.enrollDate,
      }, { validateStatus: (status) => status >= 200 && status <= 499 });

      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setEditStudent(null);
        await fetchStudents();
      } else {
        const errorMsg = res?.data?.errors?.map((e) => e.message).join(", ") || res?.data?.message || "Update failed";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error");
    } finally {
      setApiLoading(false);
    }
  }

  const handleDelete = async (id) => {
    try {
      setApiLoading(true)
      const res = await axios.delete(`http://localhost:9000/student/${id}`, {
        validateStatus: (status) => status >= 200 && status <= 499,
      });

      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setDeleteId(null);
        await fetchStudents();
      } else {
        toast.error(res?.data?.message || "Delete failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error");
    } finally {
      setApiLoading(false);
    }
  }
  



  const isLoading = loading

  return (
    <div className="p-6 space-y-5">
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm ${!isLoading ? "hidden" : ""}`}>
        <div className="flex flex-col items-center gap-3 rounded-xl border border-white/8 bg-[#111318] px-8 py-6 shadow-xl">
          <ClipLoader
            color="#6366f1"
            loading={isLoading}
            cssOverride={{ display: "block", margin: "0 auto" }}
            size={45}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <p className="text-sm text-zinc-400">
            {loading ? "Loading students..." : "Please wait..."}
          </p>
        </div>
      </div>
      {showCreate && (
        <CreateStudentModal apiLoading={apiLoading}  onClose={() => setShowCreate(false)} onSave={(value)=>handleCreate(value)} />
      )}
      {deleteId && (
        <DeleteConfirm 
          name={students.find(s => s.id === deleteId)?.name ?? ''}
          onClose={() => setDeleteId(null)}
          onDelete={() => handleDelete(deleteId)}
          apiLoading={apiLoading}
        />
      )}
      {editStudent && (
        <EditStudentModal
          student={editStudent}
          onClose={() => setEditStudent(null)}
          onSave={(value) => handleEdit(value)}
          apiLoading={apiLoading}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Student Management</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{students.length} students found</p>
        </div>
        <div className="flex items-center gap-2">
          <Btn variant="secondary" size="sm">{Icons.export} Export</Btn>
          <Btn variant="primary" size="sm" onClick={() => setShowCreate(true)}>{Icons.plus} Add Student</Btn>
        </div>
      </div>

      {/* Filters --*/}
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

      {/* Table-- */}
      <Card className="overflow-hidden">
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
              {!loading && students.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-zinc-500">
                    No students found
                  </td>
                </tr>
              )}
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
                      <button 
                        className="p-1.5 text-zinc-600 hover:text-indigo-400 hover:bg-indigo-500/10 rounded transition" title="View">
                        {Icons.eye}
                      </button>
                      <button onClick={() => setEditStudent(s)}
                        className="p-1.5 text-zinc-600 hover:text-zinc-300 hover:bg-white/8 rounded transition" title="Edit">
                        {Icons.edit}
                      </button>
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

    
      </Card>
    </div>
  )
}