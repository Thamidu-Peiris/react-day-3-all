import { useState } from "react"
import Btn from "../../components/ui/Btn"
import Input from "../../components/ui/Input"
import Modal from "../../components/ui/Modal"
import Select from "../../components/ui/Select"
import editBranchSchema from "../../schemas/editBranch.schema.js"
import { editBranches_API } from "../../services/branch.api"
import toast from "react-hot-toast"

export default function EditBranchModal({ branch, onClose, setBranches, branches }) {
  const [form, setForm] = useState({ ...branch })
  const [errors, setErrors] = useState({})
  const [apiLoading, setApiLoading] = useState(false)

  const set = (field) => (value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleEdit = async () => {
    try {
      const data = {
        name: form.name,
        city: form.city,
        studentCount: parseInt(form.studentCount),
        activeCount: parseInt(form.activeCount),
        manager: form.manager,
        status: form.status,
      }
      setApiLoading(true)
      const res = await editBranches_API(branch.id, data)

      if (res?.data?.success) {
        toast.success(res?.data?.message)
        setBranches(branches.map(b => b.id === res.data.data.id ? res.data.data : b))
        onClose()
      } else {
        toast.error(res?.data?.message || "update failed")
      }
    } catch (error) {
      console.error(error)
      toast.error('An unexpected error')
    } finally {
      setApiLoading(false)
    }
  }

  const handleSave = () => {
    const result = editBranchSchema.safeParse({
      ...form,
      studentCount: Number(form.studentCount),
      activeCount: Number(form.activeCount),
    })

    if (!result.success) {
      const fieldErrors = {}
      result.error.issues.forEach(issue => {
        const field = issue.path[0]
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    handleEdit()
  }

  return (
    <Modal title="Edit Branch" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Branch Name *</label>
          <Input value={form.name} onChange={set('name')} className="w-full" />
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">City *</label>
          <Input value={form.city} onChange={set('city')} className="w-full" />
          {errors.city && <p className="text-xs text-red-400 mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Manager *</label>
          <Input value={form.manager} onChange={set('manager')} className="w-full" />
          {errors.manager && <p className="text-xs text-red-400 mt-1">{errors.manager}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Student Count *</label>
            <Input value={String(form.studentCount)} type="number" onChange={set('studentCount')} className="w-full" />
            {errors.studentCount && <p className="text-xs text-red-400 mt-1">{errors.studentCount}</p>}
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Active Count *</label>
            <Input value={String(form.activeCount)} type="number" onChange={set('activeCount')} className="w-full" />
            {errors.activeCount && <p className="text-xs text-red-400 mt-1">{errors.activeCount}</p>}
          </div>
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Status *</label>
          <Select
            value={form.status}
            onChange={set('status')}
            options={[{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]}
            className="w-full"
          />
          {errors.status && <p className="text-xs text-red-400 mt-1">{errors.status}</p>}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn disabled={apiLoading} loading={apiLoading} variant="primary" onClick={handleSave}>Save Changes</Btn>
        </div>
      </div>
    </Modal>
  )
}
