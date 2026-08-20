import { useEffect, useState } from "react"
import Modal from "../../components/ui/Modal"
import Input from "../../components/ui/Input"
import Select from "../../components/ui/Select"
import Btn from "../../components/ui/Btn"
import createStudentSchema from "../../schemas/createStudent.schema.js"
import { getBranches_API } from "../../services/branch.api"
import { createStudents_API } from "../../services/student.api"
import toast from "react-hot-toast"

export default function CreateStudentModal({ onClose, handleGetStudents }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    branchId: '',
    age: ''
  })
  const [branches, setBranches] = useState([])
  const [errors, setErrors] = useState({})
  const [apiLoading, setApiLoading] = useState(false)

  const handleGetBranches = async () => {
    try {
      const res = await getBranches_API()

      if (res?.data?.success) {
        const data = res?.data?.data || []
        setBranches(data)
        if (data[0]?.id) {
          setForm(prev => prev.branchId ? prev : { ...prev, branchId: data[0].id })
        }
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

  const handleCreate = async () => {
    try {
      const data = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        course: form.course || 'General',
        branchId: form.branchId,
        age: parseInt(form.age),
      }
      setApiLoading(true)
      const res = await createStudents_API(data)

      if (res?.data?.success) {
        toast.success(res?.data?.message)
        onClose()
        handleGetStudents()
      } else {
        toast.error(res?.data?.message || "create failed")
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
    const result = createStudentSchema.safeParse({
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
    handleCreate()
  }

  return (
    <Modal title="Create Student" onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Full Name *</label>
            <Input
              placeholder="Jane Doe"
              value={form.name}
              onChange={set('name')}
              className="w-full"
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Age *</label>
            <Input
              placeholder="22"
              type="number"
              value={form.age}
              onChange={set('age')}
              className="w-full"
            />
            {errors.age && <p className="text-xs text-red-400 mt-1">{errors.age}</p>}
          </div>
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Email *</label>
          <Input
            placeholder="jane@example.com"
            type="email"
            value={form.email}
            onChange={set('email')}
            className="w-full"
          />
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Phone *</label>
          <Input
            placeholder="+1 (555) 000-0000"
            value={form.phone}
            onChange={set('phone')}
            className="w-full"
          />
          {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Course</label>
          <Input
            placeholder="Full-Stack Development"
            value={form.course}
            onChange={set('course')}
            className="w-full"
          />
          {errors.course && <p className="text-xs text-red-400 mt-1">{errors.course}</p>}
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
          <Btn disabled={apiLoading} loading={apiLoading} variant="primary" onClick={handleSave}>Create Student</Btn>
        </div>
      </div>
    </Modal>
  )
}
