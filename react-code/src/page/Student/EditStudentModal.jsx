import { useState } from "react"
import Btn from "../../components/ui/Btn"
import Input from "../../components/ui/Input"
import Modal from "../../components/ui/Modal"
import Select from "../../components/ui/Select"
import editStudentSchema from "../../validation/editstudent.schema.js"
import { validateForm } from "../../validation/validation.schema.js"

const BRANCHES = [
  { id: 'b1', name: 'Downtown Campus', city: 'New York', studentCount: 142, activeCount: 128, manager: 'Sarah Chen', status: 'active' },
  { id: 'b2', name: 'Westside Center', city: 'Los Angeles', studentCount: 98, activeCount: 84, manager: 'Marcus Rivera', status: 'active' },
  { id: 'b3', name: 'Northgate Branch', city: 'Chicago', studentCount: 67, activeCount: 61, manager: 'Priya Patel', status: 'active' },
  { id: 'b4', name: 'Eastpark Hub', city: 'Houston', studentCount: 54, activeCount: 39, manager: 'James O\'Brien', status: 'active' },
  { id: 'b5', name: 'Southside Studio', city: 'Phoenix', studentCount: 33, activeCount: 20, manager: 'Aisha Williams', status: 'inactive' },
  { id: 'b6', name: 'Harbor View', city: 'Seattle', studentCount: 78, activeCount: 71, manager: 'Tom Nakamura', status: 'active' },
]

export default function EditStudentModal({ student, onClose, onSave, apiLoading = false }) {
  const [form, setForm] = useState({
    ...student,
    email: student.email || "",
    age: String(student.age ?? ""),
    branchId: student.branchId || "b1",
    status: student.status || "active",
    paymentStatus: student.paymentStatus || "pending",
  })
  const [errors, setErrors] = useState({})

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleSave = () => {
    const result = validateForm(editStudentSchema, {
      name: form.name,
      age: String(form.age),
      email: form.email,
      branchId: form.branchId,
    })

    if (!result.success) {
      setErrors(result.errors)
      return
    }

    onSave(form)
  }

  return (
    <Modal title="Edit Student" onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Full Name</label>
            <Input value={form.name} onChange={(value) => updateField('name', value)} error={errors.name} className="w-full" />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Age</label>
            <Input value={String(form.age)} type="number" onChange={value => updateField('age', value)} error={errors.age} className="w-full" />
            {errors.age && <p className="text-xs text-red-400 mt-1">{errors.age}</p>}
          </div>
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Email</label>
          <Input value={form.email} onChange={(value) => updateField('email', value)} error={errors.email} className="w-full" />
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Status</label>
          <Select value={form.status} onChange={v => setForm(f => ({ ...f, status: v  }))}
            options={[{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]} className="w-full" />
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Payment Status</label>
          <Select value={form.paymentStatus} onChange={v => setForm(f => ({ ...f, paymentStatus: v }))}
            options={[{ label: 'Paid', value: 'paid' }, { label: 'Pending', value: 'pending' }, { label: 'Overdue', value: 'overdue' }]} className="w-full" />
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Branch</label>
          <Select value={form.branchId} onChange={v => {
            const b = BRANCHES.find(x => x.id === v)
            setForm(f => ({
              ...f,
              branchId: v,
              branch: b?.name || f.branch,
            }))
          }} options={BRANCHES.map(b => ({ label: b.name, value: b.id }))} className="w-full" />
          {errors.branchId && <p className="text-xs text-red-400 mt-1">{errors.branchId}</p>}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Btn variant="secondary" onClick={onClose} disabled={apiLoading}>Cancel</Btn>
          <Btn variant="primary" loading={apiLoading} onClick={handleSave}>Save Changes</Btn>
        </div>
      </div>
    </Modal>
  )
}
