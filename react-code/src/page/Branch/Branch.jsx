import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import DeleteConfirm from "../../components/ui/DeleteConfirm"
import CreateBranchModal from "./CreateBranchModal"
import EditBranchModal from "./EditBranchModal"
import Btn from "../../components/ui/Btn"
import Icons from "../../components/ui/Icons"
import Card from "../../components/ui/Card"
import Select from "../../components/ui/Select"
import StatusBadge from "../../components/ui/StatusBadge"
import { ClipLoader } from "react-spinners"

import { getBranches_API, deleteBranches_API } from "../../services/branch.api"
import toast from "react-hot-toast"

export default function Branch() {
  const [branches, setBranches] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [showCreate, setShowCreate] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editBranch, setEditBranch] = useState(null)
  const [apiLoading, setApiLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)

  const handleGetBranches = async () => {
    try {
      setFetchLoading(true)
      const res = await getBranches_API()

      if (res?.data?.success) {
        setBranches(res?.data?.data || [])
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
    handleGetBranches()
  }, [])

  const handleDelete = async (id) => {
    try {
      setApiLoading(true)
      const res = await deleteBranches_API(id)

      if (res?.data?.success) {
        toast.success(res?.data?.message)
        setBranches(branches.filter(b => b.id !== id))
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

  const filtered = branches.filter(b => {
    const matchSearch =
      !search ||
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.city?.toLowerCase().includes(search.toLowerCase()) ||
      b.manager?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="p-6 space-y-5">
      {showCreate && (
        <CreateBranchModal onClose={() => setShowCreate(false)} handleGetBranches={handleGetBranches} />
      )}
      {deleteId && (
        <DeleteConfirm
          apiLoading={apiLoading}
          name={branches.find(b => b.id === deleteId)?.name ?? ''}
          onClose={() => setDeleteId(null)}
          onDelete={() => handleDelete(deleteId)}
        />
      )}
      {editBranch && (
        <EditBranchModal
          setBranches={setBranches}
          branches={branches}
          branch={editBranch}
          onClose={() => setEditBranch(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Branch Management</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {fetchLoading ? 'Loading branches...' : `${filtered.length} branches found`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Btn variant="secondary" size="sm">{Icons.export} Export</Btn>
          <Btn variant="primary" size="sm" onClick={() => setShowCreate(true)}>{Icons.plus} Add Branch</Btn>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">{Icons.search}</span>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); }}
              placeholder="Search by name, city or manager..."
              className="w-full bg-white/4 border border-white/8 rounded-md pl-9 pr-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-indigo-500/60 transition"
            />
          </div>
          <div className="flex items-center gap-2 text-zinc-600">{Icons.filter}</div>
          <Select value={statusFilter} onChange={v => { setStatusFilter(v); }}
            options={[{ label: 'All Status', value: 'all' }, { label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]} />
        </div>
      </Card>

      <Card className="overflow-hidden">
        {fetchLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <ClipLoader color="#6366f1" size={36} />
            <p className="text-sm text-zinc-500">Loading branches...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Branch', 'City', 'Manager', 'Students', 'Active', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-medium text-zinc-600 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-white/2 transition group">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-zinc-200">{b.name}</div>
                      <div className="text-xs text-zinc-600">{b.id}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400">{b.city}</td>
                    <td className="px-4 py-3 text-xs text-zinc-400">{b.manager}</td>
                    <td className="px-4 py-3">
                      <span className="mono text-xs text-zinc-500">{b.studentCount}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="mono text-xs text-zinc-500">{b.activeCount}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <Link
                          to={`/branch/${b.id}`}
                          className="p-1.5 text-zinc-600 hover:text-indigo-400 hover:bg-indigo-500/10 rounded transition"
                          title="View"
                        >
                          {Icons.eye}
                        </Link>
                        <button onClick={() => setEditBranch(b)}
                          className="p-1.5 text-zinc-600 hover:text-zinc-300 hover:bg-white/8 rounded transition" title="Edit">
                          {Icons.edit}
                        </button>
                        <button onClick={() => setDeleteId(b.id)}
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
