import { useEffect, useState } from "react"
import Btn from "../../components/ui/Btn"
import Input from "../../components/ui/Input"
import Modal from "../../components/ui/Modal"
import Select from "../../components/ui/Select"
import editStudentSchema from "../../schemas/editStudent.schema.js"
import { getBranches_API } from "../../services/branch.api"
import { editStudents_API } from "../../services/student.api"
import toast from "react-hot-toast"

export default function EditStudentModal({ student, onClose,setStudents,students }) {
  const [form, setForm] = useState({ ...student })
  const [branches, setBranches] = useState([])
  const [errors, setErrors] = useState({})
  const [apiLoading,setApiLoading] = useState(false)

  const handleGetBranches = async () => {
    try {
      const res = await getBranches_API()

      if (res?.data?.success) {
        setBranches(res?.data?.data || [])
      } else {
        toast.error(res?.data?.message || "fetch failed")
      }
    } catch (error) {
      console.error(error)
      toast.error('An unexpected error')
    }
  }

  useEffect(() => {
    handleGetBranches()
  }, [])

  const set = (field) => (value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  

  const handleEdit = async (value) => {
    try {

      const data = {
      name: form.name,
      email: form.email,
      age: parseInt(form.age),
      course: form.course || 'General',
      status: form.status,
      paymentStatus: form.paymentStatus,
      branchId: form.branchId,
      // branch: branch?.name || student.branch,
      // avatar: result.data.name
      //   .split(' ')
      //   .map(w => w[0])
      //   .join('').slice(0, 2)
      //   .toUpperCase(),
      }
      setApiLoading(true)
      const res = await editStudents_API(student.id, data)

      if (res?.data?.success) {
        toast.success(res?.data?.message)
        setStudents(students.map(s => s.id === res.data.data.id ? res.data.data : s))
        onClose()
      } else {
        toast.error(res?.data?.message || "update failed")
        if (res?.data?.errors) {
          setErrors(res.data.errors)
        }
      }
    } catch (error) {
      console.error(error)
      toast.error('An unexpected error')
    } finally {
      setApiLoading(false)
    }
  }



  const handleSave = () => {
    const result = editStudentSchema.safeParse({
      ...form,
      age: Number(form.age),
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
    <Modal title="Edit Student" onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Full Name *</label>
            <Input value={form.name} onChange={set('name')} className="w-full" />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Age *</label>
            <Input value={String(form.age)} type="number" onChange={set('age')} className="w-full" />
            {errors.age && <p className="text-xs text-red-400 mt-1">{errors.age}</p>}
          </div>
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Email *</label>
          <Input value={form.email} onChange={set('email')} className="w-full" />
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Course</label>
          <Input
            placeholder="Full-Stack Development"
            value={form.course || ''}
            onChange={set('course')}
            className="w-full"
          />
          {errors.course && <p className="text-xs text-red-400 mt-1">{errors.course}</p>}
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
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Payment Status *</label>
          <Select
            value={form.paymentStatus}
            onChange={set('paymentStatus')}
            options={[{ label: 'Paid', value: 'paid' }, { label: 'Pending', value: 'pending' }, { label: 'Overdue', value: 'overdue' }]}
            className="w-full"
          />
          {errors.paymentStatus && <p className="text-xs text-red-400 mt-1">{errors.paymentStatus}</p>}
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Branch *</label>
          <Select
            value={form.branchId}
            onChange={set('branchId')}
            options={branches.map(b => ({ label: b.name, value: b.id }))}
            className="w-full"
          />
          {errors.branchId && <p className="text-xs text-red-400 mt-1">{errors.branchId}</p>}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn disabled={apiLoading} loading={apiLoading} variant="primary" onClick={handleSave}>Save Changes</Btn>
        </div>
      </div>
    </Modal>
  )
}
